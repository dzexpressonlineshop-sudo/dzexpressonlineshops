/* ====================================================================
   أيقونات بسيطة (خطية) تستعمل عند عدم وجود صورة حقيقية للمنتج
==================================================================== */
const ICONS = {
  headphones: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,
  watch: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"></rect><path d="M9 7V4h6v3M9 17v3h6v-3M12 10v2l1.5 1"></path></svg>`,
  charger: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><path d="M9 9h6M9 13h6M11 17h2"></path></svg>`,
  backpack: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"></path><path d="M9 12h6M9 3h6v3H9z"></path></svg>`,
  sunglasses: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="13" r="3.2"></circle><circle cx="18" cy="13" r="3.2"></circle><path d="M9.2 13h5.6M2.5 9 4 9.5M21.5 9 20 9.5"></path></svg>`,
  lamp: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6l-2 8h3l-7 12 2-9H8z"></path></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="#C9962C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"></path><path d="M3 8l9 5 9-5M12 13v8"></path></svg>`
};

function getProductMedia(product){
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}">`;
  }
  return ICONS[product.icon] || ICONS.box;
}
