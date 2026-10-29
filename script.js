let panelInvoker=null, panelRequest=0, panelScroll=0;
const panelImages=new Map();
const viewerIdle=()=>new Promise(resolve=>{if('requestIdleCallback' in window)requestIdleCallback(resolve,{timeout:1500});else setTimeout(resolve,50);});
const panelImageCache=document.createElement('div');panelImageCache.hidden=true;panelImageCache.className='viewer-preload-cache';panelImageCache.setAttribute('aria-hidden','true');document.body.append(panelImageCache);
function preparePanelImage(src){
 if(!panelImages.has(src)){
  const image=new Image();image.decoding='async';image.fetchPriority='low';image.src=src;panelImageCache.append(image);
  panelImages.set(src,image.decode().then(()=>image).catch(error=>{panelImages.delete(src);throw error;}));
 }
 return panelImages.get(src);
}
function fitPanel(panel){
 const ratio=Number(panel.dataset.mediaRatio)||16/9;
 const maxWidth=Math.min(panel.classList.contains('cert-viewer')?1050:1200,innerWidth*.94);
 const maxHeight=innerHeight*.9;
 let width=maxWidth;
 for(let i=0;i<6;i++){
  panel.style.width=width+'px';
  const chrome=panel.querySelector('header').getBoundingClientRect().height+(panel.querySelector('.viewer-info')?.getBoundingClientRect().height||0)+2;
  const next=Math.min(maxWidth,Math.max(1,maxHeight-chrome)*ratio);
  if(Math.abs(next-width)<.5)break;
  width=Math.min(width,next);
 }
 panel.style.width=width+'px';
 panel.style.setProperty('--viewer-media-height',(Math.max(1,(width-2)/ratio))+'px');
}
function showPanel(panel){
 const previous=document.querySelector('[role="dialog"]:not([hidden])');
 if(previous&&previous!==panel)previous.hidden=true;
 panelInvoker=document.activeElement;panelScroll=window.scrollY;
 panel.style.visibility='hidden';panel.hidden=false;fitPanel(panel);panel.scrollTop=0;
 document.querySelector('.wrap').inert=true;document.body.classList.add('panel-open');
 document.body.style.top=-panelScroll+'px';document.body.style.position='fixed';document.body.style.width='100%';document.body.style.overflow='hidden';
 panel.style.visibility='';panel.querySelector('.close').focus({preventScroll:true});
}
function hidePanel(panel){++panelRequest;const video=panel.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}document.body.style.position='';document.body.style.top='';document.body.style.width='';document.body.style.overflow='';window.scrollTo({top:panelScroll,behavior:'instant'});panel.hidden=true;document.querySelector('.wrap').inert=false;document.body.classList.remove('panel-open');panelInvoker?.focus({preventScroll:true})}
window.addEventListener('resize',()=>{const panel=document.querySelector('[role="dialog"]:not([hidden])');if(panel)fitPanel(panel);});
document.addEventListener('keydown',e=>{const panel=document.querySelector('[role="dialog"]:not([hidden])');if(!panel)return;if(e.key==='Escape'){hidePanel(panel);e.preventDefault()}if(e.key==='Tab'){const controls=[...panel.querySelectorAll('button,a[href],video[controls]:not([hidden])')].filter(el=>el.getClientRects().length);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}});
const works=[{"key": "echo-studio", "title": "Echo Studio", "category": "Аудио и расшифровка", "desc": "Расшифровка аудио, навигация по репликам и проверка текста по чек-листу.", "stack": "Python / React / faster-whisper"}, {"key": "supply", "title": "Supply", "category": "Каталог и подбор", "desc": "Каталог мебели с AI-помощником для подбора товаров и расчётом предложения.", "stack": "Python / React / Codex CLI"}, {"key": "threadflow", "title": "Threadflow", "category": "Автоматизация", "desc": "Обработка заявок по заданному сценарию, история выполнения и повтор шага после ошибки.", "stack": "Python / React Flow / SQLite"}, {"key": "framecraft", "title": "Framecraft", "category": "Видео и интерфейсы", "desc": "Редактор коротких видео: выбор фрагмента, добавление титров и экспорт вертикального ролика.", "stack": "Python / React / FFmpeg"}, {"key": "roam-crm", "title": "Roam CRM", "category": "CRM и мобильный интерфейс", "desc": "CRM туристической команды: заявки и бронирования, карточки клиентов и мобильный маршрут гида с отметками участников.", "stack": "React / Node.js / PostgreSQL"}, {"key": "docledger", "title": "Docledger", "category": "Документы и процессы", "desc": "Реестр договоров, счетов и актов: поиск, согласование, история изменений, архив и выгрузка в CSV.", "stack": "React / Node.js / PostgreSQL"}];
works.push({key:'garden',title:'Garden',category:'Интерактивное демо',desc:'Сказочная оранжерея с живым фоном и котом, который реагирует на движение курсора и нажатия. Запись интерактивного демо.',stack:'JavaScript / WebGL / Анимация',image:'assets/garden.jpg',video:'assets/garden-demo.mp4?v=a203cabcdc26'});

