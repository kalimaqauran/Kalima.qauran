// load-storage.js - النسخة الكاملة
console.log('🔧 بدء تحميل نظام التخزين المتقدم...');

// دالة لتحميل السكريبت بشكل آمن
function loadScript(src, isModule = false) {
    return new Promise((resolve, reject) => {
        // التحقق إذا السكريبت محمل مسبقاً
        if (document.querySelector(`script[src="${src}"]`)) {
            console.log('✅ السكريبت محمل مسبقاً');
            return resolve();
        }

        const script = document.createElement('script');
        script.src = src;
        
        if (isModule) {
            script.type = 'module';
        }
        
        script.onload = () => {
            console.log(`✅ تم تحميل ${src} بنجاح`);
            resolve();
        };
        
        script.onerror = (error) => {
            console.log(`❌ فشل تحميل ${src}:`, error);
            reject(error);
        };
        
        // إضافة إلى head لضمان التحميل الصحيح
        document.head.appendChild(script);
    });
}

// دالة لتحميل السكريبت المضمن (كود مباشر)
function loadInlineScript(code) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.textContent = code;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// النظام الأساسي للتحميل
async function initializeStorageSystem() {
    console.log('🚀 بدء تهيئة نظام التخزين...');
    
    try {
        // المحاولة الأولى: تحميل advanced-storage.js
        await loadScript('/advanced-storage.js');
        
        // التحقق إذا تم تحميل الكلاس بنجاح
        if (typeof AdvancedStorage === 'function') {
            console.log('✅ تم تحميل AdvancedStorage بنجاح');
            
            // انتظار تحميل DOM بالكامل
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    window.appStorage = new AdvancedStorage();
                    console.log('🎯 نظام التخزين المتقدم يعمل!');
                });
            } else {
                window.appStorage = new AdvancedStorage();
                console.log('🎯 نظام التخزين المتقدم يعمل!');
            }
        } else {
            throw new Error('AdvancedStorage غير معرف');
        }
        
    } catch (error) {
        console.log('❌ فشل التحميل الرئيسي، جاري النظام الاحتياطي...', error);
        await loadFallbackSystem();
    }
}

// النظام الاحتياطي
async function loadFallbackSystem() {
    console.log('🔋 تحميل النظام الاحتياطي...');
    
    const fallbackCode = `
        console.log('💾 بدء نظام التخزين الاحتياطي...');
        
        class BasicStorage {
            constructor() {
                this.isOnline = navigator.onLine;
                this.init();
            }
            
            init() {
                console.log('🔧 تهيئة النظام الاحتياطي...');
                this.setupAutoSave();
                this.setupOfflineDetection();
                this.showStatusMessage();
            }
            
            setupAutoSave() {
                // حفظ كل 30 ثانية
                setInterval(() => {
                    this.saveAppState();
                }, 30000);
                
                // حفظ عند مغادرة الصفحة
                window.addEventListener('beforeunload', () => {
                    this.saveAppState();
                });
            }
            
            saveAppState() {
                try {
                    const appState = {
                        html: document.documentElement.outerHTML,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        title: document.title
                    };
                    
                    localStorage.setItem('quran_app_full_backup', JSON.stringify(appState));
                    console.log('💾 تم الحفظ الاحتياطي');
                } catch (error) {
                    console.log('⚠️ خطأ في الحفظ الاحتياطي:', error);
                }
            }
            
            setupOfflineDetection() {
                window.addEventListener('online', () => {
                    this.isOnline = true;
                    this.showMessage('🌐 اتصال عاد', 'green');
                });
                
                window.addEventListener('offline', () => {
                    this.isOnline = false;
                    this.showMessage('🚫 اتصال انقطع - العمل من الذاكرة', 'orange');
                    this.loadFromBackup();
                });
                
                // التحقق الأولي
                if (!this.isOnline) {
                    this.showMessage('🔋 وضع عدم الاتصال', 'orange');
                    this.loadFromBackup();
                }
            }
            
            loadFromBackup() {
                try {
                    const backup = localStorage.getItem('quran_app_full_backup');
                    if (backup) {
                        console.log('📂 تم تحميل النسخة الاحتياطية');
                        // يمكن إضافة منطق لتحميل البيانات المحددة هنا
                    }
                } catch (error) {
                    console.log('❌ خطأ في تحميل النسخة الاحتياطية');
                }
            }
            
            showStatusMessage() {
                const status = this.isOnline ? '✅ متصل بالإنترنت' : '🔋 يعمل بدون إنترنت';
                console.log('📱 حالة التطبيق:', status);
            }
            
            showMessage(text, color = 'green') {
                // إزالة الرسائل القديمة
                const oldMessages = document.querySelectorAll('.storage-message');
                oldMessages.forEach(msg => msg.remove());
                
                // إنشاء رسالة جديدة
                const message = document.createElement('div');
                message.className = 'storage-message';
                message.textContent = text;
                message.style.cssText = \`
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: \${color};
                    color: white;
                    padding: 12px 18px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border: 1px solid \${color === 'green' ? '#2e7d32' : color === 'orange' ? '#ef6c00' : '#d32f2f'};
                    max-width: 300px;
                    text-align: center;
                \`;
                
                document.body.appendChild(message);
                
                // إزالة تلقائية بعد 4 ثواني
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 4000);
            }
        }
        
        // بدء النظام الاحتياطي
        setTimeout(() => {
            window.appStorage = new BasicStorage();
            console.log('🎯 النظام الاحتياطي يعمل بنجاح!');
        }, 1000);
    `;
    
    await loadInlineScript(fallbackCode);
}

// التحقق من توفر APIs المطلوبة
function checkBrowserSupport() {
    const features = {
        localStorage: !!window.localStorage,
        serviceWorker: 'serviceWorker' in navigator,
        caches: 'caches' in window,
        indexedDB: 'indexedDB' in window,
        online: 'onLine' in navigator
    };
    
    console.log('🔍 دعم المتصفح:', features);
    return features.localStorage; // الحد الأدنى المطلوب
}

// بدء التنفيذ
if (checkBrowserSupport()) {
    // انتظار تحميل الصفحة بالكامل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeStorageSystem, 500);
        });
    } else {
        setTimeout(initializeStorageSystem, 500);
    }
} else {
    console.log('❌ المتصفح لا يدعم التخزين المحلي');
    loadInlineScript(`
        console.log('⚠️ هذا المتصفح لا يدعم العمل بدون إنترنت');
        setTimeout(() => {
            alert('⚠️ للتجربة الكاملة، نوصي باستخدام متصفح حديث مثل Chrome أو Firefox');
        }, 2000);
    `);
}

// إضافة styles للرسائل إذا لم تكن موجودة
const style = document.createElement('style');
style.textContent = \`
    .storage-message {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(style);

console.log('🔧 انتهى تحميل نظام التخزين');
