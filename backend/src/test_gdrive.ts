import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

async function main() {
  console.log('🚀 Iniciando prueba de conexión con Google Drive...');
  
  const keyFilePath = path.resolve(process.cwd(), 'google_drive_credentials.json');
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`No se encontró el archivo de credenciales en: ${keyFilePath}`);
  }

  const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf-8'));
  console.log(`🔑 Service Account autenticado: ${credentials.client_email}`);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  const drive = google.drive({ version: 'v3', auth });

  // 1. Buscar la carpeta 'Samanya' compartida o existente
  console.log('🔍 Buscando carpeta "Samanya"...');
  const listRes = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and name='Samanya' and trashed=false",
    fields: 'files(id, name, owners, webViewLink)',
    spaces: 'drive'
  });

  let samanyaFolderId: string;

  if (listRes.data.files && listRes.data.files.length > 0) {
    samanyaFolderId = listRes.data.files[0].id!;
    console.log(`✅ Carpeta "Samanya" encontrada con ID: ${samanyaFolderId}`);
  } else {
    console.log('📁 Carpeta "Samanya" no encontrada. Creando carpeta raíz "Samanya"...');
    const folderMetadata = {
      name: 'Samanya',
      mimeType: 'application/vnd.google-apps.folder'
    };
    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id, webViewLink'
    });
    samanyaFolderId = folder.data.id!;
    console.log(`✅ Carpeta "Samanya" creada exitosamente con ID: ${samanyaFolderId}`);
  }

  // 2. Crear un subdirectorio de prueba dentro de 'Samanya'
  const testSubfolderName = 'test_verificacion';
  console.log(`📁 Creando subdirectorio de prueba "${testSubfolderName}" dentro de "Samanya"...`);
  
  // Verificar si ya existe el subdirectorio
  const sublist = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${testSubfolderName}' and '${samanyaFolderId}' in parents and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });

  let testFolderId: string;
  if (sublist.data.files && sublist.data.files.length > 0) {
    testFolderId = sublist.data.files[0].id!;
    console.log(`ℹ️ Subdirectorio "${testSubfolderName}" ya existía con ID: ${testFolderId}`);
  } else {
    const subfolderRes = await drive.files.create({
      requestBody: {
        name: testSubfolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [samanyaFolderId]
      },
      fields: 'id'
    });
    testFolderId = subfolderRes.data.id!;
    console.log(`✅ Subdirectorio "${testSubfolderName}" creado con ID: ${testFolderId}`);
  }

  // 3. Crear un archivo de texto de prueba dentro de 'test_verificacion'
  const testFileName = `test_conexion_samanya_${Date.now()}.txt`;
  const fileContent = `================================================================================
SISTEMA DE GESTIÓN INTEGRAL PARA CENTROS GERIÁTRICOS (SAMANYA OS)
PRUEBA EXITOSA DE ALMACENAMIENTO EN GOOGLE DRIVE (1 TB)
================================================================================
Fecha y Hora de Prueba (Bogotá UTC-5): ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
Service Account: ${credentials.client_email}
Carpeta Raíz: Samanya (ID: ${samanyaFolderId})
Subdirectorio: ${testSubfolderName} (ID: ${testFolderId})
Archivo: ${testFileName}
Estado: CONEXIÓN EXITOSA Y OPERATIVA
================================================================================`;

  console.log(`📄 Subiendo archivo de prueba "${testFileName}"...`);
  const media = {
    mimeType: 'text/plain',
    body: Readable.from([fileContent])
  };

  const fileRes = await drive.files.create({
    requestBody: {
      name: testFileName,
      parents: [testFolderId]
    },
    media: media,
    supportsAllDrives: true,
    fields: 'id, name, webViewLink, size'
  });

  console.log(`🎉 ARCHIVO CREADO EXITOSAMENTE EN GOOGLE DRIVE!`);
  console.log(`🆔 ID del archivo: ${fileRes.data.id}`);
  console.log(`🔗 Enlace para visualizar: ${fileRes.data.webViewLink}`);
  console.log(`📏 Tamaño: ${fileRes.data.size || fileContent.length} bytes`);
}

main().catch(err => {
  console.error('❌ Error durante la prueba de Google Drive:', err);
  process.exit(1);
});
