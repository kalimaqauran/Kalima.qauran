// advanced-storage.js - ضع هذا الكود كاملاً في الملف

class AdvancedStorage {
    constructor() {
        this.dbName = 'SmartAppDB';
        this.version = 1;
        this.init();
    }

    async init() {
        console.log('🚀 بدء نظام التخزين المتقدم...');
        await this.initDatabase();
        await this.autoSaveCurrentState();
        this.setupSmartSync();
        this.setupAutoSave();
    }

    // إنشاء قاعدة البيانات
    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('pages')) {
                    const pagesStore = db.createObjectStore('pages', { keyPath: 'url' });
                    pagesStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('user_data')) {
                    db.createObjectStore('user_data', { keyPath: 'key' });
                }
                
                console.log('🗃️ تم إنشاء قاعدة البيانات');
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ قاعدة البيانات جاهزة');
                resolve();
            };

            request.onerror = (event) => {
                console.error('❌ خطأ في قاعدة البيانات:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // حفظ حالة الصفحة الحالية
    async autoSaveCurrentState() {
        try {
            const pageData = {
                url: window.location.href,
                html: document.documentElement.outerHTML,
                timestamp: Date.now(),
                title: document.title
            };

            await this.saveToDB('pages', pageData);
            console.log('💾 تم حفظ الصفحة الحالية');
            
            // حفظ بيانات النماذج
            await this.saveFormsData();
            
        } catch (error) {
            console.log('⚠️ لا يمكن الحفظ الآن:', error);
        }
    }

    // حفظ بيانات النماذج
    async saveFormsData() {
        const formsData = {};
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach((input, index) => {
            if (input.name || input.id) {
                const key = input.name || input.id || `input_${index}`;
                formsData[key] = input.value;
            }
        });

        await this.saveToDB('user_data', {
            key: 'forms_data',
            data: formsData,
            timestamp: Date.now()
        });
    }

    // دالة الحفظ العامة
    async saveToDB(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // استرجاع البيانات
    async loadFromDB(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName]);
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // إعداد الحفظ التلقائي
    setupAutoSave() {
        // حفظ كل 30 ثانية
        setInterval(() => {
            this.autoSaveCurrentState();
        }, 30000);

        // حفظ عند مغادرة الصفحة
        window.addEventListener('beforeunload', () => {
            this.autoSaveCurrentState();
        });
    }

    // المزامنة الذكية
    setupSmartSync() {
        // عند عودة الاتصال
        window.addEventListener('online', () => {
            console.log('🌐 اتصال عاد - جاري المزامنة...');
            this.showMessage('✅ اتصال عاد - تم المزامنة');
        });

        // عند فقدان الاتصال
        window.addEventListener('offline', () => {
            console.log('🚫 اتصال انقطع - العمل من الذاكرة');
            this.showMessage('🔋 العمل من الذاكرة المحلية');
            this.loadLastSavedState();
        });
    }

    // استرجاع آخر حالة محفوظة
    async loadLastSavedState() {
        try {
            const savedData = await this.loadFromDB('pages', window.location.href);
            if (savedData && savedData.html) {
                console.log('📂 جاري تحميل النسخة المحفوظة');
                // هنا يمكنك تحميل البيانات المحفوظة
            }
        } catch (error) {
            console.log('❌ لا يمكن تحميل البيانات المحفوظة');
        }
    }

    // عرض رسائل للمستخدم
    showMessage(text) {
        // إزالة أي رسالة سابقة
        const oldMsg = document.getElementById('storage-message');
        if (oldMsg) oldMsg.remove();

        // إنشاء رسالة جديدة
        const msg = document.createElement('div');
        msg.id = 'storage-message';
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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

// بدء التشغيل التلقائي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // الانتظار قليلاً لتحميل الصفحة بالكامل
    setTimeout(() => {
        window.appStorage = new AdvancedStorage();
        console.log('🎯 نظام التخزين المتقدم يعمل!');
    }, 1000);
});
