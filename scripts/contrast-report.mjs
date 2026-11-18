import {readFile,writeFile} from 'node:fs/promises';
import {contrast,resolveTokens} from '../skills/lyt-ui/assets/web/theme.mjs';
const tokens=JSON.parse(await readFile('skills/lyt-ui/assets/tokens.json'));
const rows=[];
for(const mode of ['light','dark'])for(const preset of ['lyt','sage']){
 const t=resolveTokens(tokens,mode,preset);
 for(const [fg,bg,min]of [['text','surface',4.5],['muted','surface',4.5],['on-accent','accent',4.5],['on-accent','accent-hover',4.5],['on-accent','accent-pressed',4.5],['accent-text','selected',4.5],['error','error-bg',4.5],['success','success-bg',4.5],['warning','warning-bg',4.5],['control-border','surface',3],['focus','surface',3]]){
 const ratio=contrast(t[fg],t[bg]);rows.push({mode,preset,foreground:fg,background:bg,ratio:Number(ratio.toFixed(3)),required:min,pass:ratio>=min});
 }
}
await writeFile('evidence/contrast.json',JSON.stringify({method:'WCAG sRGB relative luminance; opaque colors; selected report pairs, broader pairs in tests/theme.test.mjs',results:rows},null,2)+'\n');
console.log(`${rows.length} reported contrast pairs; all pass: ${rows.every(r=>r.pass)}`);
