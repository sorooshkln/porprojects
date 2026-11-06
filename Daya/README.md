# Daya

پروژهٔ مستقل از ناردون، با HTML، CSS و JavaScript و بدون وابستگی npm.
صفحهٔ فعلی موقت است؛ طراحی و محتوا پس از دریافت داده‌ها و فونت‌ها تکمیل می‌شود.

## اجرای محلی

Linux و Node.js 18.19.1 یا جدیدتر کافی است. نصب پکیج لازم نیست.
در پوشهٔ Daya اجرا کنید:

```sh
npm run dev
```

آدرس: http://localhost:3002 — با تغییر HTML، CSS، JavaScript و فایل‌های assets مرورگر خودکار بازخوانی می‌شود.
سرور از بررسی دوره‌ای فایل‌ها استفاده می‌کند و به recursive fs.watch وابسته نیست؛ با Linux و Node 18 سازگار است.
اگر پورت اشغال باشد، سرور با خطا متوقف می‌شود و پورت دیگری انتخاب نمی‌کند.
توقف: Ctrl+C. اجرای npm start هم همین سرور را اجرا می‌کند.

## دریافت در پوشه‌ای جدا روی سیستم شما

ریپو: https://github.com/sorooshkln/porprojects
مسیر فعلی ناردون: /home/soroosh/Documents/Nardoon-live — پورت 3000.
مسیر پیشنهادی Daya: /home/soroosh/Documents/Daya — پورت 3002.
دستورهای زیر برای راه‌اندازی اولیه‌اند و پوشهٔ مقصد باید از قبل وجود نداشته باشد:

```sh
git clone --filter=blob:none --sparse https://github.com/sorooshkln/porprojects.git /home/soroosh/Documents/Daya
git -C /home/soroosh/Documents/Daya sparse-checkout set Daya
cd /home/soroosh/Documents/Daya/Daya
npm run dev
```

پوشهٔ بیرونی checkout ریپو است و پوشهٔ داخلی کد برنامه. این روش checkout ناردون را تغییر نمی‌دهد.
برای دریافت تغییرات بعدی، در همین checkout دستور git pull --ff-only را اجرا کنید.
ناردون و Daya را در دو ترمینال جدا اجرا کنید.

## فایل‌ها

- index.html: ساختار صفحه
- style.css: ظاهر
- app.js: تعامل‌ها
- assets/fonts/: فونت‌های ارسالی
- assets/data/: داده‌های ارسالی
- scripts/live-server.mjs: سرور مستقل Daya

تمام تغییرات این پروژه باید در Daya/ بمانند. فایل‌های ریشهٔ ریپو متعلق به ناردون هستند.
