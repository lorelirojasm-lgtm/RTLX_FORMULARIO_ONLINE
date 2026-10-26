/**
 * Receptor de respuestas del formulario Raw TLX en español.
 * Pegue este código en: Hoja de cálculo de Google → Extensiones → Apps Script.
 * Luego: Implementar → Nueva implementación → Aplicación web
 *        Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 */
const CLAVE = "aOdwXJk-972yVouHRtW72IE5";   // debe coincidir con SHEETS_KEY en index.html
const HOJA = "Respuestas";

const VERSION = 2;

const COLUMNAS = ["id_registro","participante","grupo","condicion","tarea","inicio","fin","duracion_seg",
  "MD","PD","TD","PE","EF","FR","RTLX",
  "MD_cont","PD_cont","TD_cont","PE_cont","EF_cont","FR_cont","RTLX_cont",
  "ancho_pantalla_px","version","recibido"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) sh = ss.insertSheet(HOJA);
  return sh;
}

// Devuelve el encabezado. Si la hoja es nueva lo crea; si ya existía y le faltan
// columnas (por ejemplo "grupo"), las agrega al final sin mover los datos existentes.
function encabezado_(sh) {
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold");
    return COLUMNAS.slice();
  }
  const ultima = sh.getLastColumn();
  const head = sh.getRange(1, 1, 1, ultima).getValues()[0].map(String);
  const faltan = COLUMNAS.filter(c => head.indexOf(c) === -1);
  if (faltan.length) {
    sh.getRange(1, ultima + 1, 1, faltan.length).setValues([faltan]).setFontWeight("bold");
    return head.concat(faltan);
  }
  return head;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.clave !== CLAVE) return respuesta_({ ok: false, error: "clave" });
  return respuesta_({ ok: true, version: VERSION, filas: Math.max(hoja_().getLastRow() - 1, 0) });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const datos = JSON.parse(e.postData.contents);
    if (datos.clave !== CLAVE) return respuesta_({ ok: false, error: "clave" });
    const f = datos.fila || {};
    if (!f.id_registro || !f.participante) return respuesta_({ ok: false, error: "fila incompleta" });

    const sh = hoja_();
    const head = encabezado_(sh);
    const n = sh.getLastRow() - 1;
    if (n > 0) {
      const colId = head.indexOf("id_registro") + 1;
      const ids = sh.getRange(2, colId, n, 1).getValues().map(r => r[0]);
      if (ids.indexOf(f.id_registro) !== -1) return respuesta_({ ok: true, version: VERSION, duplicado: true, filas: n });
    }
    f.recibido = new Date().toISOString();
    sh.appendRow(head.map(c => (f[c] === undefined || f[c] === null) ? "" : f[c]));
    return respuesta_({ ok: true, version: VERSION, filas: n + 1 });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
