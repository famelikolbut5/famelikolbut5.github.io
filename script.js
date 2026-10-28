let panelInvoker=null, panelScroll=0;
function showPanel(panel){panelInvoker=document.activeElement;panelScroll=window.scrollY;window.scrollTo({top:0,behavior:'instant'});panel.hidden=false;document.querySelector('.wrap').inert=true;document.body.style.overflow='hidden';panel.querySelector('.close').focus({preventScroll:true})}
function hidePanel(panel){const video=panel.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}panel.hidden=true;document.querySelector('.wrap').inert=false;document.body.style.overflow='';window.scrollTo({top:panelScroll,behavior:'instant'});panelInvoker?.focus({preventScroll:true})}
document.addEventListener('keydown',e=>{const panel=document.querySelector('[role="dialog"]:not([hidden])');if(!panel)return;if(e.key==='Escape'){hidePanel(panel);e.preventDefault()}if(e.key==='Tab'){const controls=[...panel.querySelectorAll('button,a[href],video[controls]:not([hidden])')].filter(el=>el.getClientRects().length);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}});
const works=[{"key": "echo-studio", "title": "Echo Studio", "category": "Аудио и расшифровка", "desc": "Расшифровка аудио, навигация по репликам и проверка текста по чек-листу.", "stack": "Python / React / faster-whisper"}, {"key": "supply", "title": "Supply", "category": "Каталог и подбор", "desc": "Каталог мебели с AI-помощником для подбора товаров и расчётом предложения.", "stack": "Python / React / Codex CLI"}, {"key": "threadflow", "title": "Threadflow", "category": "Автоматизация", "desc": "Обработка заявок по заданному сценарию, история выполнения и повтор шага после ошибки.", "stack": "Python / React Flow / SQLite"}, {"key": "framecraft", "title": "Framecraft", "category": "Видео и интерфейсы", "desc": "Редактор коротких видео: выбор фрагмента, добавление титров и экспорт вертикального ролика.", "stack": "Python / React / FFmpeg"}, {"key": "roam-crm", "title": "Roam CRM", "category": "CRM и мобильный интерфейс", "desc": "CRM туристической команды: заявки и бронирования, карточки клиентов и мобильный маршрут гида с отметками участников.", "stack": "React / Node.js / PostgreSQL"}, {"key": "docledger", "title": "Docledger", "category": "Документы и процессы", "desc": "Реестр договоров, счетов и актов: поиск, согласование, история изменений, архив и выгрузка в CSV.", "stack": "React / Node.js / PostgreSQL"}];
works.push({key:'garden',title:'Garden',category:'Интерактивное демо',desc:'Сказочная оранжерея с живым фоном и котом, который реагирует на движение курсора и нажатия. Запись самостоятельного интерактивного демо.',stack:'JavaScript / WebGL / Анимация',image:'assets/garden.jpg',video:'assets/garden-demo.mp4?v=a203cabcdc26'});

works.unshift(
 {key:'unique-travel',title:'Unique Travel',category:'Приложения для iOS и Android',desc:'Два приложения для туристов и гидов, связанные с CRM.',stack:'React / TypeScript / Capacitor',private:true,phones:true},
 {key:'smile-vityk',title:'SMILE VITYK',category:'Сайт зубного техника',desc:'Сайт зуботехнической лаборатории Ильи Витыка. Галерея работ, 3D-просмотр конструкции и бланк заказа PDF.',stack:'HTML / CSS / JavaScript',image:'assets/smile-vityk.webp',site:'https://smilevityk.by/',private:true},
 {key:'agency-crm',title:'CRM агентства и Бип',category:'Приложение с анимированным помощником',desc:'Анимированный помощник Бип помогает освоить интерфейс, подсказывает действия и показывает нужные разделы.',stack:'React / Node.js / SQLite',image:'assets/agency-crm-motion.webp',private:true,mascot:true}
);

