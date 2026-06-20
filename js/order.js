let currentProduct = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  // جلب المنتجات من الشيت لمعرفة تفاصيل المنتج المطلوب
  fetch(CONFIG.APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(products => {
      currentProduct = products.find(p => p.id == productId);

      if (!currentProduct) {
        alert("المنتج غير موجود!");
        window.location.href = "index.html";
        return;
      }

      // عرض ملخص المنتج (تأكد أن هذا الجزء يطابق الكود الأصلي لديك لعرض البيانات)
      const summaryCard = document.getElementById("productSummary");
      if (summaryCard) {
        summaryCard.innerHTML = `
          <h3>${currentProduct.name}</h3>
          <p class="price">${currentProduct.price} دج</p>
        `;
      }
      
      // تحديث الحسابات تلقائياً إذا كانت الولاية مختارة
      updateTotals();
    })
    .catch(err => console.error("Error loading product details:", err));
    
    // ... باقي كود الحسابات وإرسال الفورم (Form Submit) يترك كما هو دون تغيير
});
