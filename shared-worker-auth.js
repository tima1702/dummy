const dbName = 'authTokenDB';
const storeName = 'tokenStore';
const dbVersion = 1;
let db;
const ports = [];

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }

            resolve(db);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }

            resolve(db);
        };

        request.onerror = function(event) {
            reject('IndexedDB error: ' + event.target.errorCode);
        };
    });
}

async function getToken() {
    if (!db) await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get('token');

        request.onsuccess = function(event) {
            const result = event.target.result;

            resolve(result ? result.value : null);
        };

        request.onerror = function(event) {
            reject('Failed to get token from IndexedDB');
        };
    });
}

async function updateToken(newValue) {
    if (!db) await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ id: 'token', value: newValue });

        request.onsuccess = function() {
            console.log('request.onsuccess', newValue);
            resolve(newValue);
        };

        request.onerror = function(event) {
            reject('Failed to update token in IndexedDB');
        };
    });
}

onconnect = function(e) {
    const port = e.ports[0];
    ports.push(port);

    port.start();

    port.onmessage = async function(event) {
        if (!db) await openDB();

        console.log('event', event);

        if (event.data.command === 'updateToken') {
            const token = await updateToken(event.data.token);
            port.postMessage({ token: token, id: event.data.id });
            ports.forEach(p => p.postMessage({ token }));
        } else if (event.data.command === 'getToken') {
            const currentValue = await getToken();
            port.postMessage({ token: currentValue, id: event.data.id });
        }
    };
};
