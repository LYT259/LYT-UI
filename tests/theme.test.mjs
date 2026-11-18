import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {contrast,resolveTokens,applyTheme} from '../skills/lyt-ui/assets/web/theme.mjs';
const tokens=JSON.parse(await readFile(new URL('../skills/lyt-ui/assets/tokens.json',import.meta.url)));
export const pairs=[
 ...['canvas','surface','raised','hover','pressed'].flatMap(bg=>[['text',bg,4.5],['muted',bg,4.5]]),
 ...['accent','accent-hover','accent-pressed'].map(bg=>['on-accent',bg,4.5]),
 ['accent-text','surface',4.5],['accent-text','selected',4.5],['disabled-text','disabled-bg',4.5],
 ...['success','warning','error'].map(s=>[s,s+'-bg',4.5]),
 ...['canvas','surface','raised','selected','hover','pressed'].map(bg=>['focus',bg,3]),
 ...['canvas','surface','raised'].map(bg=>['control-border',bg,3]),
 ...['data-a','data-b','data-c'].map(c=>[c,'raised',3])
];
for(const mode of ['light','dark'])for(const preset of Object.keys(tokens.presets)){
 test(`${mode}/${preset}: text, state, focus and boundaries meet contrast`,()=>{const v=resolveTokens(tokens,mode,preset);for(const [fg,bg,min]of pairs)assert.ok(contrast(v[fg],v[bg])>=min,`${fg}/${bg} = ${contrast(v[fg],v[bg]).toFixed(2)} < ${min}`);});
 test(`${mode}/${preset}: data, status and brand are independent`,()=>{const v=resolveTokens(tokens,mode,preset),base=resolveTokens(tokens,mode,'lyt');for(const name of ['brand','data-a','data-b','data-c','success','success-bg','error','error-bg','warning','warning-bg'])assert.equal(v[name],base[name]);});
}
test('system tracks OS while fixed mode ignores it',()=>{const root={style:{setProperty(){}},dataset:{}};applyTheme(tokens,{mode:'system',systemDark:true},root);assert.equal(root.dataset.theme,'dark');applyTheme(tokens,{mode:'light',systemDark:true},root);assert.equal(root.dataset.theme,'light');assert.equal(root.style.colorScheme,'light');});
test('contrast rejects alpha without known background and matches black/white',()=>{assert.equal(contrast('#000000','#ffffff'),21);assert.throws(()=>contrast('#00000088','#ffffff'));});
