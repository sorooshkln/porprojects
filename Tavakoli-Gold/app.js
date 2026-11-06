import {createNode, definitions} from './renderer.js';
const design=window.TAVAKOLI_DESIGN;
const stage=document.querySelector('#design-stage');
document.body.insertAdjacentHTML('afterbegin',definitions(design.paths));
const panel=document.querySelector('#panel'), title=document.querySelector('#panel-title'), body=document.querySelector('#panel-body');
let layout, scale=1, currentMode='', noticeTimer;
const find=(n,id)=>n.id===id?n:n.children.map(c=>find(c,id)).find(Boolean);
const all=(n,fn)=>[...(fn(n)?[n]:[]),...n.children.flatMap(c=>all(c,fn))];
const imageOf=n=>all(n,x=>x.fillPaints.some(p=>p.image))[0]?.fillPaints.find(p=>p.image)?.image;
const productIds=['11:667','11:677','11:687','11:697','11:672','11:682','11:692','11:702'];
const products=productIds.map((id,i)=>({id:i,name:'گردنبند برلیان ۱۸ عیار',price:240000,image:imageOf(find(design.layouts.desktop,id))}));
const discountImages=['11:585','11:586','11:589'].map(id=>imageOf(find(design.layouts.desktop,id)));
const discounted=discountImages.map((image,i)=>({id:8+i,name:'گردنبند برلیان ۱۸ عیار',price:240000,previous:500000,image}));
const catalogue=[...products,...discounted];
let cart=[];
try {const saved=JSON.parse(localStorage.getItem('tavakoli-gold-cart')||'[]');if(Array.isArray(saved))cart=saved.filter(x=>Number.isInteger(x.id)&&catalogue[x.id]&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<100);}catch{}
const number=n=>new Intl.NumberFormat('fa-IR').format(n);
function notify(message){const el=document.querySelector('#notice');el.textContent=message;el.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('visible'),3000);}
function openPanel(heading,content){title.textContent=heading;body.replaceChildren();if(typeof content==='string'){const p=document.createElement('p');p.textContent=content;body.append(p);}else body.append(content);if(!panel.open)panel.showModal();}
function button(label,fn,cls='action'){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=label;b.addEventListener('click',fn);return b;}
function persist(){try{localStorage.setItem('tavakoli-gold-cart',JSON.stringify(cart));}catch{}updateBadge();}
function updateBadge(){for(const el of stage.querySelectorAll('[data-node="11:430"],[data-node="11:917"]')){el.replaceChildren();const span=document.createElement('span');span.className='live-text';span.style.fontSize='11px';span.style.color='white';span.textContent=number(cart.reduce((sum,x)=>sum+x.qty,0));el.append(span);}}
function showProduct(p){const wrap=document.createElement('div'),img=document.createElement('img');img.src='assets/images/'+p.image;img.alt=p.name;wrap.append(img);const price=document.createElement('p');price.textContent=`${number(p.price)} تومان`;wrap.append(price,button('افزودن به سبد خرید',()=>{let item=cart.find(x=>x.id===p.id);if(item){item.qty=Math.min(99,item.qty+1);}else cart.push({id:p.id,qty:1});persist();notify('به سبد خرید اضافه شد');}));openPanel(p.name,wrap);}
function showCart(){const wrap=document.createElement('div');if(!cart.length){const p=document.createElement('p');p.className='empty';p.textContent='سبد خرید شما خالی است';wrap.append(p);}else {for(const item of cart){const p=catalogue[item.id],row=document.createElement('div');row.className='cart-row';const img=document.createElement('img');img.src='assets/images/'+p.image;img.alt=p.name;const label=document.createElement('span');label.textContent=`${p.name} × ${number(item.qty)} — ${number(p.price*item.qty)} تومان`;row.append(img,label,button('حذف',()=>{cart=cart.filter(x=>x!==item);persist();showCart();},''));wrap.append(row);}const total=document.createElement('p');total.textContent='مجموع: '+number(cart.reduce((sum,x)=>sum+catalogue[x.id].price*x.qty,0))+' تومان';wrap.append(total);const note=document.createElement('p');note.textContent='این سبد برای پیش‌نمایش طرح است؛ خرید و پرداخت آنلاین هنوز متصل نشده‌اند.';wrap.append(note);}openPanel('سبد خرید',wrap);}
function scrollSection(desktopY,mobileY){panel.close();window.scrollTo({top:(currentMode==='mobile'?mobileY:desktopY)*scale,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function menu(){const nav=document.createElement('nav');for(const [label,d,m] of [['خانه',0,0],['محصولات',963,379],['تخفیف دار',1451,741],['طلای سفارشی',2074,1087],['پرفروش ترین محصولات',2421,1305],['مجله توکلی',3670,1787],['تماس با ما',4211,1787]])nav.append(button(label,()=>scrollSection(d,m),''));openPanel('طلای توکلی',nav);}
function search(){const wrap=document.createElement('div'),input=document.createElement('input'),results=document.createElement('div');input.type='search';input.placeholder='جستجوی محصول';input.setAttribute('aria-label','جستجوی محصول');function update(){results.replaceChildren();const matches=catalogue.filter(p=>p.name.includes(input.value.trim()));if(!matches.length){results.textContent='محصولی پیدا نشد';return;}for(const p of matches)results.append(button(p.name+' — '+number(p.price)+' تومان',()=>showProduct(p),''));}input.addEventListener('input',update);wrap.append(input,results);openPanel('جستجو',wrap);update();input.focus();}
function account(){openPanel('حساب کاربری','ورود و ثبت سفارش پس از اتصال به سامانهٔ فروش فعال خواهد شد.');}
function customOrder(){const wrap=document.createElement('div');const p=document.createElement('p');p.textContent='طلای سفارشی شما را با بالاترین کیفیت می‌سازیم.';wrap.append(p);const form=document.createElement('form');const label=document.createElement('label');label.textContent='توضیحات سفارش';const textarea=document.createElement('textarea');textarea.rows=4;textarea.required=true;textarea.maxLength=2000;try{textarea.value=localStorage.getItem('tavakoli-gold-order-draft')||'';}catch{}label.append(textarea);form.append(label);const save=button('ذخیرهٔ پیش‌نویس در این مرورگر',()=>{if(!textarea.reportValidity())return;try{localStorage.setItem('tavakoli-gold-order-draft',textarea.value);notify('پیش‌نویس در مرورگر شما ذخیره شد؛ ارسال نشده است.');}catch{notify('ذخیره‌سازی در مرورگر در دسترس نیست.');}});form.append(save);wrap.append(form);openPanel('سفارش طلای اختصاصی',wrap);}
function article(){const wrap=document.createElement('div'),date=document.createElement('p');date.className='article-date';date.textContent='۱۲ بهمن ۱۴۰۲';const p=document.createElement('p');p.textContent='متن کامل این مقاله در فایل طراحی قرار ندارد.';wrap.append(date,p);openPanel('راهنمای خرید طلای دست دوم',wrap);}
function hotspot(x,y,w,h,label,fn){const b=document.createElement('button');b.type='button';b.className='hotspot';b.setAttribute('aria-label',label);Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});b.addEventListener('click',fn);stage.firstElementChild.append(b);return b;}
function bounds(id){function walk(n,x=0,y=0,sx=1,sy=1){const t=n.matrix;const nx=x+t[4]*sx,ny=y+t[5]*sy;if(n.id===id)return [nx,ny,n.w*sx,n.h*sy];for(const c of n.children){const r=walk(c,nx,ny,sx*(n.childScale?.[0]||1),sy*(n.childScale?.[1]||1));if(r)return r;}}return walk(layout);}
function control(id,label,fn){const box=bounds(id);if(box)return hotspot(...box,label,fn);}
function wire(){
 const mobile=currentMode==='mobile';
 control(mobile?'11:915':'11:426','سبد خرید',showCart);
 if(mobile)control('11:914','باز کردن منو',menu);else {control('11:424','حساب کاربری',account);control('11:425','جستجو',search);}
 for(const n of all(layout,n=>n.type==='TEXT')) {
  const t=n.text||'';
  if(t==='مشاهده محصولات')control(n.id,t,()=>scrollSection(963,379));
  else if(t==='مشاهده همه')control(n.id,t,()=>scrollSection(2567,1466));
  else if(t==='ثبت سفارش' || t.includes('سفارش اختصاصی'))control(n.id,t,customOrder);
  else if(t==='مطالعه بیشتر')control(n.id,t,article);
  else if(t==='مقالات بیشتر')control(n.id,t,article);
 }
 control(mobile?'11:1049':'11:650','سفارش طلای اختصاصی',customOrder);
 if(mobile){
  ['11:1014','11:1003','11:992'].forEach((id,i)=>control(id,discounted[i].name,()=>showProduct(discounted[i])));
  ['11:1092','11:1081','11:1070'].forEach((id,i)=>control(id,products[i].name,()=>showProduct(products[i])));
  control('11:1237','مقاله بعدی',()=>notify('تمام کارت‌های مقاله در طرح عنوان یکسان دارند.'));
  control('11:1238','مقاله قبلی',()=>notify('تمام کارت‌های مقاله در طرح عنوان یکسان دارند.'));
  [['11:1279','پروفایل',account],['11:1282','سبد خرید',showCart],['11:1285','خانه',()=>scrollSection(0,0)],['11:1288','دسته بندی',menu],['11:1291','ارتباط با ما',()=>openPanel('ارتباط با ما','اطلاعات تماس مطابق بخش پایانی طرح دسکتاپ است.')]].forEach(([id,label,fn])=>control(id,label,fn));
 }else{
  productIds.forEach((id,i)=>control(id,products[i].name,()=>showProduct(products[i])));
  [[713,1541],[405,1541],[97,1541]].forEach(([x,y],i)=>hotspot(x,y,268,420,discounted[i].name,()=>showProduct(discounted[i])));
 }
 const categoryIds=mobile?['11:943','11:947','11:951','11:955','11:960','11:964','11:970','11:974']:['11:490','11:497','11:503','11:507','11:511','11:515','11:519','11:523'];
 categoryIds.forEach(id=>{const n=find(layout,id);if(!n)return;const name=all(n,x=>Boolean(x.text)).map(x=>x.text).join(' ')||'محصولات';control(id,name,()=>{scrollSection(2421,1305);notify('محصولات موجود در طرح نمایش داده می‌شوند.');});});
 // Category labels in the design are navigation tabs. Product content supplied
 // by the source is identical; do not invent products for missing categories.
 const groups=mobile?['11:983','11:1057']:['11:610','11:659'];
 for(const id of groups){const group=find(layout,id);if(!group)continue;for(const n of all(group,x=>Boolean(x.text))){const b=control(n.id,n.text,()=>{for(const sibling of stage.querySelectorAll(`[data-tab-group="${id}"]`))sibling.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');notify('فهرست محصولات مطابق اطلاعات موجود در طرح است.');});if(b){b.dataset.tabGroup=id;b.setAttribute('aria-pressed','false');}}}
 // Navigation labels present in the original header and footer.
 for(const groupId of ['11:439','11:879']){const group=find(layout,groupId);if(!group)continue;for(const n of all(group,x=>Boolean(x.text))){const t=n.text;if(t.includes('تماس'))control(n.id,t,()=>scrollSection(4211,1787));else if(t.includes('مقال')||t.includes('مجله'))control(n.id,t,()=>scrollSection(3670,1787));else if(t.includes('صفحه')||t==='خانه')control(n.id,t,()=>scrollSection(0,0));else if(t.includes('سفارشی')||t.includes('سفارش طراحی'))control(n.id,t,customOrder);else control(n.id,t,()=>scrollSection(963,379));}}
 installSliders();
 updateBadge();
}
function installSliders(){
 if(currentMode!=='mobile')return;
 const root=stage.firstElementChild;
 const sliders=[['11:991',['11:1014','11:1003','11:992']],['11:1069',['11:1092','11:1081','11:1070']],['11:983',[]],['11:1057',[]]].map(([id,items])=>{
  const n=find(layout,id),box=bounds(id),element=root.querySelector(`[data-node="${id}"]`);
  if(!n||!box||!element)return null;
  const targets=items.map(bounds).filter(Boolean);
  const buttons=[...root.querySelectorAll('.hotspot')].filter(b=>targets.some(t=>Math.abs(parseFloat(b.style.left)-t[0])<1&&Math.abs(parseFloat(b.style.top)-t[1])<1)||b.dataset.tabGroup===id);
  return {n,box,element,buttons,offset:0,maximum:Math.max(0,20-box[0]),minimum:Math.min(0,370-box[0]-box[2]),original:buttons.map(b=>parseFloat(b.style.left))};
 }).filter(Boolean);
 function move(s,value){s.offset=Math.max(s.minimum,Math.min(s.maximum,value));const t=[...s.n.matrix];t[4]+=s.offset;s.element.style.transform=`matrix(${t.join(',')})`;s.buttons.forEach((b,i)=>b.style.left=(s.original[i]+s.offset)+'px');}
 let gesture=null,suppress=false;
 root.style.touchAction='pan-y';
 root.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=stage.getBoundingClientRect(),y=(e.clientY-r.top)/scale;const slider=sliders.find(s=>y>=s.box[1]&&y<=s.box[1]+s.box[3]);if(slider)gesture={slider,x:e.clientX,y:e.clientY,offset:slider.offset,dragging:false,id:e.pointerId};});
 root.addEventListener('pointermove',e=>{if(!gesture||e.pointerId!==gesture.id)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(!gesture.dragging){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){gesture=null;return;}if(Math.abs(dx)<8)return;gesture.dragging=true;root.setPointerCapture?.(e.pointerId);}e.preventDefault();move(gesture.slider,gesture.offset+dx/scale);});
 root.addEventListener('pointerup',()=>{suppress=Boolean(gesture?.dragging);gesture=null;});root.addEventListener('pointercancel',()=>{gesture=null;});
 root.addEventListener('click',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault();suppress=false;}},true);
 root.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const s=sliders.find(s=>s.buttons.includes(e.target));if(s){e.preventDefault();move(s,s.offset+(e.key==='ArrowRight'?100:-100));}});
}
function installMobileNavigation(){
 document.querySelector('#mobile-navigation')?.remove();
 if(currentMode!=='mobile')return;
 const source=stage.querySelector('[data-node="11:1277"]');if(!source)return;
 const nav=document.createElement('nav');nav.id='mobile-navigation';nav.setAttribute('aria-label','دسترسی سریع');
 const content=document.createElement('div');content.className='mobile-navigation-content';
 source.style.transform='translate(-2px,0)';content.append(source);
 for(const b of [...stage.querySelectorAll('.hotspot')]){if(parseFloat(b.style.top)>=2136){b.style.top=(parseFloat(b.style.top)-2146)+'px';content.append(b);}}
 nav.append(content);document.body.append(nav);
}
// These sections span the viewport while product cards keep their content width.
function installPageAdjustments(){
 for(const id of ['11:621','11:624'])stage.querySelector(`[data-node="${id}"]`)?.remove();
 const mobile=currentMode==='mobile';
 stage.querySelector(`[data-node="${mobile?'11:1239':'11:529'}"]`)?.remove();
 stage.querySelector(`[data-node="${mobile?'11:1103':'11:707'}"]`)?.remove();
 for(const [name,kind] of [['brand','brand-band'],['best-sellers','full-bleed-background'],['divider','full-bleed-divider']]){
  const el=document.createElement('div');el.className=`full-bleed ${kind}`;el.dataset.band=name;
  if(name==='brand')el.setAttribute('aria-label','توکلی');else el.setAttribute('aria-hidden','true');
  stage.append(el);
 }
 if(mobile){const el=document.createElement('div');el.className='full-bleed full-bleed-background';el.dataset.band='best-sellers-title';el.setAttribute('aria-hidden','true');stage.append(el);}
}
function resizeFullBleed(viewportWidth,contentWidth){
 const mobile=currentMode==='mobile';
 const dimensions={brand:mobile?[687,27]:[1296,56],'best-sellers':mobile?[1370,65]:[2396,98],divider:mobile?[1739,16]:[3512,47],'best-sellers-title':[1305,65]};
 for(const el of stage.querySelectorAll('.full-bleed')){
  const [y,height]=dimensions[el.dataset.band];
  Object.assign(el.style,{left:((contentWidth-viewportWidth)/2)+'px',top:(y*scale)+'px',width:viewportWidth+'px',height:(height*scale)+'px'});
 }
 const brand=stage.querySelector('[data-band="brand"]');
 const itemWidth=(mobile?76.18:158)*scale;
 brand.style.fontSize=((mobile?7.7143:16)*scale)+'px';
 brand.style.setProperty('--brand-item-width',itemWidth+'px');brand.style.setProperty('--brand-star-size',((mobile?6:12)*scale)+'px');
 const repetitions=Math.ceil(viewportWidth/itemWidth)+1;
 if(brand.children.length!==repetitions){
  brand.replaceChildren();
  for(let i=0;i<repetitions;i++){
   const item=document.createElement('span');item.className='brand-item';item.setAttribute('aria-hidden','true');
   const word=document.createElement('span');word.textContent='توکلی';
   const star=document.createElement('span');star.className='brand-star';
   item.append(word,star);brand.append(item);
  }
 }
 const best=stage.querySelector('[data-band="best-sellers"]');
 best.style.background=mobile?'#ece9e5':`linear-gradient(to right,#ece9e5 ${viewportWidth/2+(1034-1512/2)*scale}px,#fff 0)`;
 const divider=stage.querySelector('[data-band="divider"]');
 const source=find(layout,mobile?'11:1103':'11:707');
 const tileWidth=source.w*scale,count=Math.ceil(viewportWidth/tileWidth);
 if(divider.dataset.tileCount!==String(count)){
  divider.replaceChildren();divider.dataset.tileCount=String(count);
  for(let i=0;i<count;i++){
   const tile=createNode({...source,matrix:[1,0,0,1,0,0]},`full-divider-${i}`,document);
   tile.classList.add('divider-tile');divider.append(tile);
  }
 }
 [...divider.children].forEach((tile,i)=>{tile.style.transform=`translateX(${i*tileWidth}px) scale(${scale})`;});
}
function resize(){const viewportWidth=document.documentElement.clientWidth||innerWidth;const mode=viewportWidth<900?'mobile':'desktop';if(mode!==currentMode){currentMode=mode;layout=design.layouts[mode];stage.replaceChildren(createNode(layout,mode,document));wire();installMobileNavigation();installPageAdjustments();}const width=currentMode==='mobile'?Math.min(viewportWidth,600):Math.min(viewportWidth,1512);scale=width/layout.w;stage.style.width=width+'px';stage.style.height=(layout.h*scale)+'px';stage.firstElementChild.style.transform=`scale(${scale})`;resizeFullBleed(viewportWidth,width);const nav=document.querySelector('#mobile-navigation');if(nav){nav.style.width=width+'px';nav.style.height=(78*scale)+'px';nav.firstElementChild.style.transform=`scale(${scale})`;}}
resize();addEventListener('resize',resize);addEventListener('storage',e=>{if(e.key==='tavakoli-gold-cart'){try{const v=JSON.parse(e.newValue||'[]');if(Array.isArray(v))cart=v.filter(x=>catalogue[x.id]&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<100);updateBadge();}catch{}}});
panel.querySelector('.close').addEventListener('click',()=>panel.close());panel.addEventListener('click',e=>{if(e.target===panel){const b=panel.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)panel.close();}});