const dialog=document.querySelector('.viewer');
const viewerPhoneVectors=new Map();
function renderViewerPhoneVectors(root){
 root.querySelectorAll('img.device-mockup').forEach((image,index)=>{
  const source=image.src;
  if(!viewerPhoneVectors.has(source))viewerPhoneVectors.set(source,fetch(source).then(response=>{if(!response.ok)throw new Error('Phone preview unavailable');return response.text();}));
  viewerPhoneVectors.get(source).then(text=>{
   if(!image.isConnected)return;
   const prefix='viewer-phone-'+index+'-';
   text=text.replace(/id="([^"]+)"/g,(_,id)=>'id="'+prefix+id+'"').replace(/url\(#([^)]+)\)/g,(_,id)=>'url(#'+prefix+id+')');
   const svg=new DOMParser().parseFromString(text,'image/svg+xml').documentElement;
   if(svg.localName!=='svg')return;
   svg.setAttribute('class','device-mockup');svg.setAttribute('role','img');svg.setAttribute('aria-label',image.alt);
   image.replaceWith(document.importNode(svg,true));
  }).catch(()=>{/* The original SVG image remains available as a fallback. */});
 });
}
function openWork(key,animateMascot=true){
 const p=works.find(p=>p.key===key);if(!p)return;
 const hasMascot=!!p.mascot&&animateMascot;
 const image=dialog.querySelector('img'),video=dialog.querySelector('video');
 dialog.querySelector('h2').textContent=p.title;
 image.hidden=!!p.video||!!p.phones;video.hidden=!p.video;
 dialog.querySelector('.viewer-info p').textContent=p.desc;
 const link=dialog.querySelector('.viewer-info>a');
 link.hidden=!!p.private&&!p.site;
 link.href=p.site||(!p.private?'https://github.com/famelikolbut5/'+key:'#');
 link.textContent=p.site?'Открыть сайт':'Посмотреть код';
 dialog.classList.toggle('viewer-crm',hasMascot);
 dialog.classList.toggle('viewer-mobile',!!p.phones);
 let phones=dialog.querySelector('.viewer-phones');
 if(p.phones&&!phones){phones=document.createElement('div');phones.className='viewer-phones';phones.innerHTML=document.querySelector('[data-work="unique-travel"] .app-devices').outerHTML;dialog.querySelector('.viewer-media').append(phones);phones.querySelectorAll('.bird-preview').forEach(observeMascot);}
 if(phones)phones.hidden=!p.phones;
 if(p.phones)renderViewerPhoneVectors(phones);
 let mascot=dialog.querySelector('.viewer-bip');
 if(hasMascot&&!mascot){mascot=document.createElement('img');mascot.className='viewer-bip bip-preview';mascot.alt='';mascot.width=1280;mascot.height=720;mascot.dataset.animation='assets/bip-preview.webp?v=f96472ee8164';mascot.src='assets/bip-still.webp?v=73e628c5a980';dialog.querySelector('.viewer-media').append(mascot);observeMascot(mascot);}
 if(mascot)mascot.hidden=!hasMascot;
 if(p.video){
  video.poster=p.image;video.src=p.video;video.muted=false;video.volume=1;
 }else if(!p.phones){image.src=p.mascot&&!hasMascot?'assets/agency-crm.webp?v=bda868b1c8a6':p.image||'assets/'+key+'.webp';image.alt=p.title+' | интерфейс проекта';}
 showPanel(dialog);
 if(p.phones)dialog.scrollTop=0;
 if(p.video)video.play().catch(()=>{/* Native controls remain available if playback is blocked. */});
}

document.querySelectorAll('[data-work]').forEach(b=>b.addEventListener('click',()=>openWork(b.dataset.work,b.dataset.static!=='true')));
dialog.querySelector('.close').addEventListener('click',()=>hidePanel(dialog));dialog.addEventListener('click',e=>{if(e.target===dialog)hidePanel(dialog)});
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.screen;document.querySelector('.selected-screen').src='assets/'+key+'.webp';document.querySelector('.selected-screen').alt=works.find(p=>p.key===key).title+' - интерфейс проекта';document.querySelector('.hero-stage [data-work]').dataset.work=key;document.querySelectorAll('[data-screen]').forEach(t=>t.setAttribute('aria-selected',String(t===b)))}));

const certDialog=document.querySelector('.cert-viewer');
document.querySelectorAll('[data-cert]').forEach(b=>b.addEventListener('click',()=>{certDialog.querySelector('h2').textContent=b.dataset.title;certDialog.querySelector('img').src='assets/'+b.dataset.cert;certDialog.querySelector('img').alt=b.dataset.title+' - сертификат';showPanel(certDialog)}));
certDialog.querySelector('.close').addEventListener('click',()=>hidePanel(certDialog));
certDialog.addEventListener('click',e=>{if(e.target===certDialog)hidePanel(certDialog)});
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const tabs=[...document.querySelectorAll('[data-screen]')];const next=tabs[(tabs.indexOf(b)+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.focus();next.click();e.preventDefault()}}));
const motionEnabled=()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{if(motionEnabled())document.querySelector('.selected-screen').animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'})}));
document.querySelectorAll('[data-work],[data-cert]').forEach(b=>b.addEventListener('click',()=>{if(motionEnabled())(b.hasAttribute('data-cert')?certDialog:dialog).animate([{opacity:.65},{opacity:1}],{duration:220,easing:'ease-out'})}));

// Decode the artwork before the original entrance; never restart it during scrolling.
async function enterMobileArtwork(){
  const root=document.documentElement;
  const stage=document.querySelector('.atelier .hero-stage');
  if(!stage)return;
  if(window.matchMedia('(max-width:900px)').matches&&motionEnabled())root.classList.add('mobile-intro-pending');
  const initialScroll=window.scrollY;
  const images=[...stage.querySelectorAll('img')];
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
