import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { exec } from 'child_process';
import { Readable } from 'stream';

const PORT = 5123;
const REDIRECT_URI = `http://localhost:${PORT}`;
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];

async function main() {
  console.log('================================================================');
  console.log('🚀 CONFIGURACIÓN OAUTH 2.0 PARA GOOGLE DRIVE (1 TB PERSONAL)');
  console.log('================================================================\n');

  // 1. Buscar credenciales de cliente OAuth
  const possibleFiles = [
    'oauth_credentials.json',
    'client_secret.json',
    'google_drive_oauth.json'
  ];

  let clientSecretPath: string | null = null;
  for (const filename of possibleFiles) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(fullPath)) {
      clientSecretPath = fullPath;
      break;
    }
  }

  // Si no se encuentra con esos nombres, buscar cualquier archivo client_secret*.json
  if (!clientSecretPath) {
    const files = fs.readdirSync(process.cwd());
    const matched = files.find(f => f.startsWith('client_secret') && f.endsWith('.json'));
    if (matched) {
      clientSecretPath = path.resolve(process.cwd(), matched);
    }
  }

  if (!clientSecretPath) {
    console.error('❌ No se encontró el archivo de credenciales de cliente OAuth.');
    console.error('👉 Por favor descarga el archivo JSON de tu ID de cliente OAuth desde Google Cloud Console');
    console.error('   y guárdalo en la carpeta backend/ con el nombre: oauth_credentials.json\n');
    process.exit(1);
  }

  console.log(`📄 Archivo de credenciales encontrado: ${path.basename(clientSecretPath)}`);
  const rawData = JSON.parse(fs.readFileSync(clientSecretPath, 'utf-8'));
  const config = rawData.installed || rawData.web;

  if (!config || !config.client_id || !config.client_secret) {
    console.error('❌ El archivo JSON no tiene el formato esperado (debe contener "installed" o "web").');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Para recibir refresh_token
    prompt: 'consent',      // Para forzar entrega de refresh_token
    scope: SCOPES
  });

  console.log('\n----------------------------------------------------------------');
  console.log('🔑 PASO DE AUTORIZACIÓN:');
  console.log('Abre el siguiente enlace en tu navegador para autorizar a SAMANYA:');
  console.log('----------------------------------------------------------------\n');
  console.log(authUrl);
  console.log('\n----------------------------------------------------------------');
  console.log(`⏳ Esperando autorización en http://localhost:${PORT}/oauth2callback ...\n`);

  // Intentar abrir el navegador automáticamente en Windows
  try {
    exec(`start "" "${authUrl}"`);
  } catch (e) {
    // Si falla no pasa nada, el usuario tiene el link impreso
  }

  // Iniciar servidor HTTP temporal para capturar el código
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url) {
        const queryParams = new url.URL(req.url, `http://localhost:${PORT}`).searchParams;
        const code = queryParams.get('code');
        const error = queryParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<h1>Error de autorización: ${error}</h1>`);
          console.error(`❌ Error en autorización: ${error}`);
          server.close();
          process.exit(1);
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <html>
              <body style="font-family: system-ui; text-align: center; padding: 50px; background: #0f172a; color: white;">
                <h1 style="color: #22c55e;">✅ ¡Autorización Exitosa!</h1>
                <p>SAMANYA se ha conectado correctamente a tu cuenta de Google Drive de 1 TB.</p>
                <p>Puedes cerrar esta ventana y regresar a la consola.</p>
              </body>
            </html>
          `);

          console.log('✅ Código de autorización recibido de Google.');
          console.log('🔄 Canjeando código por tokens permanentes (Refresh Token)...');

          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          // Guardar tokens en google_user_tokens.json
          const tokenPath = path.resolve(process.cwd(), 'google_user_tokens.json');
          fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf-8');
          console.log(`💾 Tokens guardados exitosamente en: ${tokenPath}`);

          // Realizar prueba de creación y subida de archivo inmediatamente
          console.log('\n🧪 Ejecutando prueba de subida de archivo a Google Drive...');
          await testDriveUpload(oauth2Client);

          console.log('\n================================================================');
          console.log('🎉 ¡CONFIGURACIÓN Y PRUEBA COMPLETADAS CON ÉXITO!');
          console.log('================================================================\n');

          server.close();
          process.exit(0);
        }
      }
    } catch (err: any) {
      console.error('❌ Error procesando el token:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error procesando autorización: ' + err.message);
      server.close();
      process.exit(1);
    }
  });

  server.listen(PORT);
}

