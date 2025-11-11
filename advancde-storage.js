// advanced-storage.js - نظام يحفظ الموقع كامل
class AdvancedStorage {
    constructor() {
        console.log('🚀 بدء نظام الحفظ الشامل...');
        this.registerServiceWorker();
        this.setupOfflineDetection();
    }

    // تسجيل Service Worker
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker مسجل بنجاح');
                    this.checkOfflineSupport();
                })
                .catch(error => {
                    console.log('❌ فشل تسجيل Service Worker:', error);
                    this.setupLocalStorageFallback();
                });
        } else {
            console.log('❌ المتصفح لا يدعم Service Worker');
            this.setupLocalStorageFallback();
        }
    }

    // التحقق من دعم العمل بدون إنترنت
    async checkOfflineSupport() {
        const cache = await caches.open('quran-app-cache');
        const cached = await cache.match('/');
        
        if (!cached) {
            console.log('💾 جاري حفظ الموقع في الذاكرة...');
            await this.cacheEntireSite();
        }
    }

    // حفظ الموقع كامل في الذاكرة
    async cacheEntireSite() {
        try {
            const cache = await caches.open('quran-app-cache');
            const filesToCache = [
                '/',
                '/index.html',
                '/load-storage.js',
                '/advanced-storage.js'
            ];

            await cache.addAll(filesToCache);
            console.log('✅ تم حفظ الموقع كامل في الذاكرة');
            this.showMessage('✅ التطبيق جاهز للعمل بدون إنترنت');
        } catch (error) {
            console.log('❌ خطأ في حفظ الموقع:', error);
        }
    }

    // نظام بديل إذا لم يعمل Service Worker
    setupLocalStorageFallback() {
        console.log('🔧 تفعيل النظام الاحتياطي...');
        
        // حفظ HTML كامل كل 30 ثانية
        setInterval(() => {
            try {
                localStorage.setItem('app_full_backup', document.documentElement.outerHTML);
                localStorage.setItem('backup_time', new Date().toISOString());
            } catch (e) {
                console.log('⚠️ لا يمكن الحفظ في الذاكرة');
            }
        }, 30000);

        // استرجاع عند عدم الاتصال
        window.addEventListener('offline', () => {
            this.loadFromBackup();
        });
    }

    // تحميل من النسخة الاحتياطية
    loadFromBackup() {
        const backup = localStorage.getItem('app_full_backup');
        if (backup) {
            console.log('🔋 تحميل من النسخة الاحتياطية');
            this.showMessage('🔋 العمل من الذاكرة المحلية');
        }
    }

    // اكتشاف حالة الاتصال
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showMessage('🌐 اتصال عاد', 'green');
        });

        window.addEventListener('offline', () => {
            this.showMessage('🚫 اتصال انقطع - العمل من الذاكرة', 'orange');
        });

        // التحقق الأولي
        if (!navigator.onLine) {
            this.showMessage('🔋 وضع عدم الاتصال', 'orange');
        }
    }

    // عرض رسائل للمستخدم
    showMessage(text, color = 'green') {
        // إزالة أي رسالة سابقة
        const oldMsg = document.getElementById('offline-message');
        if (oldMsg) oldMsg.remove();

        // إنشاء رسالة جديدة
        const msg = document.createElement('div');
        msg.id = 'offline-message';
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${color};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: 14px;
        `;
        
        document.body.appendChild(msg);
        
        // إزالة الرسالة بعد 3 ثواني
        setTimeout(() => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        }, 3000);
    }
}

// بدء النظام فوراً
document.addEventListener('DOMContentLoaded', function() {
    window.appStorage = new AdvancedStorage();
});