works.unshift(
 {key:'unique-travel',title:'Unique Travel',category:'Приложения для iOS и Android',desc:'Два приложения для туристов и гидов, связанные с CRM.',stack:'React / TypeScript / Capacitor',private:true,phones:true},
 {key:'smile-vityk',title:'SMILE VITYK',category:'Сайт зубного техника',desc:'Сайт зуботехнической лаборатории с галереей работ, 3D-просмотром и бланком заказа в PDF. Настроены страницы услуг, метатеги и микроразметка.',stack:'HTML / CSS / JavaScript',image:'assets/smile-vityk.webp',site:'https://smilevityk.by/',private:true},
 {key:'agency-crm',title:'CRM агентства и Бип',staticTitle:'CRM агентства',category:'Приложение с анимированным помощником',desc:'Анимированный помощник Бип помогает освоить интерфейс, подсказывает действия и показывает нужные разделы.',staticDesc:'Заявки и клиенты в одной системе: канбан по этапам, история общения, заметки и планирование следующего контакта.',stack:'React / Node.js / SQLite',image:'assets/agency-crm-motion.webp',private:true,mascot:true}
);

const dialog=document.querySelector('.viewer');
const viewerPhoneVectors=new Map();
let viewerPhonesPreparation=null;
function projectImageSource(project,animateMascot=true){return project.mascot&&!animateMascot?'assets/agency-crm.webp?v=bda868b1c8a6':project.image||'assets/'+project.key+'.webp?v=framed20261029b';}
function usePreparedImage(panel,prepared){
 const previous=panel.querySelector('.viewer-media>img:not(.viewer-bip)')||panel.querySelector(':scope>img');
 if(previous!==prepared){previous.replaceWith(prepared);panelImageCache.append(previous);}
 return prepared;
}
function prepareViewerPhones(){
 if(viewerPhonesPreparation)return viewerPhonesPreparation;
 let phones=dialog.querySelector('.viewer-phones');
 if(!phones){phones=document.createElement('div');phones.className='viewer-phones';phones.hidden=true;phones.innerHTML=document.querySelector('[data-work="unique-travel"] .app-devices').outerHTML;dialog.querySelector('.viewer-media').append(phones);phones.querySelectorAll('.bird-preview').forEach(observeMascot);}
 viewerPhonesPreparation=renderViewerPhoneVectors(phones).then(()=>{phones.dataset.ready='true';return phones;}).catch(error=>{viewerPhonesPreparation=null;throw error;});
 return viewerPhonesPreparation;
}
async function renderViewerPhoneVectors(root){
 for(const [index,image] of [...root.querySelectorAll('img.device-mockup')].entries()){
  await viewerIdle();
  const source=image.dataset.src||image.src;
  if(!viewerPhoneVectors.has(source))viewerPhoneVectors.set(source,fetch(source).then(response=>{if(!response.ok)throw new Error('Phone preview unavailable');return response.text();}));
  await Promise.all([viewerPhoneVectors.get(source),preparePanelImage(source)]).then(([text])=>{
   if(!image.isConnected)return;
   const prefix='viewer-phone-'+index+'-';
   text=text.replace(/id="([^"]+)"/g,(_,id)=>'id="'+prefix+id+'"').replace(/url\(#([^)]+)\)/g,(_,id)=>'url(#'+prefix+id+')');
   const svg=new DOMParser().parseFromString(text,'image/svg+xml').documentElement;
   if(svg.localName!=='svg')return;
   svg.setAttribute('class','device-mockup');svg.setAttribute('role','img');svg.setAttribute('aria-label',image.alt);
   image.replaceWith(document.importNode(svg,true));
  });
 }
}
async function openWork(key,animateMascot=true){
 const started=performance.now();
 const p=works.find(p=>p.key===key);if(!p)return;
 const request=++panelRequest;
 const source=projectImageSource(p,animateMascot);
 let prepared;
 try{prepared=await preparePanelImage(p.phones?'assets/unique-travel-background.webp':source);}catch(error){console.error('Project preview could not load',error);return;}
 if(request!==panelRequest)return;
 const hasMascot=!!p.mascot&&animateMascot;
 let image=dialog.querySelector('.viewer-media>img:not(.viewer-bip)');const video=dialog.querySelector('video');
 dialog.querySelector('h2').textContent=animateMascot?p.title:p.staticTitle||p.title;
 image.hidden=!!p.video||!!p.phones;video.hidden=!p.video;
 dialog.querySelector('.viewer-info p').textContent=animateMascot?p.desc:p.staticDesc||p.desc;
 const link=dialog.querySelector('.viewer-info>a');
 link.hidden=!!p.private&&!p.site;
 link.href=p.site||(!p.private?'https://github.com/famelikolbut5/'+key:'#');
 link.textContent=p.site?'Открыть сайт':'Посмотреть код';
 dialog.classList.toggle('viewer-crm',hasMascot);
 dialog.classList.toggle('viewer-mobile',!!p.phones);
 let phones=dialog.querySelector('.viewer-phones');
 if(p.phones){phones=await prepareViewerPhones();if(request!==panelRequest)return;}
 if(phones)phones.hidden=!p.phones;
 let mascot=dialog.querySelector('.viewer-bip');
 if(hasMascot&&!mascot){mascot=document.createElement('img');mascot.className='viewer-bip bip-preview';mascot.alt='';mascot.width=1280;mascot.height=720;mascot.fetchPriority='low';mascot.dataset.animation='assets/bip-preview.webp?v=f96472ee8164';mascot.src='assets/bip-still.webp?v=73e628c5a980';const frame=document.createElement('span');frame.className='bip-frame viewer-bip-frame';frame.append(mascot);dialog.querySelector('.viewer-media').append(frame);observeMascot(mascot);}
 if(mascot){mascot.hidden=!hasMascot;mascot.parentElement.hidden=!hasMascot;}
 if(p.video){
  video.poster=p.image;video.src=p.video;video.muted=false;video.volume=1;
 }else if(!p.phones){image=usePreparedImage(dialog,prepared);image.hidden=false;image.alt=dialog.querySelector('h2').textContent+' | интерфейс проекта';}
 dialog.dataset.mediaRatio=p.phones?1.6:p.video?16/9:prepared.naturalWidth/prepared.naturalHeight;
 showPanel(dialog);
 dialog.dataset.openMs=(performance.now()-started).toFixed(1);
 if(p.phones)dialog.scrollTop=0;
 if(p.video)video.play().catch(()=>{/* Native controls remain available if playback is blocked. */});
}

