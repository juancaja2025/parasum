/**
 * Google Apps Script — Pegar en Extensions > Apps Script del Google Sheet
 * Sheet ID: 1MFMEmGDn_bJOstkrsZ-AL3Lffp2lXToG7ZCZ-DCAXRM
 *
 * PASOS PARA DESPLEGAR:
 * 1. Abrí el Google Sheet → Extensions → Apps Script
 * 2. Borrá todo el contenido del editor y pegá este código
 * 3. Guardá (Ctrl+S)
 * 4. Deploy → New deployment
 * 5. Tipo: "Web app"
 * 6. Execute as: "Me" (tu cuenta)
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy" y copiá la URL generada
 * 9. Esa URL va en VITE_GOOGLE_SCRIPT_URL en el .env de Parasum
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Columnas: SKU | Descripción | Nave | Criterio | Largo cm | Ancho cm | Alto cm | Peso kg | Max Apilado | Uds/Pallet
    sheet.appendRow([
      data.sku || '',
      data.descripcion || '',
      data.nave || '',
      data.criterio || '',
      data.largo_cm || '',
      data.ancho_cm || '',
      data.alto_cm || '',
      data.peso_kg || '',
      data.max_apilado || '',
      data.unidades_pallet || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Necesario para que el deploy funcione (GET de verificación)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Parasum Sheet API activa' }))
    .setMimeType(ContentService.MimeType.JSON);
}
