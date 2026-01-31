
export const DB_NAME = 'ContadorPro_DB';
export const DB_VERSION = 2; // Incremented version to add new stores

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      
      // Existing stores
      if (!db.objectStoreNames.contains('workers')) db.createObjectStore('workers', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('company')) db.createObjectStore('company', { keyPath: 'rut' });
      if (!db.objectStoreNames.contains('costCenters')) db.createObjectStore('costCenters', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('concepts')) db.createObjectStore('concepts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('contractTypes')) db.createObjectStore('contractTypes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('terminationCauses')) db.createObjectStore('terminationCauses', { keyPath: 'id' });
      
      // New stores for payroll process
      if (!db.objectStoreNames.contains('monthlyMovements')) {
        db.createObjectStore('monthlyMovements', { keyPath: 'id' }); // composite id like "workerId_month_year"
      }
      if (!db.objectStoreNames.contains('calculations')) {
        db.createObjectStore('calculations', { keyPath: 'id' }); // composite id
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveData = async (storeName: string, data: any) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    store.put(data);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getAllData = async (storeName: string): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getDataById = async (storeName: string, id: string): Promise<any> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