document.querySelectorAll('[data-work]').forEach(b=>b.addEventListener('click',()=>openWork(b.dataset.work,b.dataset.static!=='true')));
dialog.querySelector('.close').addEventListener('click',()=>hidePanel(dialog));dialog.addEventListener('click',e=>{if(e.target===dialog)hidePanel(dialog)});
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.screen;document.querySelector('.selected-screen').src='assets/'+key+'.webp';document.querySelector('.selected-screen').alt=works.find(p=>p.key===key).title+' - интерфейс проекта';document.querySelector('.hero-stage [data-work]').dataset.work=key;document.querySelectorAll('[data-screen]').forEach(t=>t.setAttribute('aria-selected',String(t===b)))}));

const certDialog=document.querySelector('.cert-viewer');
document.querySelectorAll('[data-cert]').forEach(b=>b.addEventListener('click',async()=>{
 const started=performance.now();
 const request=++panelRequest,src='assets/'+b.dataset.cert;
 try{
  const prepared=await preparePanelImage(src);if(request!==panelRequest)return;
  certDialog.querySelector('h2').textContent=b.dataset.title;
  const image=usePreparedImage(certDialog,prepared);image.hidden=false;image.alt=b.dataset.title+' - сертификат';
  certDialog.dataset.mediaRatio=prepared.naturalWidth/prepared.naturalHeight;showPanel(certDialog);
  certDialog.dataset.openMs=(performance.now()-started).toFixed(1);
 }catch(error){console.error('Certificate preview could not load',error);}
}));
certDialog.querySelector('.close').addEventListener('click',()=>hidePanel(certDialog));
certDialog.addEventListener('click',e=>{if(e.target===certDialog)hidePanel(certDialog)});
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const tabs=[...document.querySelectorAll('[data-screen]')];const next=tabs[(tabs.indexOf(b)+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.focus();next.click();e.preventDefault()}}));
const motionEnabled=()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{if(motionEnabled())document.querySelector('.selected-screen').animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'})}));

// Decode the artwork before the original entrance; never restart it during scrolling.
async function enterMobileArtwork(){
  const root=document.documentElement;
  const stage=document.querySelector('.atelier .hero-stage');
  if(!stage)return;
  if(window.matchMedia('(max-width:900px)').matches&&motionEnabled())root.classList.add('mobile-intro-pending');
  const initialScroll=window.scrollY;
  const images=[...stage.querySelectorAll('img:not(.bip-preview)')];
  await Promise.all(images.map(img=>img.decode().catch(()=>{})));
  const bounds=stage.getBoundingClientRect();
  const canAnimate=root.classList.contains('mobile-intro-pending')&&images.every(img=>img.naturalWidth>0)&&Math.abs(window.scrollY-initialScroll)<24&&bounds.top<window.innerHeight&&bounds.bottom>0&&document.visibilityState==='visible'&&motionEnabled()&&window.matchMedia('(max-width:900px)').matches;
  root.classList.remove('mobile-intro-pending');
  if(!canAnimate)return;
  root.classList.add('mobile-intro-ready');
  // Keep the final animation state, as on desktop, without switching render layers.
}
enterMobileArtwork();

// Animate original Bip artwork only while visible; respect reduced motion.
const mascotMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const mascotObserver=new IntersectionObserver(entries=>{for(const entry of entries){const el=entry.target;el.src=entry.isIntersecting&&!mascotMotion.matches?el.dataset.animation:(el.dataset.still||'assets/bip-still.webp?v=73e628c5a980');}},{threshold:.1});
function observeMascot(el){mascotObserver.observe(el);}
document.querySelectorAll('.bip-preview,.bird-preview').forEach(observeMascot);
mascotMotion.addEventListener('change',()=>document.querySelectorAll('.bip-preview,.bird-preview').forEach(el=>{el.src=el.dataset.still||'assets/bip-still.webp?v=73e628c5a980';mascotObserver.unobserve(el);mascotObserver.observe(el);}));

// Keep full-quality gallery media out of the first-screen request queue.
const deferredMedia=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const el=entry.target;if(el.dataset.srcset){el.srcset=el.dataset.srcset;delete el.dataset.srcset;}if(el.dataset.src){el.src=el.dataset.src;delete el.dataset.src;}if(el.hasAttribute('data-lazy-background'))el.classList.add('media-ready');deferredMedia.unobserve(el);}},{rootMargin:'600px 0px'});
document.querySelectorAll('img[data-src],[data-lazy-background]').forEach(el=>deferredMedia.observe(el));

