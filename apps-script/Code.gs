/* ====================================================================
   Code.gs
   هذا الكود يُلصق داخل Google Apps Script (شرح الخطوات في README.md)
   وظيفته: استقبال الطلبيات من الموقع وتسجيلها في Google Sheet تلقائياً
==================================================================== */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'تاريخ الطلب',
      'رقم الطلب',
      'المنتج',
      'سعر المنتج',
      'الولاية',
      'نوع التوصيل',
      'سعر التوصيل',
      'المجموع الكلي',
      'اسم الزبون',
      'رقم الهاتف'
    ]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.orderId,
    data.productName,
    data.productPrice,
    data.wilaya,
    data.deliveryType,
    data.deliveryPrice,
    data.total,
    data.customerName,
    data.phone
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'الخدمة تعمل بنجاح ✅' }))
    .setMimeType(ContentService.MimeType.JSON);
}
