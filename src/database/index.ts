export namespace Database {
  export function create(): Promise<IDBDatabase> {
    const promise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(Const.TALLY_PAD);

      req.onsuccess = function(event) {
        // @ts-ignore
        const db = event.target.result;
        resolve(db);
      };

      req.onerror = function() {
        reject(new Error("创建数据库失败！"));
      };

      req.onupgradeneeded = function(event) {
        // @ts-ignore
        const db = event.target.result as IDBDatabase;
        const record = db.createObjectStore(Const.RECORD, { keyPath: "id" });
        const comments = db.createObjectStore(Const.COMMENTS, { keyPath: "id" });
        const viewDate = db.createObjectStore(Const.VIEW_DATE, { keyPath: "id" });

        record.add({ id: "2024", items: { "1": { items: [], surplus: 0, budget: 0 } } });
        comments.add({ id: "0", items: [{ value: "生活费", cost: 1800, type: "支" }] });
        viewDate.add({ id: "0", Y: "2024", M: "1" });
      };
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }

  export function add(db: IDBDatabase, table: string, data: any, key?: any) {
    const promise = new Promise((resolve, reject) => {
      const transaction = db.transaction([table], "readwrite");
      const store = transaction.objectStore(table);
      const req = store.add(data, key);

      req.onsuccess = function() {
        resolve(db);
      };

      req.onerror = function() {
        reject(new Error("插入数据错误！"));
      };
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }

  export function drop(db: IDBDatabase, table: string, key: any) {
    const promise = new Promise((resolve, reject) => {
      const transaction = db.transaction([table], "readwrite");
      const store = transaction.objectStore(table);
      const req = store.delete(key);

      req.onsuccess = function() {
        resolve(db);
      };

      req.onerror = function() {
        reject(new Error("删除数据错误！"));
      };
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }

  export function put(db: IDBDatabase, table: string, data: any, key: any) {
    const promise = new Promise((resolve, reject) => {
      const transaction = db.transaction([table], "readwrite");
      const store = transaction.objectStore(table);
      const req = store.get(key);

      req.onsuccess = function(event) {
        store.put(data).onsuccess = function() {
          resolve(db);
        };
      };

      req.onerror = function() {
        reject(new Error("更新数据错误！"));
      };
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }

  export function get<T>(db: IDBDatabase, table: string, key?: any) {
    const promise = new Promise<T>((resolve, reject) => {
      const transaction = db.transaction([table], "readwrite");
      const store = transaction.objectStore(table);

      if (key) {
        const req = store.get(key);

        req.onsuccess = function() {
          const result = req.result;
          if (result) {
            resolve(result);
          } else {
            resolve(null);
          }
        };

        req.onerror = function() {
          reject(null);
        };
      } else {
        const req = store.openCursor();

        req.onsuccess = function(event) {
          // @ts-ignore
          const cursor = event.target.result;
          if (cursor) {
            resolve(cursor.value);
            cursor.continue();
          }
        };

        req.onerror = function() {
          reject(null);
        };
      }
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }

  export function keys(db: IDBDatabase, table: string) {
    const promise = new Promise<string[]>((resolve, reject) => {
      const transaction = db.transaction([table], "readonly");
      const req = transaction.objectStore(table).getAllKeys();

      req.onsuccess = function(event) {
        // @ts-ignore
        resolve(event.target.result);
      };

      req.onerror = function() {
        reject(null);
      };
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }

  export function del(dbname: string) {
    const promise = new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(dbname);

      req.onsuccess = function() {
        resolve(null);
      };

      req.onerror = function() {
        reject(null);
      };

      req.onblocked = function() {
        reject(null);
      };
    });

    promise.catch(error => {
      console.error(error);
    });

    return promise;
  }
}
