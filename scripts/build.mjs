import { readFile, mkdir, cp, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const pkg = JSON.parse(await readFile('package.json'));
let commit = 'unknown';
try { commit = execFileSync('git',['rev-parse','--short=12','HEAD'],{stdio:['ignore','pipe','ignore']}).toString().trim();
 if(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim()) commit += '-dirty';
} catch {}
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('demo','dist',{recursive:true});
await cp('skills/lyt-ui','dist/skill',{recursive:true});
const version={name:'LYT UI',version:pkg.version,commit};
await writeFile('dist/version.json',JSON.stringify(version,null,2)+'\n');
await writeFile('dist/skill/VERSION.json',JSON.stringify(version,null,2)+'\n');
await cp('LICENSE','dist/LICENSE');
await mkdir('dist/checks',{recursive:true});
await cp('tests/browser-check.mjs','dist/checks/browser-check.mjs');
console.log(`Built static reference and portable skill ${pkg.version} (${commit}).`);
