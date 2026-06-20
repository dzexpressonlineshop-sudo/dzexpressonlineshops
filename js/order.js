/* ====================================================================
   منطق صفحة الطلب: اختيار الولاية، حساب التوصيل، إرسال الطلب
==================================================================== */

function formatPrice(n){
  return n.toLocaleString('en-US') + ' دج';
}

function getQueryParam(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function generateOrderId(){
  const date = new Date();
  const stamp = date.getFullYear().toString().slice(2) +
                String(date.getMonth()+1).padStart(2,'0') +
                String(date.getDate()).padStart(2,'0');
  const rand = Math.floor(1000 + Math.random()*9000);
  return `DZ-${stamp}-${rand}`;
}

let selectedProduct = null;
let selectedWilaya = null;
let selectedDeliveryType = null; // 'office' | 'home'
let selectedDeliveryPrice = 0;

function init(){
  const id = getQueryParam('id');
  selectedProduct = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  if (!selectedProduct){
    document.getElementById('orderView').innerHTML = '<p>المنتج غير موجود.</p>';
    return;
  }

  renderSummary();
  fillWilayaSelect();
  bindEvents();
}

function renderSummary(){
  const el = document.getElementById('productSummary');
  el.innerHTML = `
    <div class="media">${getProductMedia(selectedProduct)}</div>
    <div>
      <h2>${selectedProduct.name}</h2>
      <span class="price">${formatPrice(selectedProduct.price)}</span>
    </div>
  `;
}

function fillWilayaSelect(){
  const select = document.getElementById('custWilaya');
  WILAYAS.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.code;
    opt.textContent = `${String(w.code).padStart(2,'0')} - ${w.name}`;
    select.appendChild(opt);
  });
}

function bindEvents(){
  document.getElementById('custWilaya').addEventListener('change', onWilayaChange);
  document.getElementById('orderForm').addEventListener('submit', onSubmit);
}

function onWilayaChange(e){
  const code = parseInt(e.target.value, 10);
  selectedWilaya = WILAYAS.find(w => w.code === code) || null;
  selectedDeliveryType = null;
  selectedDeliveryPrice = 0;
  renderDeliveryOptions();
  updateTotals();
}

function renderDeliveryOptions(){
  const area = document.getElementById('deliveryArea');

  if (!selectedWilaya){
    area.innerHTML = `<span class="hint">اختر الولاية أولاً ليظهر لك سعر التوصيل</span>`;
    return;
  }

  if (selectedWilaya.office === null && selectedWilaya.home === null){
    area.innerHTML = `<div class="delivery-unavailable">عذراً، التوصيل غير متوفر حالياً لولاية ${selectedWilaya.name}</div>`;
    return;
  }

  let html = '<div class="delivery-options">';

  if (selectedWilaya.office !== null){
    html += `
      <div class="delivery-card" data-type="office" data-price="${selectedWilaya.office}">
        <div class="label">📦 توصيل للمكتب</div>
        <div class="amount">${selectedWilaya.office === 0 ? 'مجاني' : formatPrice(selectedWilaya.office)}</div>
      </div>`;
  }
  if (selectedWilaya.home !== null){
    html += `
      <div class="delivery-card" data-type="home" data-price="${selectedWilaya.home}">
        <div class="label">🏠 توصيل لباب الدار</div>
        <div class="amount">${formatPrice(selectedWilaya.home)}</div>
      </div>`;
  }
  html += '</div>';
  area.innerHTML = html;

  area.querySelectorAll('.delivery-card').forEach(card => {
    card.addEventListener('click', () => {
      area.querySelectorAll('.delivery-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedDeliveryType = card.dataset.type;
      selectedDeliveryPrice = parseInt(card.dataset.price, 10);
      updateTotals();
      clearFieldError('fieldDelivery');
    });
  });
}

function updateTotals(){
  const box = document.getElementById('totalBox');
  if (!selectedWilaya || selectedDeliveryType === null){
    box.style.display = 'none';
    return;
  }
  box.style.display = 'flex';
  const total = selectedProduct.price + selectedDeliveryPrice;
  document.getElementById('totalProduct').textContent = formatPrice(selectedProduct.price);
  document.getElementById('totalDelivery').textContent = selectedDeliveryPrice === 0 ? 'مجاني' : formatPrice(selectedDeliveryPrice);
  document.getElementById('totalGrand').textContent = formatPrice(total);
}

function setFieldError(fieldId, hasError){
  const field = document.getElementById(fieldId);
  field.classList.toggle('invalid', hasError);
}
function clearFieldError(fieldId){
  setFieldError(fieldId, false);
}

function validatePhone(phone){
  const digits = phone.replace(/\s+/g,'');
  return /^0[5-9][0-9]{8}$/.test(digits) || /^0[1-9][0-9]{7,8}$/.test(digits);
}

function validate(){
  let valid = true;

  const name = document.getElementById('custName').value.trim();
  if (!name){
    setFieldError('fieldName', true);
    valid = false;
  } else {
    clearFieldError('fieldName');
  }

  const phone = document.getElementById('custPhone').value.trim();
  if (!validatePhone(phone)){
    setFieldError('fieldPhone', true);
    valid = false;
  } else {
    clearFieldError('fieldPhone');
  }

  if (!selectedWilaya){
    setFieldError('fieldWilaya', true);
    valid = false;
  } else {
    clearFieldError('fieldWilaya');
  }

  if (selectedWilaya && (selectedWilaya.office === null && selectedWilaya.home === null)){
    valid = false;
  } else if (!selectedDeliveryType){
    setFieldError('fieldDelivery', true);
    valid = false;
  } else {
    clearFieldError('fieldDelivery');
  }

  return valid;
}

function onSubmit(e){
  e.preventDefault();
  document.getElementById('submitError').classList.add('hidden');

  if (!validate()) return;

  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');
  submitBtn.disabled = true;
  submitLabel.textContent = 'جاري إرسال الطلب...';

  const orderId = generateOrderId();
  const deliveryLabel = selectedDeliveryType === 'office' ? 'توصيل للمكتب' : 'توصيل لباب الدار';
  const total = selectedProduct.price + selectedDeliveryPrice;

  const payload = {
    orderId: orderId,
    date: new Date().toISOString(),
    productName: selectedProduct.name,
    productPrice: selectedProduct.price,
    wilaya: selectedWilaya.name,
    deliveryType: deliveryLabel,
    deliveryPrice: selectedDeliveryPrice,
    total: total,
    customerName: document.getElementById('custName').value.trim(),
    phone: document.getElementById('custPhone').value.trim()
  };

  if (!CONFIG.APPS_SCRIPT_URL){
    // لم يتم ربط Google Sheet بعد — يعرض نجاح محلي فقط ليتمكن صاحب المتجر من تجربة الموقع
    console.warn('CONFIG.APPS_SCRIPT_URL غير مهيأ. راجع README.md لربط الموقع بـ Google Sheet.');
    showSuccess(orderId);
    return;
  }

  fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    showSuccess(orderId);
  })
  .catch(() => {
    submitBtn.disabled = false;
    submitLabel.textContent = 'تأكيد الطلبية';
    document.getElementById('submitError').classList.remove('hidden');
  });
}

function showSuccess(orderId){
  document.getElementById('orderView').classList.add('hidden');
  document.getElementById('successView').classList.remove('hidden');
  document.getElementById('orderIdDisplay').textContent = 'رقم الطلب: ' + orderId;
}

document.addEventListener('DOMContentLoaded', init);