// Prepare gallery assets after the first screen, before a visitor opens a preview.
async function warmViewerMedia(){
 let readyProjects=0;
 for(const project of works){
  if(project.phones)continue;
  await viewerIdle();
  await preparePanelImage(projectImageSource(project)).then(()=>{panelImageCache.dataset.readyProjects=String(++readyProjects);}).catch(()=>{});
  if(project.mascot){await viewerIdle();await preparePanelImage(projectImageSource(project,false)).catch(()=>{});}
 }
 await viewerIdle();await preparePanelImage('assets/unique-travel-background.webp').catch(()=>{});
 await prepareViewerPhones().then(()=>{panelImageCache.dataset.readyPhones='2';}).catch(()=>{});
 for(const button of document.querySelectorAll('[data-cert]')){
  await viewerIdle();await preparePanelImage('assets/'+button.dataset.cert).catch(()=>{});
 }
 panelImageCache.dataset.warmupComplete='true';
}
function scheduleViewerWarmup(){setTimeout(()=>{if('requestIdleCallback' in window)requestIdleCallback(warmViewerMedia,{timeout:1500});else warmViewerMedia();},2400);}
if(document.readyState==='complete')scheduleViewerWarmup();else window.addEventListener('load',scheduleViewerWarmup,{once:true});
