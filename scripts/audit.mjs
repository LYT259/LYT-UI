import {readdir,readFile,lstat,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
const ignored=new Set(['.git','.local','node_modules','dist','.DS_Store']);
const files=[];
async function walk(dir){for(const name of await readdir(dir)){if(ignored.has(name))continue;const path=dir+'/'+name,s=await lstat(path);assert.ok(!s.isSymbolicLink(),`Symlink not portable: ${path}`);if(s.isDirectory())await walk(path);else files.push(path);}}
await walk('.');
for(const file of files){
 assert.ok(!/(?:^|\/)(?:AGENTS\.md|CLAUDE\.md|\.env(?:\.|$)|MEMORY\.md)/.test(file),`Private file: ${file}`);
 assert.ok(!/README(?:\.[a-z-]+)?\.md$/i.test(file),'Formal README is reserved for later acceptance');
 if(/\.(png|jpg|woff2?|zip)$/.test(file))continue;
 const content=await readFile(file,'utf8');
 for(const pattern of [new RegExp('/'+'Users/'),new RegExp('/'+'home/[^/]+/'),/gh[pousr]_[A-Za-z0-9]{20,}/,/github_pat_[A-Za-z0-9_]{20,}/,/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/])assert.ok(!pattern.test(content),`Private content in ${file}`);
 if(file.endsWith('.md'))for(const m of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const ref=m[1];if(/^(?:https?:|#)/.test(ref)||ref.includes('<'))continue;
  const target=resolve(dirname(file),ref.split('#')[0]);await access(target).catch(()=>{throw new Error(`Broken reference in ${file}: ${ref}`);});
 }
}
const skill=await readFile('skills/lyt-ui/SKILL.md','utf8');assert.match(skill,/^---\nname: lyt-ui\ndescription: .+\n---/);assert.equal(await readFile('LICENSE','utf8'),await readFile('skills/lyt-ui/LICENSE','utf8'));
console.log(`Audited ${files.length} source files: references, portable resources, license parity, privacy patterns and README boundary pass. Pattern scan is not a complete secrets audit.`);
