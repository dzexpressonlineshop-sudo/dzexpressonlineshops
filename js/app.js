document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  
  if (!productGrid) return;

  productGrid.innerHTML = "<p style='text-align:center; width:100%; grid-column:1/-1;'>جاري تحميل المنتجات...</p>";

  // جلب رابط السكريبت من الإعدادات
  const url = CONFIG.APPS_SCRIPT_URL;

  fetch(url)
    .then(response => response.json())
    .then(products => {
      productGrid.innerHTML = "";
      
      if (!products || products.length === 0 || products.error) {
        productGrid.innerHTML = "<p style='text-align:center; width:100%; grid-column:1/-1;'>لا توجد منتجات معروضة حالياً.</p>";
        return;
      }

      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        // التحقق من وجود الصورة
        const imageHtml = product.image 
          ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
          : `<div class="product-img-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>`;

        card.innerHTML = `
          ${imageHtml}
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-meta">
              <span class="product-price">${product.price} دج</span>
              <a href="order.html?id=${product.id}" class="btn btn-gold btn-sm">اطلب الآن</a>
            </div>
          </div>
        `;
        productGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      productGrid.innerHTML = "<p style='text-align:center; width:100%; grid-column:1/-1;'>حدث خطأ أثناء تحميل المنتجات. يرجى إعادة المحاولة.</p>";
    });
});
document.addEventListener('DOMContentLoaded', renderProducts);
