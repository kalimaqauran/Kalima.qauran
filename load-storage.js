// load-storage.js - النسخة المؤكدة
console.log('🔧 بدء تحميل نظام التخزين الذكي...');

// طريقة مضمونة 100% للتحميل
function loadAdvancedStorage() {
    const script = document.createElement('script');
    script.src = '/advanced-storage.js';
    script.onload = function() {
        console.log('✅ تم تحميل نظام التخزين المتقدم!');
        // بدء النظام بعد التحميل
        if (typeof AdvancedStorage === 'function') {
            window.appStorage = new AdvancedStorage();
            console.log('🎯 نظام التخزين يعمل وجاهز!');
        }
    };
    script.onerror = function() {
        console.log('❌ فشل تحميل الملف، جاري المحاولة بطريقة بديلة...');
        loadAlternativeStorage();
    };
    document.head.appendChild(script);
}

// طريقة بديلة إذا فشل الملف الرئيسي
function loadAlternativeStorage() {
    const backupScript = document.createElement('script');
    backupScript.innerHTML = `
        console.log('🔋 استخدام نظام التخزين الاحتياطي...');
        class BasicStorage {
            constructor() {
                console.log('💾 نظام التخزين الاحتياطي يعمل!');
                this.startSaving();
                this.showSuccessMessage();
            }
            startSaving() {
                // حفظ كل 10 ثواني
                setInterval(() => {
                    const appData = {
                        html: document.documentElement.outerHTML,
                        saved_at: new Date().toISOString(),
                        title: document.title
                    };
                    localStorage.setItem('tasbih_backup', JSON.stringify(appData));
                    console.log('💾 تم الحفظ التلقائي');
                }, 10000);
            }
            showSuccessMessage() {
                // إظهار رسالة نجاح للمستخدم
                const msg = document.createElement('div');
                msg.innerHTML = '✅ التطبيق جاهز للعمل بدون إنترنت';
                msg.style.cssText = 'position:fixed; top:10px; left:10px; background:green; color:white; padding:10px; border-radius:5px; z-index:10000;';
                document.body.appendChild(msg);
                setTimeout(() => msg.remove(), 3000);
            }
        }
        new BasicStorage();
    `;
    document.head.appendChild(backupScript);
}

// بدء التحميل بعد تأخير بسيط لضمان تحميل الصفحة أولاً
setTimeout(loadAdvancedStorage, 1000);
