import {APP_ID,APP_VERSION,SCHEMA_VERSION,STORAGE_KEY,SAFETY_KEY,emptyState,migrateV2ToV3,migrateV3ToV4,normalizeV3,validateState,nowIso} from './schema.js';
import {IndexedDBMirror} from '../core/storage/indexed-db.js';

function clone(value){ return globalThis.structuredClone?structuredClone(value):JSON.parse(JSON.stringify(value)); }
function countRecords(data){ return Object.entries(data).filter(([,v])=>Array.isArray(v)).reduce((n,[,v])=>n+v.length,0); }
export async function sha256Text(text){
  if(!globalThis.crypto?.subtle) return null;
  const bytes=new TextEncoder().encode(text);
  const hash=new Uint8Array(await crypto.subtle.digest('SHA-256',bytes));
  return [...hash].map(x=>x.toString(16).padStart(2,'0')).join('');
}


export async function verifyBackupChecksum(payload){
  if(!payload?.checksum) return {ok:true,verified:false};
  const data=payload.data&&typeof payload.data==='object'?payload.data:payload;
  const actual=await sha256Text(JSON.stringify(data));
  return {ok:actual===payload.checksum,verified:true,actual,expected:payload.checksum};
}

export class HealthRepository{
  constructor(storage=globalThis.localStorage){ this.storage=storage; this.state=null; this.idb=new IndexedDBMirror(); }
  load(){
    const raw=this.storage?.getItem(STORAGE_KEY);
    if(!raw){ this.state=emptyState(); return clone(this.state); }
    let parsed; try{ parsed=JSON.parse(raw); }catch(e){ throw new Error('corrupted-storage-json'); }
    if(Number(parsed.version)===2){
      this.storage?.setItem(SAFETY_KEY,JSON.stringify({createdAt:nowIso(),reason:'pre-v3-migration',data:parsed}));
      const migrated=migrateV3ToV4(migrateV2ToV3(parsed)); this._persist(migrated); this.state=migrated; return clone(migrated);
    }
    if(Number(parsed.version)>SCHEMA_VERSION) throw new Error('future-schema');
    const migrated=Number(parsed.version)===3?migrateV3ToV4(parsed):parsed;
    if(Number(parsed.version)===3) this.storage?.setItem(SAFETY_KEY,JSON.stringify({createdAt:nowIso(),reason:'pre-v4-migration',data:parsed}));
    const normalized=normalizeV3(migrated);
    const check=validateState(normalized); if(!check.ok) throw new Error(`invalid-state:${check.errors.join('|')}`);
    this.state=normalized; return clone(normalized);
  }
  get(){ if(!this.state) return this.load(); return clone(this.state); }
  replace(next,{safetyReason='replace'}={}){
    const normalized=normalizeV3(next); const check=validateState(normalized);
    if(!check.ok) throw new Error(`invalid-state:${check.errors.join('|')}`);
    if(this.state) this.storage?.setItem(SAFETY_KEY,JSON.stringify({createdAt:nowIso(),reason:safetyReason,data:this.state}));
    this._persist(normalized); this.state=normalized; return clone(normalized);
  }
  transaction(mutator){
    const before=this.get(); const draft=clone(before); const result=mutator(draft);
    const candidate=result&&typeof result==='object'?result:draft;
    try{ return this.replace(candidate,{safetyReason:'transaction'}); }
    catch(error){ this.state=before; throw error; }
  }
  _persist(value){
    const serialized=JSON.stringify(value); this.storage?.setItem(STORAGE_KEY,serialized); this.idb.write(value);
    const verify=this.storage?.getItem(STORAGE_KEY); if(verify!==serialized) throw new Error('storage-readback-mismatch');
  }
  exportBackup(){
    const data=this.get(); return {application:APP_ID,appVersion:APP_VERSION,schemaVersion:SCHEMA_VERSION,createdAt:nowIso(),profileCount:data.profiles.length,recordCount:countRecords(data),checksum:null,data};
  }
  async exportBackupWithChecksum(){
    const payload=this.exportBackup();
    payload.checksum=await sha256Text(JSON.stringify(payload.data));
    return payload;
  }
  importBackup(payload){
    if(!payload||typeof payload!=='object') throw new Error('invalid-backup');
    const data=payload.data&&typeof payload.data==='object'?payload.data:payload;
    const application=payload.application??payload.backupMetadata?.application;
    if(application&&application!==APP_ID) throw new Error('wrong-application');
    const version=Number(payload.schemaVersion??payload.backupMetadata?.schemaVersion??data.version);
    if(version===2) return this.replace(migrateV3ToV4(migrateV2ToV3(data)),{safetyReason:'pre-restore-v2'});
    if(version===3) return this.replace(migrateV3ToV4(data),{safetyReason:'pre-restore-v3'});
    if(version!==SCHEMA_VERSION) throw new Error('unsupported-backup-schema');
    return this.replace(data,{safetyReason:'pre-restore'});
  }
  restoreSafety(){
    const raw=this.storage?.getItem(SAFETY_KEY); if(!raw) throw new Error('no-safety-backup');
    const parsed=JSON.parse(raw); const data=parsed.data;
    if(Number(data.version)===2) return this.replace(migrateV3ToV4(migrateV2ToV3(data)),{safetyReason:'restore-safety-v2'});
    if(Number(data.version)===3) return this.replace(migrateV3ToV4(data),{safetyReason:'restore-safety-v3'});
    return this.replace(data,{safetyReason:'restore-safety'});
  }
  clear(){ this.storage?.removeItem(STORAGE_KEY); this.storage?.removeItem(SAFETY_KEY); this.state=emptyState(); return clone(this.state); }
}
