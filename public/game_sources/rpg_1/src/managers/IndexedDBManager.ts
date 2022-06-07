const indexedDb = (window as any).indexedDB || (window as any).webkitIndexedDB;

type IndexedDBManagerRecord = {
    key: string;
    value: any;
};

export default class IndexedDBManager {
    public static readonly dbName: string = 'escape-game-db';
    public static readonly dbVersion: number = 1;
    public static readonly storeName: string = 'escape-game-store';
    public static readonly storeIndex: string = 'key';
    private static db: IDBDatabase | null = null;

    public static init(onError: (e: Event) => void, onSuccess: () => void):void {
        if(!indexedDb) {
            throw new Error('indexed db is not supported');
        }
    
        const request = indexedDb.open(
            IndexedDBManager.dbName,
            IndexedDBManager.dbVersion
        );
        request.onupgradeneeded = (e: Event) => {
            IndexedDBManager.upgradeDB(e);
        };
        request.onsuccess = (e: Event) => {
            const db = (e.target as IDBRequest).result;
            IndexedDBManager.db = db;
            onSuccess();
        };
        request.onerror = (e: Event) => onError(e);
     }

     public static put(
         key: string,
         data: any,
         onSuccess?: (e: Event) => void,
         onError?: (e?: Event) => void
     ): void {
         const store = IndexedDBManager.getStoreObject();
         if(!store) {
             if(onError) onError();
             return;
         }

         const record = IndexedDBManager.createRecordObject(key, data);
         const request = store.put(record);
         if(onSuccess) request.onsuccess = (e) => { onSuccess(e); };
         
         if(onError) request.onerror = (e) => { onError(e); };
     }

     public static get(
         key: string,
         onSuccess: (value: any, key: string | undefined) => void,
         onError?: (e?: Event) => void
     ): void {
         const store = IndexedDBManager.getStoreObject();
         if(!store) {
             if(onError) onError();
             return;
         }

         const request = store.get(key);
         request.onsuccess = (e) => {
             const result = (e.target as IDBRequest).result as IndexedDBManagerRecord;
             (result) ? onSuccess(result.value, result.key) : onSuccess(undefined, undefined);
         };
         if(onError) request.onerror = (e) => {onError(e)};
     }

     public static delete(
         key: string,
         onSuccess?: (e: Event) => void,
         onError?: (e?: Event) => void
     ): void {
         const store = IndexedDBManager.getStoreObject();
         if(!store) {
             if(onError) onError();
             return;
         }

         const request = store.delete(key);
         if(onSuccess) request.onsuccess = (e) => { onSuccess(e); };
         
         if(onError) request.onerror = (e) => { onError(e) };
     }

     public static clear(
         onSuccess?: (e: Event) => void,
         onError?: (e?: Event) => void
     ): void {
         const store = IndexedDBManager.getStoreObject();
         if(!store) {
             if(onError) onError();
             return;
         }

         const request = store.clear();
         if(onSuccess) request.onsuccess = (e) => { onSuccess(e); };
         
         if(onError) request.onerror = (e) => { onError(e); };
     }

     private static upgradeDB(e: Event): void {
         const db = (e.target as IDBRequest).result;

         const index = IndexedDBManager.storeIndex;
         const storeName = IndexedDBManager.storeName;
         const store = db.createObjectStore(storeName, { keyPath: index });
         store.createIndex(index, index, { unique: true });
     }

     private static getStoreObject(): IDBObjectStore | null {
         if(!IndexedDBManager.db) return null;
         
         const storeName = IndexedDBManager.storeName;
         const transaction = IndexedDBManager.db.transaction(storeName, 'readwrite');
         return transaction.objectStore(storeName);
     }

     private static createRecordObject(key: string, value: any): IndexedDBManagerRecord {
             return { key, value };
         }
}