// Run in the mounted browser: await (await import('./checks/browser-check.mjs')).run()
// DOM-driven integration checks, not a replacement for trusted keyboard/device tests.
export async function run({widths=[1280,390,320],locales=['en','zh-Hans','en-XA','ar']}={}) {
 const results=[],layout=[];
 const settle=()=>new Promise(resolve=>setTimeout(resolve,50));
 const check=(name,condition,detail)=>{results.push({name,pass:!!condition,...(detail?{detail}:{})});if(!condition)throw new Error(name+': '+JSON.stringify(detail));};
 const frame=document.createElement('iframe');frame.title='Responsive verification frame';frame.style.cssText='position:fixed;inset:0;width:390px;height:844px;z-index:99999;border:0;background:white';
 document.body.append(frame);
 const key='stillroom.reference.preferences.v1',saved=localStorage.getItem(key);
 const nameKey='stillroom.reference.workspace.v1',savedName=localStorage.getItem(nameKey);
 const loaded=()=>new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{clearInterval(timer);reject(new Error('Frame initialization timeout'));},10000); let navigated=false; const timer=setInterval(()=>{if(navigated && frame.contentDocument?.documentElement.dataset.ready==='true'){clearInterval(timer);clearTimeout(timeout);resolve();}},25); frame.onload=()=>{navigated=true;};frame.src='./?verification='+Math.random();});
 try {
  localStorage.setItem(key,JSON.stringify({mode:'light',preset:'lyt',locale:'en',notifications:true}));await loaded();
  let d=frame.contentDocument,w=frame.contentWindow;const $=s=>d.querySelector(s);
  const change=(e,value)=>{e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));e.dispatchEvent(new w.Event('change',{bubbles:true}));};
  const selectLocale=async code=>{$('#tab-language').click();$('#language-open').click();$(`[data-locale="${code}"]`).click();await settle();};
  check('reference initializes in separate browsing context',d.documentElement.dataset.ready==='true');
  $('#tab-workspace').click();change($('#workspace-name'),'Draft 123 · 草稿');
  $('#tab-appearance').click();$('[name=mode][value=dark]').click();$('[name=preset][value=sage]').click();await selectLocale('ar');
  check('theme and locale retain unsaved draft',$('#workspace-name').value==='Draft 123 · 草稿');
  check('language commit restores opener focus',d.activeElement.id==='language-open');
  check('Arabic sets document direction',d.documentElement.dir==='rtl');
  $('#language-open').click();change($('#language-search'),'not-a-language');check('empty search has recovery',$('#language-empty').hidden===false&&$('#language-list').children.length===0);$('#clear-language').click();
  check('clear search restores all choices',$('#language-list').children.length===5);
  change($('#language-search'),'English');$('#language-search').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
  $('#language-search').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true}));check('IME Enter does not commit language',$('#language-dialog').open);
  $('#language-close').click();await settle();
  $('#tab-appearance').click();const vars=()=>{const s=w.getComputedStyle(d.documentElement);return Object.fromEntries(['--error','--success','--warning','--brand','--data-a','--data-b','--data-c'].map(k=>[k,s.getPropertyValue(k)]));};const before=vars();$('[name=preset][value=lyt]').click();check('rendered palette preserves status/data/brand',JSON.stringify(before)===JSON.stringify(vars()));
  $('#reset-open').click();$('#reset-cancel').click();await settle();check('reset Cancel returns focus and retains mode',d.activeElement.id==='reset-open'&&d.documentElement.dataset.theme==='dark');
  $('#reset-open').click();$('#reset-confirm').click();await settle();check('reset retains workspace draft',$('#workspace-name').value==='Draft 123 · 草稿');
  $('#tab-workspace').click();change($('#workspace-name'),' ');$('#workspace-form').requestSubmit();check('invalid name keeps input and focuses field',$('#workspace-name').value===' '&&d.activeElement.id==='workspace-name'&&$('#workspace-name').getAttribute('aria-invalid')==='true');
  change($('#workspace-name'),'Verified workspace');$('#workspace-form').requestSubmit();check('valid save updates preview',$('#preview-name').textContent==='Verified workspace');
  $('#tab-controls').click();$('#create-note').click();$('#view-select').value='grid';$('#view-select').dispatchEvent(new w.Event('change',{bubbles:true}));await selectLocale('zh-Hans');$('#tab-controls').click();check('locale retains created note and view selection',$('#notes-list').children.length===1&&$('#view-select').value==='grid');
  $('#retry-sample').click();check('retry exposes busy state',$('#sample-status').getAttribute('aria-busy')==='true');await new Promise(r=>setTimeout(r,800));check('retry completes locally',$('#error-example').hidden&&$('#sample-status').getAttribute('aria-busy')==='false');
  $('#tab-appearance').click();$('[name=mode][value=dark]').click();$('[name=preset][value=sage]').click();
  await loaded();d=frame.contentDocument;w=frame.contentWindow;
  check('reload retains theme, locale and saved workspace',d.documentElement.dataset.theme==='dark'&&d.documentElement.dataset.preset==='sage'&&d.documentElement.lang==='zh-Hans'&&$('#workspace-name').value==='Verified workspace');
  for(const width of widths){
   frame.style.width=width+'px';await new Promise(r=>setTimeout(r,80));
   for(const locale of locales){
    await selectLocale(locale);
    for(const mode of ['light','dark']){
     $('#tab-appearance').click();$(`[name=mode][value=${mode}]`).click();
     for(const preset of ['lyt','sage']){
      $(`[name=preset][value=${preset}]`).click();
      for(const panel of ['appearance','language','workspace','controls','about']){
       $('#tab-'+panel).click();w.scrollTo(0,0);
       const actual=w.innerWidth,overflow=d.documentElement.scrollWidth>actual+1;
       const outside=[...d.querySelectorAll('main button,main input,main select,[role=tab]')].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.left< -1||r.right>actual+1;}).map(e=>e.id||e.name);
       const row={width,locale,mode,preset,panel,pass:!overflow&&!outside.length};layout.push(row);if(!row.pass)throw new Error('layout: '+JSON.stringify({...row,scrollWidth:d.documentElement.scrollWidth,outside}));
      }
      $('#tab-language').click();$('#language-open').click();const rect=$('#language-dialog').getBoundingClientRect();check(`selector contained ${width}/${locale}/${mode}/${preset}`,rect.left>=-1&&rect.right<=w.innerWidth+1&&rect.top>=-1&&rect.bottom<=w.innerHeight+1,{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom});$('#language-close').click();await settle();
     }
    }
   }
  }
  check('requested panel layouts fit viewport',layout.length===widths.length*locales.length*20&&layout.every(r=>r.pass));
  frame.style.width='390px';d.documentElement.style.fontSize='200%';await selectLocale('en-XA');$('#tab-controls').click();check('200% text resize at 390 px has no document overflow',d.documentElement.scrollWidth<=w.innerWidth+1,{width:w.innerWidth,scrollWidth:d.documentElement.scrollWidth,outside:[...d.querySelectorAll('main *')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().right>w.innerWidth+1).map(e=>e.id||e.tagName)});d.documentElement.style.fontSize='';
  return {timestamp:new Date().toISOString(),browser:navigator.userAgent,method:'DOM-driven checks in actual same-origin browser iframe; no native-device or trusted-keyboard claim',checks:results,layouts:layout};
 } catch(error){return {timestamp:new Date().toISOString(),checks:results,layouts:layout,error:error.message};}
 finally{frame.remove();if(saved===null)localStorage.removeItem(key);else localStorage.setItem(key,saved);if(savedName===null)localStorage.removeItem(nameKey);else localStorage.setItem(nameKey,savedName);}
}
