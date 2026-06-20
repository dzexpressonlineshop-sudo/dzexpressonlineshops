# DZ Express Online Shop 🛍️

موقع متجر إلكتروني بسيط واحترافي، يعرض المنتجات، يحسب سعر التوصيل تلقائياً حسب الولاية، ويرسل كل طلبية مباشرة إلى Google Sheet.

---

## 1) ربط الموقع بـ Google Sheet (حتى توصلك الطلبيات)

### أ. إنشاء الـ Sheet
1. روح لـ [sheets.google.com](https://sheets.google.com) واصنع ملف جديد، سميه مثلاً **"طلبيات DZ Express"**.

### ب. إضافة كود الاستقبال
2. من القائمة فوق: **Extensions ← Apps Script**.
3. احذف أي كود موجود، وانسخ فيه محتوى الملف `apps-script/Code.gs` كاملاً.
4. اضغط **حفظ** (أيقونة الحفظ أو Ctrl+S).

### ج. نشر الكود كـ Web App
5. فوق على اليمين اضغط **Deploy ← New deployment**.
6. اضغط على أيقونة الترس ⚙️ بجانب "Select type" واختر **Web app**.
7. في الإعدادات:
   - **Execute as**: Me (حسابك)
   - **Who has access**: Anyone
8. اضغط **Deploy**. غادي يطلبلك تصرّح بالصلاحيات (Authorize) — وافق.
9. غادي يعطيك رابط شكله هكذا:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec
   ```
   **انسخ هذا الرابط.**

### د. ربط الرابط بالموقع
10. افتح الملف `js/config.js` وضع الرابط بين القوسين:
    ```js
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec",
    ```
11. احفظ الملف.

✅ من الآن، كل طلبية يأكدها الزبون تتسجل أوتوماتيكياً في ورقة باسم **"Orders"** داخل الـ Sheet تاعك.

> ⚠️ إذا بدّلت الكود في Apps Script لاحقاً، خاصك تعاود **Deploy ← Manage deployments ← تعديل (✏️) ← Deploy** باش التغييرات تتفعل.

---

## 2) نشر الموقع على GitHub Pages

### أ. إنشاء Repository
1. روح لـ [github.com](https://github.com) ودخل لحسابك (أو سجل حساب جديد).
2. اضغط **New repository**، سميه مثلاً `dz-express-shop`، اختر **Public**، ثم **Create repository**.

### ب. رفع الملفات
**الطريقة السهلة (بدون أوامر):**
1. داخل الـ repo اضغط **Add file ← Upload files**.
2. اسحب كل محتوى مجلد الموقع (index.html, order.html, المجلدات css/js/assets...) داخل صفحة الرفع.
3. اضغط **Commit changes**.

**أو بالـ git (إذا عندك Git مثبت):**
```bash
cd dz-express-shop
git init
git add .
git commit -m "إطلاق الموقع"
git branch -M main
git remote add origin https://github.com/USERNAME/dz-express-shop.git
git push -u origin main
```

### ج. تفعيل GitHub Pages
4. داخل الـ repo: **Settings ← Pages**.
5. في **Branch** اختر `main` و `/ (root)`، ثم **Save**.
6. بعد دقيقة أو دقيقتين، الموقع يكون متاح على رابط شكله:
   ```
   https://USERNAME.github.io/dz-express-shop/
   ```

---

## 3) تعديل المنتجات والأسعار

كل شي يتعدل من ملفين فقط، بلا ما تلمس باقي الكود:

- **`js/products.js`** → زيد، بدّل، أو احذف منتجات (الاسم، السعر، الوصف، الصورة).
- **`js/wilayas.js`** → بدّل أسعار التوصيل لكل ولاية.

لإضافة صورة حقيقية لمنتج، حط رابط الصورة في الحقل `image`، مثال:
```js
image: "https://example.com/sahara-headphones.jpg"
```
إذا تركت `image: ""` فارغة، يظهر مكانها أيقونة بسيطة بألوان الموقع.

---

## 4) هيكل الملفات

```
dz-express-shop/
├── index.html          ← الصفحة الرئيسية (عرض المنتجات)
├── order.html           ← صفحة إتمام الطلب
├── css/style.css        ← التصميم
├── js/
│   ├── config.js         ← رابط Google Sheet
│   ├── products.js       ← قائمة المنتجات
│   ├── wilayas.js        ← أسعار التوصيل لكل ولاية
│   ├── icons.js           ← أيقونات بسيطة
│   ├── app.js             ← منطق الصفحة الرئيسية
│   └── order.js           ← منطق صفحة الطلب
├── assets/logo.png       ← لوغو المتجر
└── apps-script/Code.gs    ← كود استقبال الطلبيات في Google Sheet
```

---

## ملاحظة مهمة

طالما ما ربطتش `APPS_SCRIPT_URL` في `js/config.js`، الموقع يخدم عادي ويعرض رسالة "تم استلام الطلب" لكن الطلبية ما تتسجلش فأي مكان — فهاد الخطوة (القسم 1) ضرورية باش توصلك الطلبيات فعلياً.
