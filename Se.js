// sw.js - Service Worker
const CACHE_NAME = 'quran-app-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/load-storage.js',
  '/advanced-storage.js'
];

// تثبيت وتخزين الموقع
self.addEventListener('install', (event) => {
  console.log('🔧 تثبيت Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💾 جاري حفظ الموقع في الذاكرة...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ تم حفظ الموقع كامل');
        return self.skipWaiting();
      })
  );
});

// تقديم الملفات من الذاكرة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا الملف موجود في الذاكرة
        if (response) {
          return response;
        }
        
        // إذا لا، جلب من الإنترنت
        return fetch(event.request)
          .then((response) => {
            // لا نخزن إلا الطلبات الناجحة
            if(!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // إذا فشل الاتصال، إرجاع الصفحة الرئيسية
            return caches.match('/');
          });
      })
  );
});
