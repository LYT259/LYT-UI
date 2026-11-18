import {applyTheme} from './skill/assets/web/theme.mjs';
import {defaults,readPrefs,writePrefs,resolveLocale,languages,searchLanguages} from './state.mjs';
import {translate,itemCount} from './i18n.mjs';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const [tokens,kit,product]=await Promise.all(['./skill/assets/tokens.json','./version.json','./product.json'].map(async u=>{const r=await fetch(u);if(!r.ok)throw new Error(`Cannot load ${u}`);return r.json();}));
const key='stillroom.reference.preferences.v1', nameKey='stillroom.reference.workspace.v1';
let storage;try{storage=window.localStorage;}catch{}
let prefs=readPrefs(storage,key),locale=resolveLocale(prefs.locale,navigator.languages),savedName='Quiet mornings',notes=[],nextId=1,pinned=false,loading=false,recovered=false;
try{const stored=storage.getItem(nameKey);if(stored && [...stored.trim()].length<=60)savedName=stored;}catch{}
const mq=matchMedia('(prefers-color-scheme: dark)');
const t=k=>translate(locale,k), nameInput=$('#workspace-name');
nameInput.value=savedName;
const languageDialog=$('#language-dialog'),languageSearch=$('#language-search');
let matches=languages,active=-1;
function status(message){$('#app-status').textContent=message;}
function persist(){const ok=writePrefs(storage,key,prefs);$('#storage-warning').hidden=ok;return ok;}
function appearance(){applyTheme(tokens,{...prefs,systemDark:mq.matches});$$('[name=mode]').forEach(e=>e.checked=e.value===prefs.mode);$$('[name=preset]').forEach(e=>e.checked=e.value===prefs.preset);}
function dirty(){const changed=nameInput.value!==savedName;$('#dirty-status').textContent=t(changed?'formChanged':'formClean');return changed;}
function localize(){
 locale=resolveLocale(prefs.locale,navigator.languages);
 document.documentElement.lang=locale==='en-XA'?'en':locale;
 document.documentElement.dir=locale==='ar'?'rtl':'ltr';
 $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 $$('[data-label]').forEach(e=>e.setAttribute('aria-label',t(e.dataset.label)));
 $$('[data-placeholder]').forEach(e=>e.placeholder=t(e.dataset.placeholder));
 $('#language-value').textContent=prefs.locale==='system'?t('system'):languages.find(l=>l.code===prefs.locale).name;
 $('#notifications').checked=prefs.notifications;
 $('#date-example').textContent=new Intl.DateTimeFormat(locale==='en-XA'?'en':locale,{dateStyle:'long'}).format(new Date());
 $('#date-example').dateTime=new Date().toISOString().slice(0,10);
 $('#number-example').textContent=new Intl.NumberFormat(locale==='en-XA'?'en':locale).format(12345.6);
 $('#plural-example').textContent=[0,1,2,5].map(n=>itemCount(locale,n)).join(' · ');
 $('#pin-example').setAttribute('aria-label',t(pinned?'pinned':'pin'));
 $('#load-sample').textContent=t(loading?'loading':'secondary');
 $('#sample-status').textContent=loading?t('loading'):recovered?t('success'):'';
 $('#app-status').textContent='';
 dirty();renderNotes();searchSettings();
 if(languageDialog.open) renderLanguages();
}
function setPref(property,value){prefs={...prefs,[property]:value};appearance();localize();persist();}
$$('[name=mode]').forEach(e=>e.addEventListener('change',()=>setPref('mode',e.value)));
$$('[name=preset]').forEach(e=>e.addEventListener('change',()=>setPref('preset',e.value)));
mq.addEventListener('change',appearance);
window.addEventListener('languagechange',()=>{if(prefs.locale==='system')localize();});
window.addEventListener('storage',e=>{if(e.key===key){prefs=readPrefs(storage,key);appearance();localize();}});
$('#notifications').addEventListener('change',e=>setPref('notifications',e.target.checked));
const tabs=$$('[role=tab]');
function panel(name,focus=false){tabs.forEach(tab=>{const on=tab.dataset.panel===name;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;$('#panel-'+tab.dataset.panel).hidden=!on;if(on && focus)tab.focus();});}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>panel(tab.dataset.panel));tab.addEventListener('keydown',e=>{
 const horizontal=$('#tabs').getAttribute('aria-orientation')==='horizontal';
 const nextKey=horizontal?(locale==='ar'?'ArrowLeft':'ArrowRight'):'ArrowDown';
 const prevKey=horizontal?(locale==='ar'?'ArrowRight':'ArrowLeft'):'ArrowUp';
 let n;if(e.key===nextKey)n=(index+1)%tabs.length;else if(e.key===prevKey)n=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
 e.preventDefault();panel(tabs[n].dataset.panel,true);
});});
function orientation(){$('#tabs').setAttribute('aria-orientation',matchMedia('(max-width:760px)').matches?'horizontal':'vertical');}
window.addEventListener('resize',orientation);
function searchSettings(){
 const q=$('#settings-search').value.trim().toLocaleLowerCase(locale==='en-XA'?'en':locale);const root=$('#search-results');root.hidden=!q;const list=root.querySelector('ul');list.replaceChildren();if(!q)return;
 const aliases={appearance:['theme','preset','light','dark','reset'],language:['searchLanguage','system'],workspace:['name','notifications'],controls:['buttons','inputLabel','selectLabel','statusTitle'],about:['productVersion','build','license']};
 for(const [group,keys] of Object.entries(aliases)){
  if(![group,...keys].some(k=>(t(k)+' '+k).toLowerCase().includes(q)))continue;
  const li=document.createElement('li'),b=document.createElement('button');b.textContent=t(group);b.onclick=()=>{panel(group);$('#settings-search').value='';searchSettings();$('#panel-'+group).focus();};li.append(b);list.append(li);
 }
 $('#no-settings').hidden=list.children.length>0;
}
$('#settings-search').addEventListener('input',searchSettings);
$('#clear-settings').onclick=()=>{$('#settings-search').value='';searchSettings();$('#settings-search').focus();};
function pickerPosition(){
 if(!languageDialog.open)return;
 const vv=window.visualViewport, h=vv?.height??innerHeight,w=innerWidth;
 languageDialog.style.setProperty('--keyboard-inset',`${Math.max(0,innerHeight-h-(vv?.offsetTop??0))}px`);
 if(w<=520){languageDialog.style.setProperty('--picker-height',`${Math.max(160,h-16)}px`);return;}
 const rect=$('#language-open').getBoundingClientRect();
 const width=Math.min(480,w-32),height=Math.min(480,h-32);
 languageDialog.style.setProperty('--picker-left',`${Math.max(16,Math.min(w-width-16,document.dir==='rtl'?rect.left:rect.right-width))}px`);
 languageDialog.style.setProperty('--picker-top',`${Math.max(16,Math.min(rect.bottom+8,h-height-16))}px`);
 languageDialog.style.setProperty('--picker-height',`${height}px`);
}
function renderLanguages(){
 matches=searchLanguages(languageSearch.value);if(active>=matches.length)active=-1;
 const list=$('#language-list');list.replaceChildren();
 matches.forEach((lang,i)=>{
  const b=document.createElement('button');b.type='button';b.className='language-option';b.id=`language-option-${i}`;b.setAttribute('role','option');b.setAttribute('aria-selected',String(prefs.locale===lang.code));b.tabIndex=-1;b.dataset.active=String(i===active);b.dataset.locale=lang.code;
  const names=document.createElement('span'),label=document.createElement('bdi'),sub=document.createElement('small'),check=document.createElement('span');
  label.textContent=lang.code==='system'?t('system'):lang.name;names.append(label);
  if(lang.code!=='system'){sub.textContent=lang.sort+(lang.code==='ar'?' · '+t('translationPreview'):'');sub.dir='auto';names.append(sub);}
  check.textContent=prefs.locale===lang.code?'✓':'';check.setAttribute('aria-hidden','true');b.append(names,check);b.addEventListener('mousedown',e=>e.preventDefault());b.onclick=()=>chooseLanguage(lang.code);list.append(b);
 });
 languageSearch.removeAttribute('aria-activedescendant');if(active>=0)languageSearch.setAttribute('aria-activedescendant',`language-option-${active}`);
 $('#language-empty').hidden=matches.length>0;
 $('#language-results-status').textContent=`${t('resultCount')}: ${new Intl.NumberFormat(locale==='en-XA'?'en':locale).format(matches.length)}`;
}
function activeOption(i){active=i;$$('.language-option').forEach((e,n)=>e.dataset.active=String(n===i));if(i>=0){const id=`language-option-${i}`,e=document.getElementById(id),list=$('#language-list');languageSearch.setAttribute('aria-activedescendant',id);const r=e.getBoundingClientRect(),parent=list.getBoundingClientRect();if(r.top<parent.top)list.scrollTop-=parent.top-r.top;else if(r.bottom>parent.bottom)list.scrollTop+=r.bottom-parent.bottom;}else languageSearch.removeAttribute('aria-activedescendant');}
function chooseLanguage(code){setPref('locale',code);languageDialog.close();}
$('#language-open').onclick=()=>{languageSearch.value='';active=-1;renderLanguages();languageDialog.showModal();$('#language-open').setAttribute('aria-expanded','true');pickerPosition();languageSearch.focus();};
$('#language-close').onclick=()=>languageDialog.close();
languageDialog.addEventListener('close',()=>{$('#language-open').setAttribute('aria-expanded','false');$('#language-open').focus({preventScroll:true});});
languageDialog.addEventListener('click',e=>{if(e.target===languageDialog){const r=languageDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)languageDialog.close();}});
languageSearch.addEventListener('input',()=>{active=-1;renderLanguages();});
languageSearch.addEventListener('keydown',e=>{
 if(e.isComposing||e.keyCode===229)return;
 if(['ArrowDown','ArrowUp'].includes(e.key)) {e.preventDefault();if(!matches.length)return;const selected=matches.findIndex(l=>l.code===prefs.locale);activeOption(active===-1?(selected>=0?selected:e.key==='ArrowDown'?0:matches.length-1):Math.max(0,Math.min(matches.length-1,active+(e.key==='ArrowDown'?1:-1))));}
 else if(e.ctrlKey&&['Home','End'].includes(e.key)){e.preventDefault();activeOption(matches.length?(e.key==='Home'?0:matches.length-1):-1);}
 else if(e.key==='Enter'&&active>=0){e.preventDefault();chooseLanguage(matches[active].code);}
});
$('#clear-language').onclick=()=>{languageSearch.value='';active=-1;renderLanguages();languageSearch.focus();};
window.addEventListener('resize',pickerPosition);window.visualViewport?.addEventListener('resize',pickerPosition);window.visualViewport?.addEventListener('scroll',pickerPosition);
nameInput.addEventListener('input',()=>{dirty();$('#name-error').hidden=true;nameInput.removeAttribute('aria-invalid');});
$('#workspace-form').addEventListener('submit',e=>{e.preventDefault();const value=nameInput.value.trim();if(!value||[...value].length>60){$('#name-error').hidden=false;nameInput.setAttribute('aria-invalid','true');nameInput.focus();return;}savedName=value;nameInput.value=value;$('#preview-name').textContent=value;dirty();try{storage.setItem(nameKey,value);status(t('saved'));}catch{$('#storage-warning').hidden=false;status(t('sessionOnly'));}});
$('#workspace-cancel').onclick=()=>{nameInput.value=savedName;$('#name-error').hidden=true;nameInput.removeAttribute('aria-invalid');dirty();status(t('cancelled'));};
window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
$('#reset-open').onclick=()=>$('#reset-dialog').showModal();
$('#reset-cancel').onclick=()=>$('#reset-dialog').close();
$('#reset-confirm').onclick=()=>{prefs={...defaults};appearance();localize();const ok=persist();$('#reset-dialog').close();status(t(ok?'preferencesReset':'sessionOnly'));};
$('#reset-dialog').addEventListener('close',()=>$('#reset-open').focus({preventScroll:true}));
function renderNotes(){
 $('#note-count').textContent=itemCount(locale,notes.length);$('#empty-state').hidden=notes.length>0;const list=$('#notes-list');list.replaceChildren();
 notes.forEach(id=>{const li=document.createElement('li'),text=document.createElement('span'),remove=document.createElement('button');text.textContent=`${t('noteCreated')} ${id}`;remove.textContent=t('delete');remove.setAttribute('aria-label',`${t('delete')} ${id}`);remove.onclick=()=>{notes=notes.filter(x=>x!==id);renderNotes();$('#create-note').focus();};li.append(text,remove);list.append(li);});
}
function createNote(){notes.push(nextId++);renderNotes();status(t('noteCreated'));}
$('#create-note').onclick=createNote;$('#preview-create').onclick=()=>{createNote();panel('controls');$('#notes-card').scrollIntoView({block:'nearest'});$('#create-note').focus({preventScroll:true});};
$('#pin-example').onclick=()=>{pinned=!pinned;$('#pin-example').setAttribute('aria-pressed',String(pinned));$('#pin-example').setAttribute('aria-label',t(pinned?'pinned':'pin'));};
$('#view-select').addEventListener('change',e=>$('#notes-list').dataset.view=e.target.value);
$('#example-email').addEventListener('input',e=>{const invalid=!e.target.validity.valid||!e.target.value; e.target.setAttribute('aria-invalid',String(invalid));$('#email-error').hidden=!invalid;});
async function loadSample(){if(loading)return;loading=true;$('#load-sample').disabled=true;$('#retry-sample').disabled=true;$('#load-sample').textContent=t('loading');$('#sample-status').setAttribute('aria-busy','true');$('#sample-status').textContent=t('loading');await new Promise(resolve=>setTimeout(resolve,700));loading=false;recovered=true;$('#error-example').hidden=true;$('#sample-status').setAttribute('aria-busy','false');$('#sample-status').className='notice success';$('#sample-status').textContent=t('success');$('#load-sample').disabled=false;$('#retry-sample').disabled=false;$('#load-sample').textContent=t('secondary');}
$('#load-sample').onclick=loadSample;$('#retry-sample').onclick=()=>{loadSample();$('#load-sample').focus();};
$('#kit-version').textContent=kit.version;$('#design-version').textContent=kit.version;$('#build-id').textContent=kit.commit;
$('#product-version').textContent=product.version;$('#version-detail').textContent=product.version;$('#product-channel').textContent=product.channel;$('#preview-name').textContent=savedName;
appearance();localize();orientation();
try{storage.setItem('stillroom.reference.probe','1');storage.removeItem('stillroom.reference.probe');}catch{$('#storage-warning').hidden=false;}
document.documentElement.dataset.ready='true';
