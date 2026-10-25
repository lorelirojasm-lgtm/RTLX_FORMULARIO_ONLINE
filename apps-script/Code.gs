/**
 * Receptor de respuestas del formulario Raw TLX en español.
 * Pegue este código en: Hoja de cálculo de Google → Extensiones → Apps Script.
 * Luego: Implementar → Nueva implementación → Aplicación web
 *        Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 */
const CLAVE = "aOdwXJk-972yVouHRtW72IE5";   // debe coincidir con SHEETS_KEY en index.html
const HOJA = "Respuestas";

const COLUMNAS = ["id_registro","participante","condicion","tarea","inicio","fin","duracion_seg",
  "MD","PD","TD","PE","EF","FR","RTLX",
  "MD_cont","PD_cont","TD_cont","PE_cont","EF_cont","FR_cont","RTLX_cont",
  "ancho_pantalla_px","version","recibido"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) sh = ss.insertSheet(HOJA);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold");
  }
  return sh;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.clave !== CLAVE) return respuesta_({ ok: false, error: "clave" });
  return respuesta_({ ok: true, filas: Math.max(hoja_().getLastRow() - 1, 0) });
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
    const n = sh.getLastRow() - 1;
    if (n > 0) {
      const ids = sh.getRange(2, 1, n, 1).getValues().map(r => r[0]);
      if (ids.indexOf(f.id_registro) !== -1) return respuesta_({ ok: true, duplicado: true, filas: n });
    }
    f.recibido = new Date().toISOString();
    sh.appendRow(COLUMNAS.map(c => (f[c] === undefined || f[c] === null) ? "" : f[c]));
    return respuesta_({ ok: true, filas: n + 1 });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
