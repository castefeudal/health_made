/**
 * Small browser-only IndexedDB mirror. The synchronous repository remains the
 * compatibility read path for old releases; this mirror keeps the expanded
 * v4 state out of localStorage when IndexedDB is available.
 */
export const LIFE_OS_DB = 'markov-life-os';
export const LIFE_OS_DB_VERSION = 1;
export const LIFE_OS_STORE = 'state';

function hasIndexedDB(){ return typeof indexedDB !== 'undefined'; }

export class IndexedDBMirror{
  constructor({dbName=LIFE_OS_DB}={}){ this.dbName=dbName; this.pending=null; }
  open(){
    if(!hasIndexedDB()) return Promise.resolve(null);
    return new Promise((resolve,reject)=>{
      const request=indexedDB.open(this.dbName,LIFE_OS_DB_VERSION);
      request.onupgradeneeded=()=>{ if(!request.result.objectStoreNames.contains(LIFE_OS_STORE)) request.result.createObjectStore(LIFE_OS_STORE,{keyPath:'id'}); };
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||new Error('indexeddb-open-failed'));
    });
  }
  async write(state){
    if(!hasIndexedDB()) return false;
    try{
      const db=await this.open();
      await new Promise((resolve,reject)=>{
        const tx=db.transaction(LIFE_OS_STORE,'readwrite');
        tx.objectStore(LIFE_OS_STORE).put({id:'current',version:state.version,updatedAt:Date.now(),data:state});
        tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error||new Error('indexeddb-write-failed'));
      });
      db.close(); return true;
    }catch(_){ return false; }
  }
  async read(){
    if(!hasIndexedDB()) return null;
    try{
      const db=await this.open();
      const row=await new Promise((resolve,reject)=>{ const tx=db.transaction(LIFE_OS_STORE,'readonly'); const req=tx.objectStore(LIFE_OS_STORE).get('current'); req.onsuccess=()=>resolve(req.result||null); req.onerror=()=>reject(req.error); });
      db.close(); return row?.data||null;
    }catch(_){ return null; }
  }
  async estimate(){
    if(typeof navigator!=='undefined'&&navigator.storage?.estimate) return navigator.storage.estimate();
    return {usage:0,quota:0};
  }
}

export function indexedDBAvailable(){ return hasIndexedDB(); }
