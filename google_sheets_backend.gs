/**
 * Backend opcional para Puntos de Amor + Misiones v3.
 * Guarda el estado completo de la app en una Google Sheet.
 *
 * Instrucciones rápidas:
 * 1. Crea una hoja de cálculo en Google Sheets.
 * 2. Copia el ID de la URL de la hoja y pégalo en SPREADSHEET_ID.
 * 3. En Extensiones > Apps Script, pega este código.
 * 4. Ejecuta setup() una vez y autoriza permisos.
 * 5. Despliega como Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone with the link
 * 6. Copia la URL /exec en CLOUD_SYNC_URL dentro de index.html.
 */

const SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';
const SHEET_NAME = 'PuntosDeAmorEstado';
const STATE_KEY = 'estado_actual';

function setup() {
  const sheet = getOrCreateSheet_();
  sheet.clear();
  sheet.appendRow(['key', 'updatedAt', 'json']);
  sheet.appendRow([STATE_KEY, new Date().toISOString(), '{}']);
}

function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : 'load';
    if (action !== 'load') return json_({ ok: false, error: 'Acción GET no válida.' });
    return json_({ ok: true, state: loadState_() });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(body);
    if (payload.action !== 'save') return json_({ ok: false, error: 'Acción POST no válida.' });
    if (!payload.state || typeof payload.state !== 'object') return json_({ ok: false, error: 'Estado inválido.' });
    saveState_(payload.state);
    return json_({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function loadState_() {
  const sheet = getOrCreateSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === STATE_KEY) {
      const raw = values[i][2] || '{}';
      return JSON.parse(raw);
    }
  }
  return {};
}

function saveState_(state) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getOrCreateSheet_();
    const values = sheet.getDataRange().getValues();
    const now = new Date().toISOString();
    const json = JSON.stringify(state);

    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === STATE_KEY) {
        sheet.getRange(i + 1, 2, 1, 2).setValues([[now, json]]);
        return;
      }
    }
    sheet.appendRow([STATE_KEY, now, json]);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
