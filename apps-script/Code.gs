function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Products");
  
  // إذا لم تكن ورقة المنتجات موجودة
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({error: "Products sheet not found"}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  var data = sheet.getDataRange().getValues();
  var products = [];
  
  // قراءة البيانات وتحويلها إلى JSON (تخطي السطر الأول للعناوين)
  for (var i = 1; i < data.length; i++) {
    products.push({
      id: data[i][0],
      name: data[i][1],
      price: Number(data[i][2]),
      description: data[i][3],
      image: data[i][4] || ""
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(products))
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // التأكد من وجود ورقة Orders أو إنشائها
    var sheet = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
    
    // إذا كانت الورقة جديدة، نكتب العناوين
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID الطلب", "التاريخ", "الاسم", "الهاتف", "الولاية", "المنتج", "المجموع"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    var orderId = "DZ-" + Math.floor(100000 + Math.random() * 900000);
    var date = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" });
    
    sheet.appendRow([
      orderId,
      date,
      data.custName,
      data.custPhone,
      data.custWilaya,
      data.productName,
      data.totalGrand + " دج"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, orderId: orderId }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
}
