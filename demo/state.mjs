export const defaults = Object.freeze({mode:'system',preset:'lyt',locale:'system',notifications:true});
export function validatePrefs(raw={}) {
 if (!raw || typeof raw !== 'object') raw={};
 return {mode:['system','light','dark'].includes(raw.mode)?raw.mode:'system',preset:['lyt','sage'].includes(raw.preset)?raw.preset:'lyt',locale:['system','en','zh-Hans','ar','en-XA'].includes(raw.locale)?raw.locale:'system',notifications:typeof raw.notifications==='boolean'?raw.notifications:true};
}
export function readPrefs(storage, key) { try {return validatePrefs(JSON.parse(storage.getItem(key)));} catch {return {...defaults};} }
export function writePrefs(storage,key,prefs) {try {storage.setItem(key,JSON.stringify({schema:1,...validatePrefs(prefs)}));return true;}catch{return false;}}
export function resolveLocale(choice, languages=['en']) {
 if(choice!=='system' && ['en','zh-Hans','ar','en-XA'].includes(choice)) return choice;
 for(const lang of languages) {
  const code=lang.toLowerCase();
  if(/^zh(?:-|$)/.test(code)) {
   if(/hant/.test(code) || (!/hans/.test(code) && /-(tw|hk|mo)(-|$)/.test(code))) continue;
   return 'zh-Hans';
  }
  if(/^ar(?:-|$)/.test(code)) return 'ar';
  if(/^en(?:-|$)/.test(code) && code!=='en-xa') return 'en';
 }
 return 'en';
}
export const languages=[
 {code:'system',name:'Follow system',sort:'',aliases:'system 跟随系统 النظام'},
 {code:'ar',name:'العربية',sort:'Arabic',aliases:'Arabic ar 阿拉伯语'},
 {code:'zh-Hans',name:'简体中文',sort:'Chinese',aliases:'Chinese zh 中文 汉语 汉字'},
 {code:'en',name:'English',sort:'English',aliases:'English en 英语'},
 {code:'en-XA',name:'English — long text',sort:'English long',aliases:'pseudo long test 长文本'}
];
const normalize=s=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().trim();
export function searchLanguages(query) {const q=normalize(query);return languages.filter(l=>normalize(`${l.name} ${l.code} ${l.aliases}`).includes(q));}
