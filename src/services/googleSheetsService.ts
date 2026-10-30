import { Apprentice, Ficha } from '../types/induction';

const SPREADSHEET_TITLE = 'SENA - Registro y Seguimiento de Inducción FPI 2026';

export interface SheetSyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  timestamp: string;
  updatedCount: number;
}

const HEADERS_CARACTERIZACION = [
  'ID Aprendiz',
  'Fecha Registro',
  'Nombre Completo',
  'Tipo Doc',
  'Número Documento',
  'Correo Institucional',
  'Teléfono',
  'Código Ficha',
  'Programa de Formación',
  'Centro de Formación',
  'Regional',
  'Estado Actual',
];

const HEADERS_AVANCE = [
  'ID Aprendiz',
  'Nombre Completo',
  'Código Ficha',
  'Progreso Global (%)',
  'Total Módulos Completados',
  'Módulos Apropiados',
  'Estado de Inducción',
  'Última Actividad',
];

const HEADERS_EVALUACIONES = [
  'ID Aprendiz',
  'Nombre Completo',
  'Código Ficha',
  'Puntaje Evaluación (%)',
  'Aprobado (80%+)',
  'Intentos Realizados',
  'Acta de Compromiso',
  'Fecha Firma Acta',
  'Código de Certificado',
  'Fecha de Evaluación',
];

/**
 * Finds an existing induction spreadsheet in Google Drive or creates a new one.
 */
