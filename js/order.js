let currentProduct = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  // 1. ملء قائمة الولايات مباشرة عند تحميل الصفحة لتفادي مشكلة الاختفاء
  const wilayaSelect = document.getElementById("custWilaya");
  const deliveryArea = document.getElementById("deliveryArea");
  const totalBox = document.getElementById("totalBox");
  const orderForm = document.getElementById("orderForm");

  if (typeof wilayas !== 'undefined' && wilayaSelect) {
    // إفراغ القائمة أولاً لتجنب التكرار
    wilayaSelect.innerHTML = '<option value="">اختر ولايتك</option>';
    wilayas.forEach(w => {
      const opt = document.createElement("option");
      opt.value = w.id;
      opt.textContent = `${w.id} - ${w.name}`;
      wilayaSelect.appendChild(opt);
    });
  }

  // 2. جلب بيانات المنتج من ورقة Products عبر SheetDB
  fetch("https://sheetdb.io/api/v1/u2bi74veb32hq?sheet=Products")
    .then(res => res.json())
    .then(products => {
      currentProduct = products.find(p => p.id == productId);

      if (!currentProduct) {
        alert("المنتج غير موجود!");
        window.location.href = "index.html";
        return;
      }

      // عرض ملخص المنتج بالهيكل الأصلي
      const summaryCard = document.getElementById("productSummary");
      if (summaryCard) {
        const imageHtml = currentProduct.image 
          ? `<img src="${currentProduct.image}" alt="${currentProduct.name}" class="summary-img">`
          : `<div class="summary-img-placeholder"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>`;

        summaryCard.innerHTML = `
          <div class="summary-product-box">
            ${imageHtml}
            <div class="summary-details">
              <h3>${currentProduct.name}</h3>
              <p class="summary-desc">${currentProduct.description || ''}</p>
              <p class="price">${currentProduct.price} دج</p>
            </div>
          </div>
        `;
      }
      updateTotals();
    })
    .catch(err => {
      console.error("Error loading product:", err);
    });

  // عند تغيير الولاية
  if (wilayaSelect) {
    wilayaSelect.addEventListener("change", () => {
      const wilayaId = wilayaSelect.value;
      if (!wilayaId) {
        deliveryArea.innerHTML = '<span class="hint">اختر الولاية أولاً ليظهر لك سعر التوصيل</span>';
        totalBox.style.display = "none";
        return;
      }

      const selectedWilaya = wilayas.find(w => w.id == wilayaId);
      if (selectedWilaya) {
        deliveryArea.innerHTML = `
          <label class="delivery-option">
            <input type="radio" name="deliveryType" value="home" checked>
            <div class="opt-text"><span class="opt-title">توصيل للمنزل</span><span class="opt-price">${selectedWilaya.home_price} دج</span></div>
          </label>
          <label class="delivery-option">
            <input type="radio" name="deliveryType" value="desk">
            <div class="opt-text"><span class="opt-title">توصيل للمكتب (Yalidine)</span><span class="opt-price">${selectedWilaya.desk_price} دج</span></div>
          </label>
        `;
        totalBox.style.display = "block";
        updateTotals();

        deliveryArea.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
          radio.addEventListener("change", updateTotals);
        });
      }
    });
  }

  function updateTotals() {
    if (!currentProduct) return;
    const wilayaId = wilayaSelect.value;
    if (!wilayaId) return;

    const selectedWilaya = wilayas.find(w => w.id == wilayaId);
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;

    let deliveryPrice = 0;
    if (selectedWilaya && deliveryType) {
      deliveryPrice = deliveryType === "home" ? selectedWilaya.home_price : selectedWilaya.desk_price;
    }

    const productPrice = Number(currentProduct.price) || 0;
    const grandTotal = productPrice + deliveryPrice;

    document.getElementById("totalProduct").textContent = `${productPrice} دج`;
    document.getElementById("totalDelivery").textContent = `${deliveryPrice} دج`;
    document.getElementById("totalGrand").textContent = `${grandTotal} دج`;
  }

  // إرسال الطلب
  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let isValid = true;
      const nameInput = document.getElementById("custName");
      const phoneInput = document.getElementById("custPhone");
      
      if (!nameInput.value.trim()) { nameInput.parentElement.classList.add("has-error"); isValid = false; }
      else { nameInput.parentElement.classList.remove("has-error"); }

      if (!phoneInput.value.trim() || phoneInput.value.trim().length < 9) { phoneInput.parentElement.classList.add("has-error"); isValid = false; }
      else { phoneInput.parentElement.classList.remove("has-error"); }

      if (!wilayaSelect.value) { wilayaSelect.parentElement.classList.add("has-error"); isValid = false; }
      else { wilayaSelect.parentElement.classList.remove("has-error"); }

      if (!isValid) return;

      const selectedWilaya = wilayas.find(w => w.id == wilayaSelect.value);
      const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
      const deliveryLabel = deliveryType === "home" ? "للبيت" : "للمكتب";
      
      const submitBtn = document.getElementById("submitBtn");
      const submitLabel = document.getElementById("submitLabel");
      const submitError = document.getElementById("submitError");

      submitBtn.disabled = true;
      submitLabel.textContent = "جاري إرسال الطلب...⏳";

      const orderData = {
        data: [
          {
            "ID الطلب": "DZ-" + Math.floor(100000 + Math.random() * 900000),
            "التاريخ": new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" }),
            "الاسم": nameInput.value.trim(),
            "الهاتف": phoneInput.value.trim(),
            "الولاية": `${selectedWilaya.id} - ${selectedWilaya.name} (${deliveryLabel})`,
            "المنتج": currentProduct.name,
            "المجموع": document.getElementById("totalGrand").textContent
          }
        ]
      };

      // هنا أضفنا تحديث لإرسال البيانات لورقة الطلبيات الأساسية (التبويب الأول في الشيت)
      fetch("https://sheetdb.io/api/v1/u2bi74veb32hq?sheet=Sheet1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      })
      .then(res => res.json())
      .then(result => {
        if (result.created) {
          document.getElementById("orderView").classList.add("hidden");
          document.getElementById("successView").classList.remove("hidden");
        } else {
          throw new Error();
        }
      })
      .catch(err => {
        console.error(err);
        submitBtn.disabled = false;
        submitLabel.textContent = "تأكيد الطلبية";
        submitError.classList.remove("hidden");
      });
    });
  }
});
