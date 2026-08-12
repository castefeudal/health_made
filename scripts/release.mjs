import {cp, mkdir, rm, readdir, stat, writeFile} from 'node:fs/promises';
import {join, relative} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=new URL('../',import.meta.url); const rootPath=root.pathname;
const qa=spawnSync('npm',['run','qa'],{cwd:rootPath,stdio:'inherit'});
if(qa.status!==0) process.exit(qa.status||1);
const releaseRoot=join(rootPath,'release'); const appRoot=join(releaseRoot,'health-made-max');
await rm(releaseRoot,{recursive:true,force:true}); await mkdir(appRoot,{recursive:true});
const files=['index.html','manifest.webmanifest','sw.js','privacy.html','terms.html','README.md','LICENSE','CHANGELOG.md','package.json','start-local.sh','start-local.bat','assets','docs','src/catalog','src/app','src/core','src/engine','src/modules','src/ui','src/v3/schema.js','src/v3/storage.js','src/v3/labs.js','src/v3/importers.js','src/v3/analytics.js','src/v3/brief.js','src/v3/crypto.js','src/v3/styles.css','tests','scripts/build-check.mjs','scripts/lint.mjs','scripts/release.mjs'];
for(const file of files) await cp(join(rootPath,file),join(appRoot,file),{recursive:true});
async function walk(dir){const out=[];for(const name of await readdir(dir)){const path=join(dir,name);const info=await stat(path);if(info.isDirectory())out.push(...await walk(path));else out.push(path);}return out;}
const manifest=[];for(const file of (await walk(appRoot)).sort()){const hash=createHash('sha256').update(await (await import('node:fs/promises')).readFile(file)).digest('hex');manifest.push(`${hash}  ${relative(appRoot,file)}`);}
await writeFile(join(appRoot,'RELEASE-MANIFEST.sha256'),`${manifest.join('\n')}\n`);
const zipPath=join(rootPath,'health-made-max-local-first.zip');
const zip=spawnSync('zip',['-qr',zipPath,'health-made-max'],{cwd:releaseRoot,stdio:'inherit'});
if(zip.status!==0) throw new Error('zip command failed');
console.info(`Release ready: ${zipPath}`);
