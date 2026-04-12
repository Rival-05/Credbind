const DB_NAME = "CredBindWallet";
const STORE_NAME = "keys";

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function savePrivateKey(key: string) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(key, "privateKey");
}

export async function getPrivateKey(): Promise<string | null> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get("privateKey");

    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || null);
    });
}