// load-storage.js - هذا الملف صغير
console.log('🔧 تحميل نظام التخزين المتقدم...');

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// تحميل الملف الرئيسي
loadScript('advanced-storage.js')
    .then(() => console.log('✅ تم تحميل نظام التخزين'))
    .catch(() => console.log('❌ فشل تحميل نظام التخزين'));