export const findOrCreateInductionSheet = async (accessToken: string): Promise<{ id: string; url: string }> => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // 1. Check if the spreadsheet already exists in Google Drive
  try {
    const query = encodeURIComponent(`name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
      headers,
    });

    if (driveRes.ok) {
      const driveData = await driveRes.json();
      if (driveData.files && driveData.files.length > 0) {
        const file = driveData.files[0];
        const url = file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`;
        return { id: file.id, url };
      }
    }
  } catch (err) {
    console.warn('Error al buscar hoja existente en Drive, intentando crear nueva:', err);
  }

  // 2. Create a new Spreadsheet with 3 dedicated sheets
  const createPayload = {
    properties: {
      title: SPREADSHEET_TITLE,
    },
    sheets: [
      {
        properties: {
          sheetId: 0,
          title: '1_Caracterizacion',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          sheetId: 1,
          title: '2_Avance_Modulos',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          sheetId: 2,
          title: '3_Evaluaciones_Certificados',
          gridProperties: { frozenRowCount: 1 },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers,
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Error al crear hoja de cálculo en Google Sheets: ${errorText}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const url = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 3. Move newly created spreadsheet into the SENA induction folder in Google Drive
  try {
    const folderQuery = encodeURIComponent(
      "name = 'SENA - Inducción FPI 2026' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    );
    const folderRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id)`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (folderRes.ok) {
      const folderData = await folderRes.json();
      if (folderData.files && folderData.files.length > 0) {
        const folderId = folderData.files[0].id;
        await fetch(
          `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&fields=id,parents`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    }
  } catch (err) {
    console.warn('No se pudo organizar la hoja dentro de la carpeta SENA en Drive:', err);
  }

  // 4. Initialize header rows with SENA formatting
  await initializeHeaders(accessToken, spreadsheetId);

  return { id: spreadsheetId, url };
};

/**
 * Initializes and styles the header rows in the 3 sheets
 */
const initializeHeaders = async (accessToken: string, spreadsheetId: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // Add Header Text Values
  const valuesData = [
    {
      range: '1_Caracterizacion!A1:L1',
      values: [HEADERS_CARACTERIZACION],
    },
    {
      range: '2_Avance_Modulos!A1:H1',
      values: [HEADERS_AVANCE],
    },
    {
      range: '3_Evaluaciones_Certificados!A1:J1',
      values: [HEADERS_EVALUACIONES],
    },
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: valuesData,
    }),
  });

  // Apply SENA Green Header Style (#39A900 -> R:0.224, G:0.663, B:0.0)
  const formatRequests = [0, 1, 2].map((sheetId) => ({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.224, green: 0.663, blue: 0.0 },
          textFormat: {
            bold: true,
            foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
            fontSize: 10,
          },
          horizontalAlignment: 'CENTER',
        },
      },
      fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
    },
  }));

  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ requests: formatRequests }),
    });
  } catch (err) {
    console.warn('No se pudo aplicar estilo a los encabezados:', err);
  }
};

/**
 * Synchronizes all apprentices across the 3 sheets
 */
export const syncAllApprenticesToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  apprentices: Apprentice[],
  fichas: Ficha[]
): Promise<SheetSyncResult> => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const fichaMap = new Map<string, Ficha>();
  fichas.forEach((f) => fichaMap.set(f.id, f));

  const now = new Date().toLocaleString('es-CO');

  // Sheet 1 rows
  const rowsCaracterizacion = apprentices.map((app) => {
    const f = fichaMap.get(app.fichaId);
    return [
      app.id,
      app.evaluationDate || now,
      app.name,
      app.documentType,
      app.documentNumber,
      app.email,
      app.phone || 'N/A',
      f ? f.code : '2824910',
      f ? f.programName : 'ADSO',
      f ? f.centerName : 'Centro de Formación',
      f ? f.regional : 'Regional Distrito Capital',
      app.status === 'completado' ? 'Aprobado 100%' : app.status === 'requiere_refuerzo' ? 'Requiere Refuerzo' : 'En Curso',
    ];
  });

  // Sheet 2 rows
  const rowsAvance = apprentices.map((app) => {
    const f = fichaMap.get(app.fichaId);
    return [
      app.id,
      app.name,
      f ? f.code : '2824910',
      `${app.progressPercent}%`,
      app.completedModules.length,
      app.completedModules.join(', ') || 'Ninguno aún',
      app.status === 'completado' ? 'Completado' : 'En Progreso',
      now,
    ];
  });

  // Sheet 3 rows
  const rowsEvaluacion = apprentices.map((app) => {
    const f = fichaMap.get(app.fichaId);
    return [
      app.id,
      app.name,
      f ? f.code : '2824910',
      app.evaluationScore !== undefined ? `${app.evaluationScore}%` : 'Pendiente',
      app.evaluationPassed ? 'SÍ' : 'NO',
      app.evaluationAttempts || 0,
      app.commitmentSigned ? 'FIRMADA' : 'PENDIENTE',
      app.commitmentDate || 'N/A',
      app.certificateCode || 'N/A',
      app.evaluationDate || 'N/A',
    ];
  });

  // Overwrite starting at row 2 (leaving row 1 header intact)
  const batchData = [
    {
      range: '1_Caracterizacion!A2:L' + (rowsCaracterizacion.length + 1),
      values: rowsCaracterizacion,
    },
    {
      range: '2_Avance_Modulos!A2:H' + (rowsAvance.length + 1),
      values: rowsAvance,
    },
    {
      range: '3_Evaluaciones_Certificados!A2:J' + (rowsEvaluacion.length + 1),
      values: rowsEvaluacion,
    },
  ];

  const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: batchData,
    }),
  });

  if (!updateRes.ok) {
    const errorText = await updateRes.text();
    throw new Error(`Error al sincronizar datos en Google Sheets: ${errorText}`);
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    timestamp: now,
    updatedCount: apprentices.length,
  };
};

/**
 * Real-time sync for a single apprentice when they register, advance or evaluate
 */
export const syncSingleApprenticeToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  apprentice: Apprentice,
  ficha?: Ficha
): Promise<void> => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const now = new Date().toLocaleString('es-CO');
  const fichaCode = ficha ? ficha.code : '2824910';
  const programName = ficha ? ficha.programName : 'ADSO';
  const centerName = ficha ? ficha.centerName : 'Centro de Formación';
  const regionalName = ficha ? ficha.regional : 'Regional Distrito Capital';

  // 1. Row for Caracterización
  const rowCaract = [
    apprentice.id,
    now,
    apprentice.name,
    apprentice.documentType,
    apprentice.documentNumber,
    apprentice.email,
    apprentice.phone || 'N/A',
    fichaCode,
    programName,
    centerName,
    regionalName,
    apprentice.status === 'completado' ? 'Aprobado 100%' : apprentice.status === 'requiere_refuerzo' ? 'Requiere Refuerzo' : 'En Curso',
  ];

  // 2. Row for Avance
  const rowAvance = [
    apprentice.id,
    apprentice.name,
    fichaCode,
    `${apprentice.progressPercent}%`,
    apprentice.completedModules.length,
    apprentice.completedModules.join(', ') || 'Ninguno aún',
    apprentice.status === 'completado' ? 'Completado' : 'En Progreso',
    now,
  ];

  // 3. Row for Evaluaciones
  const rowEval = [
    apprentice.id,
    apprentice.name,
    fichaCode,
    apprentice.evaluationScore !== undefined ? `${apprentice.evaluationScore}%` : 'Pendiente',
    apprentice.evaluationPassed ? 'SÍ' : 'NO',
    apprentice.evaluationAttempts || 0,
    apprentice.commitmentSigned ? 'FIRMADA' : 'PENDIENTE',
    apprentice.commitmentDate || 'N/A',
    apprentice.certificateCode || 'N/A',
    apprentice.evaluationDate || now,
  ];

  // Check if apprentice ID already exists in 1_Caracterizacion
  try {
    const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/1_Caracterizacion!A:A`, {
      headers,
    });

    if (checkRes.ok) {
      const data = await checkRes.json();
      const ids: string[][] = data.values || [];
      const rowIndex = ids.findIndex((row) => row[0] === apprentice.id);

      if (rowIndex !== -1) {
        // Row exists (1-based index is rowIndex + 1) -> Update existing rows
        const sheetRow = rowIndex + 1;
        const batchUpdatePayload = {
          valueInputOption: 'USER_ENTERED',
          data: [
            { range: `1_Caracterizacion!A${sheetRow}:L${sheetRow}`, values: [rowCaract] },
            { range: `2_Avance_Modulos!A${sheetRow}:H${sheetRow}`, values: [rowAvance] },
            { range: `3_Evaluaciones_Certificados!A${sheetRow}:J${sheetRow}`, values: [rowEval] },
          ],
        };

        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
          method: 'POST',
          headers,
          body: JSON.stringify(batchUpdatePayload),
        });
        return;
      }
    }
  } catch (err) {
    console.warn('Error al verificar fila de aprendiz, procediendo con append:', err);
  }

  // If not found or error, append rows to all 3 sheets
  await Promise.all([
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/1_Caracterizacion!A:L:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ values: [rowCaract] }),
    }),
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/2_Avance_Modulos!A:H:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ values: [rowAvance] }),
    }),
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/3_Evaluaciones_Certificados!A:J:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ values: [rowEval] }),
    }),
  ]);
};
