let panelInvoker=null, panelScroll=0;
function showPanel(panel){panelInvoker=document.activeElement;panelScroll=window.scrollY;window.scrollTo({top:0,behavior:'instant'});panel.hidden=false;document.querySelector('.wrap').inert=true;document.body.style.overflow='hidden';panel.querySelector('.close').focus({preventScroll:true})}
function hidePanel(panel){const video=panel.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}panel.hidden=true;document.querySelector('.wrap').inert=false;document.body.style.overflow='';window.scrollTo({top:panelScroll,behavior:'instant'});panelInvoker?.focus({preventScroll:true})}
document.addEventListener('keydown',e=>{const panel=document.querySelector('[role="dialog"]:not([hidden])');if(!panel)return;if(e.key==='Escape'){hidePanel(panel);e.preventDefault()}if(e.key==='Tab'){const controls=[...panel.querySelectorAll('button,a[href],video[controls]:not([hidden])')].filter(el=>el.getClientRects().length);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}});
const works=[{"key": "echo-studio", "title": "Echo Studio", "category": "Аудио и расшифровка", "desc": "Расшифровка аудио, навигация по репликам и проверка текста по чек-листу.", "stack": "Python / React / faster-whisper"}, {"key": "supply", "title": "Supply", "category": "Каталог и подбор", "desc": "Каталог мебели с AI-помощником для подбора товаров и расчётом предложения.", "stack": "Python / React / Codex CLI"}, {"key": "threadflow", "title": "Threadflow", "category": "Автоматизация", "desc": "Обработка заявок по заданному сценарию, история выполнения и повтор шага после ошибки.", "stack": "Python / React Flow / SQLite"}, {"key": "framecraft", "title": "Framecraft", "category": "Видео и интерфейсы", "desc": "Редактор коротких видео: выбор фрагмента, добавление титров и экспорт вертикального ролика.", "stack": "Python / React / FFmpeg"}, {"key": "roam-crm", "title": "Roam CRM", "category": "CRM и мобильный интерфейс", "desc": "CRM туристической команды: заявки и бронирования, карточки клиентов и мобильный маршрут гида с отметками участников.", "stack": "React / Node.js / PostgreSQL"}, {"key": "docledger", "title": "Docledger", "category": "Документы и процессы", "desc": "Реестр договоров, счетов и актов: поиск, согласование, история изменений, архив и выгрузка в CSV.", "stack": "React / Node.js / PostgreSQL"}];
works.push({key:'garden',title:'Garden',category:'Интерактивное демо',desc:'Сказочная оранжерея с живым фоном и котом, который реагирует на движение курсора и нажатия. Запись самостоятельного интерактивного демо.',stack:'JavaScript / WebGL / Анимация',image:'assets/garden.jpg',video:'assets/garden-demo.mp4'});
const dialog=document.querySelector('.viewer');
function openWork(key){
 const p=works.find(p=>p.key===key);if(!p)return;
 const image=dialog.querySelector('img'),video=dialog.querySelector('video');
 dialog.querySelector('h2').textContent=p.title;
 image.hidden=!!p.video;video.hidden=!p.video;
 dialog.querySelector('.viewer-info p').textContent=p.desc;
 dialog.querySelector('.viewer-info>a').href='https://github.com/famelikolbut5/'+key;
 if(p.video){
  video.poster=p.image;video.src=p.video;video.muted=false;video.volume=1;
 }else{image.src=p.image||'assets/'+key+'.webp';image.alt=p.title+' — интерфейс проекта';}
 showPanel(dialog);
 if(p.video)video.play().catch(()=>{/* Native controls remain available if playback is blocked. */});
}

document.querySelectorAll('[data-work]').forEach(b=>b.addEventListener('click',()=>openWork(b.dataset.work)));
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
  if(!stage||!root.classList.contains('mobile-intro-pending'))return;
  const initialScroll=window.scrollY;
  const images=[...stage.querySelectorAll('img')];
  await Promise.all([document.fonts.ready,...images.map(img=>img.decode().catch(()=>{}))]);
  const bounds=stage.getBoundingClientRect();
  const canAnimate=root.classList.contains('mobile-intro-pending')&&images.every(img=>img.naturalWidth>0)&&Math.abs(window.scrollY-initialScroll)<24&&bounds.top<window.innerHeight&&bounds.bottom>0&&document.visibilityState==='visible'&&motionEnabled()&&window.matchMedia('(max-width:900px)').matches;
  root.classList.remove('mobile-intro-pending');
  if(!canAnimate)return;
  root.classList.add('mobile-intro-ready');
  // Keep the final animation state, as on desktop, without switching render layers.
}
enterMobileArtwork();
