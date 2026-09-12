import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

export interface GDriveUploadResult {
  fileId: string;
  fileName: string;
  webViewLink?: string;
  webContentLink?: string;
  sizeBytes?: number;
  folderId: string;
}

export class GoogleDriveService {
  private driveClient: any = null;
  private rootFolderName = 'Samanya';

  /**
   * Inicializa el cliente de Google Drive usando OAuth 2.0 (cuenta autorizada)
   * o Service Account como fallback.
   */
  private async getClient(): Promise<any> {
    if (this.driveClient) {
      return this.driveClient;
    }

    const oauthCredsPath = path.resolve(process.cwd(), 'oauth_credentials.json');
    const userTokensPath = path.resolve(process.cwd(), 'google_user_tokens.json');

    if (fs.existsSync(oauthCredsPath) && fs.existsSync(userTokensPath)) {
      const oauthConfig = JSON.parse(fs.readFileSync(oauthCredsPath, 'utf-8'));
      const tokens = JSON.parse(fs.readFileSync(userTokensPath, 'utf-8'));
      const credentials = oauthConfig.installed || oauthConfig.web;

      const oauth2Client = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.redirect_uris ? credentials.redirect_uris[0] : 'http://localhost'
      );

      oauth2Client.setCredentials(tokens);

      // Listener para actualizar tokens si se refrescan automáticamente
      oauth2Client.on('tokens', (newTokens) => {
        const mergedTokens = { ...tokens, ...newTokens };
        try {
          fs.writeFileSync(userTokensPath, JSON.stringify(mergedTokens, null, 2), 'utf-8');
        } catch (err) {
          console.warn('⚠️ No se pudieron persistir los tokens refrescados en disco:', err);
        }
      });

      this.driveClient = google.drive({ version: 'v3', auth: oauth2Client });
      return this.driveClient;
    }

    // Fallback: Service Account si existe
    const serviceAccountPath = path.resolve(process.cwd(), 'google_drive_credentials.json');
    if (fs.existsSync(serviceAccountPath)) {
      const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/drive']
      });
      this.driveClient = google.drive({ version: 'v3', auth });
      return this.driveClient;
    }

    throw new Error(
      'No se encontraron credenciales válidas de Google Drive (oauth_credentials.json + google_user_tokens.json o google_drive_credentials.json).'
    );
  }

  /**
   * Busca o crea un directorio por su nombre dentro de una carpeta padre opcional
   */
  async obtenerOCrearCarpeta(nombreCarpeta: string, idPadre?: string): Promise<string> {
    const drive = await this.getClient();
    const nombreSanitizado = nombreCarpeta.replace(/'/g, "\\'");

    const queryParts = [
      `mimeType='application/vnd.google-apps.folder'`,
      `name='${nombreSanitizado}'`,
      `trashed=false`
    ];

    if (idPadre) {
      queryParts.push(`'${idPadre}' in parents`);
    }

    const q = queryParts.join(' and ');

    const res = await drive.files.list({
      q,
      fields: 'files(id, name)',
      spaces: 'drive',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id!;
    }

    // Si no existe, crear la carpeta
    const metadata: any = {
      name: nombreCarpeta,
      mimeType: 'application/vnd.google-apps.folder'
    };

    if (idPadre) {
      metadata.parents = [idPadre];
    }

    const folderRes = await drive.files.create({
      requestBody: metadata,
      fields: 'id, name',
      supportsAllDrives: true
    });

    return folderRes.data.id!;
  }

  /**
   * Asegura la jerarquía completa requerida:
   * Samanya -> {id_sede}_{Nombre Sede} -> {id_residente}_{identificacion} -> Documentos
   */
  async asegurarJerarquiaDirectorios(
    nombreCarpetaSede: string,
    nombreCarpetaResidente: string
  ): Promise<string> {
    // 1. Carpeta raíz 'Samanya'
    const idRaiz = await this.obtenerOCrearCarpeta(this.rootFolderName);

    // 2. Carpeta de Sede (ej: 1_SEDE-CENTRAL)
    const idSede = await this.obtenerOCrearCarpeta(nombreCarpetaSede, idRaiz);

    // 3. Carpeta de Residente (ej: 1_19234567)
    const idResidente = await this.obtenerOCrearCarpeta(nombreCarpetaResidente, idSede);

    // 4. Carpeta 'Documentos'
    const idDocumentos = await this.obtenerOCrearCarpeta('Documentos', idResidente);

    return idDocumentos;
  }

  /**
   * Sube un archivo con su nombre hasheado a la carpeta Documentos de ese residente
   */
  async subirArchivo(params: {
    nombreCarpetaSede: string;
    nombreCarpetaResidente: string;
    nombreArchivoAlmacenado: string;
    buffer: Buffer;
    tipoMime: string;
  }): Promise<GDriveUploadResult> {
    const drive = await this.getClient();

    // Resolver carpeta 'Documentos' correspondiente
    const idCarpetaDocumentos = await this.asegurarJerarquiaDirectorios(
      params.nombreCarpetaSede,
      params.nombreCarpetaResidente
    );

    const media = {
      mimeType: params.tipoMime,
      body: Readable.from(params.buffer)
    };

    const res = await drive.files.create({
      requestBody: {
        name: params.nombreArchivoAlmacenado,
        parents: [idCarpetaDocumentos]
      },
      media,
      fields: 'id, name, webViewLink, webContentLink, size',
      supportsAllDrives: true
    });

    return {
      fileId: res.data.id!,
      fileName: res.data.name!,
      webViewLink: res.data.webViewLink,
      webContentLink: res.data.webContentLink,
      sizeBytes: res.data.size ? Number(res.data.size) : params.buffer.length,
      folderId: idCarpetaDocumentos
    };
  }

  /**
   * Mueve un archivo a la papelera en Google Drive
   */
  async enviarAPapelera(fileId: string): Promise<void> {
    try {
      const drive = await this.getClient();
      await drive.files.update({
        fileId,
        requestBody: { trashed: true },
        supportsAllDrives: true
      });
    } catch (error) {
      console.warn(`⚠️ No se pudo marcar como trashed en Google Drive (ID: ${fileId}):`, error);
    }
  }

  /**
   * Renombra un archivo en Google Drive
   */
  async renombrarArchivo(fileId: string, nuevoNombre: string): Promise<void> {
    try {
      const drive = await this.getClient();
      await drive.files.update({
        fileId,
        requestBody: { name: nuevoNombre },
        supportsAllDrives: true
      });
    } catch (error) {
      console.warn(`⚠️ No se pudo renombrar en Google Drive (ID: ${fileId}):`, error);
    }
  }

  /**
   * Copia un archivo en Google Drive
   */
  async copiarArchivo(fileId: string, nuevoNombre: string): Promise<string | null> {
    try {
      const drive = await this.getClient();
      const res = await drive.files.copy({
        fileId,
        requestBody: { name: nuevoNombre },
        supportsAllDrives: true,
        fields: 'id'
      });
      return res.data.id || null;
    } catch (error) {
      console.warn(`⚠️ No se pudo copiar en Google Drive (ID: ${fileId}):`, error);
      return null;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
