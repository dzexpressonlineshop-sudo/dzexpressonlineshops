/* ====================================================================
   منطق الصفحة الرئيسية: عرض المنتجات
==================================================================== */
function formatPrice(n){
  return n.toLocaleString('en-US') + ' دج';
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <div class="product-media">${getProductMedia(p)}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-foot">
          <span class="price">${formatPrice(p.price)}</span>
          <a class="btn btn-gold" href="order.html?id=${p.id}">اطلب الآن</a>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderProducts);