async function testDriveUpload(authClient: any) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  // 1. Buscar o crear carpeta 'Samanya'
  console.log('🔍 Buscando carpeta "Samanya"...');
  const listRes = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and name='Samanya' and trashed=false",
    fields: 'files(id, name, webViewLink)',
    spaces: 'drive'
  });

  let samanyaFolderId: string;
  if (listRes.data.files && listRes.data.files.length > 0) {
    samanyaFolderId = listRes.data.files[0].id!;
    console.log(`✅ Carpeta "Samanya" encontrada: ID ${samanyaFolderId}`);
  } else {
    console.log('📁 Creando carpeta raíz "Samanya"...');
    const folder = await drive.files.create({
      requestBody: {
        name: 'Samanya',
        mimeType: 'application/vnd.google-apps.folder'
      },
      fields: 'id, webViewLink'
    });
    samanyaFolderId = folder.data.id!;
    console.log(`✅ Carpeta "Samanya" creada: ID ${samanyaFolderId}`);
  }

  // 2. Subcarpeta de prueba
  const subfolderName = 'test_verificacion';
  console.log(`📁 Creando/verificando subcarpeta "${subfolderName}"...`);
  const sublist = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${subfolderName}' and '${samanyaFolderId}' in parents and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });

  let testFolderId: string;
  if (sublist.data.files && sublist.data.files.length > 0) {
    testFolderId = sublist.data.files[0].id!;
    console.log(`ℹ️ Subdirectorio ya existe: ID ${testFolderId}`);
  } else {
    const subfolderRes = await drive.files.create({
      requestBody: {
        name: subfolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [samanyaFolderId]
      },
      fields: 'id'
    });
    testFolderId = subfolderRes.data.id!;
    console.log(`✅ Subdirectorio creado: ID ${testFolderId}`);
  }

  // 3. Subir archivo de prueba
  const testFileName = `test_samanya_1tb_${Date.now()}.txt`;
  const fileContent = `================================================================================
SISTEMA DE GESTIÓN INTEGRAL PARA CENTROS GERIÁTRICOS (SAMANYA OS)
PRUEBA EXITOSA DE ALMACENAMIENTO EN GOOGLE DRIVE (1 TB - CUENTA PERSONAL)
================================================================================
Fecha y Hora de Prueba (Bogotá UTC-5): ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
Carpeta Raíz: Samanya (ID: ${samanyaFolderId})
Subdirectorio: ${subfolderName} (ID: ${testFolderId})
Archivo: ${testFileName}
Estado: CONECTADO Y TRANSMITIENDO CORRECTAMENTE A SU CUOTA PERSONAL DE 1 TB
================================================================================`;

  console.log(`📄 Subiendo archivo "${testFileName}" con su cuota personal...`);
  const fileRes = await drive.files.create({
    requestBody: {
      name: testFileName,
      parents: [testFolderId]
    },
    media: {
      mimeType: 'text/plain',
      body: Readable.from([fileContent])
    },
    fields: 'id, name, webViewLink, size'
  });

  console.log(`🎉 ARCHIVO SUBIDO Y VERIFICADO EXITOSAMENTE!`);
  console.log(`🆔 ID del archivo: ${fileRes.data.id}`);
  console.log(`🔗 Enlace en tu Google Drive: ${fileRes.data.webViewLink}`);
  console.log(`📏 Tamaño almacenado: ${fileRes.data.size || fileContent.length} bytes`);
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
