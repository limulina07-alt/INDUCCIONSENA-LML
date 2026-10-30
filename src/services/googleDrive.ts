import { getAccessToken, clearAccessToken } from '../utils/googleAuth';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

/**
 * Robust wrapper for Google Drive API fetch requests
 */
async function driveFetch(
  url: string,
  options: RequestInit = {},
  token: string
): Promise<Response> {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    console.warn('Network or CORS error connecting to Google Drive:', networkErr);
    throw new Error(
      'No fue posible establecer conexión con Google Drive (Error de red o conexión bloqueada en el navegador). Por favor verifica tu conexión o vuelve a iniciar sesión.'
    );
  }

  if (response.status === 401) {
    clearAccessToken();
    throw new Error('Tu sesión con Google Drive ha expirado. Por favor, vuelve a iniciar sesión.');
  }

  if (response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || 'Acceso restringido a Google Drive. Verifica que aceptaste los permisos.';
    throw new Error(message);
  }

  return response;
}

/**
 * List files from Google Drive with optional search query or folder filter
 */
export const listDriveFiles = async (searchTerm?: string, folderId?: string): Promise<GoogleDriveFile[]> => {
  const token = await getAccessToken();
  if (!token) {
    return [];
  }

  const queryParts = ['trashed = false'];
  if (folderId) {
    queryParts.push(`'${folderId}' in parents`);
  }
  if (searchTerm && searchTerm.trim() !== '') {
    const escaped = searchTerm.replace(/'/g, "\\'");
    queryParts.push(`name contains '${escaped}'`);
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const fields = encodeURIComponent('files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,thumbnailLink,parents)');
  const url = `${DRIVE_API_URL}?q=${q}&fields=${fields}&orderBy=folder,modifiedTime desc&pageSize=50`;

  const response = await driveFetch(url, { method: 'GET' }, token);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error al listar archivos de Google Drive (${response.status})`);
  }

  const data = await response.json().catch(() => ({ files: [] }));
  return data.files || [];
};

/**
 * Find or create a dedicated "SENA - Inducción FPI 2026" root folder in Google Drive
 */
export const findOrCreateSenaFolder = async (): Promise<string> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión de Google activa');

  const folderName = 'SENA - Inducción FPI 2026';
  const q = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchUrl = `${DRIVE_API_URL}?q=${q}&fields=files(id,name)`;

  const searchRes = await driveFetch(searchUrl, { method: 'GET' }, token);

  if (searchRes.ok) {
    const searchData = await searchRes.json().catch(() => ({}));
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }

  // Create folder if not found
  const createRes = await driveFetch(
    DRIVE_API_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Archivos, actas y reportes oficiales del Portal de Inducción SENA',
      }),
    },
    token
  );

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al crear la carpeta en Google Drive');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
};

/**
 * Upload a text or JSON file into Google Drive with multipart/related upload
 */
export const uploadFileToDrive = async (
  fileName: string,
  content: string,
  contentType: string = 'text/plain',
  folderId?: string
): Promise<GoogleDriveFile> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión de Google activa');

  const metadata: Record<string, any> = {
    name: fileName,
    mimeType: contentType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${contentType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await driveFetch(
    DRIVE_UPLOAD_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    },
    token
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al subir el archivo a Google Drive (${response.status})`);
  }

  return await response.json();
};

/**
 * Upload a CSV and convert it automatically into a native Google Sheets spreadsheet
 * stored directly in Google Drive within the SENA induction folder.
 */
export const uploadSpreadsheetToDrive = async (
  fileName: string,
  csvContent: string,
  folderId?: string
): Promise<GoogleDriveFile> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión de Google activa');

  const metadata: Record<string, any> = {
    name: fileName,
    mimeType: 'application/vnd.google-apps.spreadsheet',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/csv; charset=UTF-8\r\n\r\n' +
    csvContent +
    closeDelimiter;

  const response = await driveFetch(
    DRIVE_UPLOAD_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    },
    token
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al guardar la hoja de cálculo en Google Drive (${response.status})`);
  }

  return await response.json();
};

/**
 * Upload an apprentice certificate or commitment act to Google Drive
 */
export const uploadCertificateToDrive = async (
  apprenticeName: string,
  docNumber: string,
  certificateCode: string,
  certificateHtmlOrText: string
): Promise<GoogleDriveFile> => {
  const folderId = await findOrCreateSenaFolder();
  const fileName = `Certificado_Induccion_${apprenticeName.replace(/\s+/g, '_')}_${docNumber}.html`;
  return await uploadFileToDrive(fileName, certificateHtmlOrText, 'text/html', folderId);
};

/**
 * Backup entire apprentice cohort report in CSV format to Google Drive
 */
export const backupCohortCsvToDrive = async (
  fichaCode: string,
  programName: string,
  csvData: string
): Promise<GoogleDriveFile> => {
  const folderId = await findOrCreateSenaFolder();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `Reporte_Induccion_Ficha_${fichaCode}_${timestamp}.csv`;
  return await uploadFileToDrive(fileName, csvData, 'text/csv', folderId);
};

/**
 * Saves and synchronizes cohort data as an authentic Google Spreadsheet (application/vnd.google-apps.spreadsheet)
 * in Google Drive inside the "SENA - Inducción FPI 2026" folder.
 */
export const saveCohortSpreadsheetToDrive = async (
  fichaCode: string,
  programName: string,
  csvData: string
): Promise<GoogleDriveFile> => {
  const folderId = await findOrCreateSenaFolder();
  const dateFormatted = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
  const timeFormatted = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, 'h');
  const fileName = `Hoja de Cálculo - Ficha ${fichaCode} - ${dateFormatted}_${timeFormatted}`;
  return await uploadSpreadsheetToDrive(fileName, csvData, folderId);
};


/**
 * Delete a file from Google Drive (MUST be called after user confirmation)
 */
export const deleteFileFromDrive = async (fileId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) throw new Error('No hay sesión de Google activa');

  const response = await driveFetch(
    `${DRIVE_API_URL}/${fileId}`,
    {
      method: 'DELETE',
    },
    token
  );

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al eliminar el archivo (${response.status})`);
  }

  return true;
};

