const categoryData = [{"name": "طلای آب شده", "images": [{"src": "assets/design-top/category-melted.webp", "width": 77.78343200683594, "height": 77.78343200683594, "left": 70, "top": -0.9999189376831055, "matrix": "-0.9112282395362854,0.4119018614292145,0.4119018614292145,0.9112282395362854,0,0"}]}, {"name": "سکه طلا", "images": [{"src": "assets/design-top/category-coin-large.webp", "width": 70.5, "height": 70.5, "left": 19.080078125, "top": 10.708984375, "matrix": "1,0,0,1,0,0"}, {"src": "assets/design-top/category-coin-small.webp", "width": 49.5, "height": 49.5, "left": 14.580078125, "top": 36.208984375, "matrix": "1,0,0,1,0,0"}]}, {"name": "شمش و پلاک طلا", "images": [{"src": "assets/design-top/category-pendant.webp", "width": 48, "height": 56.06059265136719, "left": 26.580078125, "top": 22.42822265625, "matrix": "1,0,0,1,0,0"}]}, {"name": "زنجیر طلا", "images": [{"src": "assets/design-top/category-chain-transparent.png", "width": 70, "height": 95.45454545454545, "left": 15, "top": 0, "matrix": "1,0,0,1,0,0"}]}, {"name": "انگشتر طلا", "images": [{"src": "assets/design-top/category-ring.webp", "width": 56, "height": 49.635704040527344, "left": 22.580078125, "top": 25.64111328125, "matrix": "1,0,0,1,0,0"}]}, {"name": "گردنبند طلا", "images": [{"src": "assets/design-top/category-necklace-transparent.png", "width": 82, "height": 70.09677419354838, "left": 9, "top": 14, "matrix": "1,0,0,1,0,0"}]}, {"name": "گوشواره طلا", "images": [{"src": "assets/design-top/category-earrings.webp", "width": 100, "height": 93.95166015625, "left": 0, "top": 3, "matrix": "1,0,0,1,0,0"}]}, {"name": "دستبند طلا", "images": [{"src": "assets/design-top/category-bracelet.webp", "width": 72, "height": 89.25, "left": 14.580312728881836, "top": 5.833741664886475, "matrix": "1,0,0,1,0,0"}]}];
const stories = [{"name": "جواهر تو  امضای تو", "src": "assets/design-part2/story-10.webp", "new": true}, {"name": "سرمایه‌ای بر دستانت", "src": "assets/design-part2/story-9.webp", "new": false}, {"name": "وقتی زمان با طلا می‌درخشد", "src": "assets/design-part2/story-8.webp", "new": false}, {"name": "درخشش، شایسته‌ی توست", "src": "assets/design-part2/story-7.webp", "new": false}, {"name": "درخشش، شایسته‌ی توست", "src": "assets/design-part2/story-6.webp", "new": false}, {"name": "درخشش، شایسته‌ی توست", "src": "assets/design-part2/story-5.webp", "new": false}, {"name": "درخشش، شایسته‌ی توست", "src": "assets/design-part2/story-4.webp", "new": false}, {"name": "درخشش، شایسته‌ی توست", "src": "assets/design-part2/story-3.webp", "new": false}, {"name": "شکوه، از تو آغاز می‌شود", "src": "assets/design-part2/story-2.webp", "new": false}, {"name": "درخشش، شایسته‌ی توست", "src": "assets/design-part2/story-1.webp", "new": false}];
const featuredShops = [{"name": "کیا گالری", "src": "assets/design-part2/shop-kia.webp"}, {"name": "میو گلد", "src": "assets/design-part2/shop-mio.webp"}, {"name": "ماوی گالری", "src": "assets/design-part2/shop-mavi.webp"}, {"name": "دوریس", "src": "assets/design-part2/shop-doris.webp"}, {"name": "درگونه", "src": "assets/design-part2/shop-dargoune.webp"}, {"name": "هور گالری", "src": "assets/design-part2/shop-hoor.webp"}];
const reviews = [{"name": "محمد یحیایی", "date": "۲۵ تیر ۱۴۰۴", "text": "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه مجله  ستون و سطر آنچنان که لازم است.", "avatar": "assets/design-part3/avatar-peach.svg"}, {"name": "محمد یحیایی", "date": "25  اسفند 1403", "text": "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه مجله  ستون و سطر آنچنان که لازم است.", "avatar": "assets/design-part3/avatar-orange.svg"}, {"name": "محمد یحیایی", "date": "۲۵ تیر ۱۴۰۴", "text": "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه مجله  ستون و سطر آنچنان که لازم است.", "avatar": "assets/design-part3/avatar-peach.svg"}, {"name": "محمد یحیایی", "date": "25  اسفند 1403", "text": "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه مجله  ستون و سطر آنچنان که لازم است.", "avatar": "assets/design-part3/avatar-orange.svg"}, {"name": "محمد یحیایی", "date": "۲۵ تیر ۱۴۰۴", "text": "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه مجله  ستون و سطر آنچنان که لازم است.", "avatar": "assets/design-part3/avatar-peach.svg"}];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = name => `<svg aria-hidden="true"><use href="#${name}"/></svg>`;
const fa = value => String(value).replace(/\d/g, n => '۰۱۲۳۴۵۶۷۸۹'[n]);
const number = value => new Intl.NumberFormat('fa-IR').format(value);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => reducedMotion.matches ? 'instant' : 'smooth';

// Supplied Figma assets retain their original crops and transformations.
const categories = categoryData.map(category => category.name);
$('#categories').innerHTML = categoryData.map((category, index) => `<a class="category" href="#new" data-category="${index}"><div class="category-image">${category.images.map(image => `<img src="${image.src}" alt="${category.name}" width="${image.width}" height="${image.height}" style="width:${image.width}%;height:${image.height}%;left:${image.left}%;top:${image.top}%;transform:matrix(${image.matrix});transform-origin:0 0">`).join('')}</div><span>${category.name}</span></a>`).join('');
$('.category-menu').innerHTML = categories.map((name, index) => `<a href="#new" data-category="${index}">${name}</a>`).join('');
$('#occasions').innerHTML = stories.map(story => `<a class="occasion ${story.new ? 'new-story' : ''}" href="#gifts"><span class="occasion-image"><img src="${story.src}" width="70" height="70" alt="${story.name}" loading="lazy">${story.new ? '<span class="story-badge">جدید</span>' : ''}</span><span class="occasion-label">${story.name}</span></a>`).join('');
const mobileShopOrder = ['درگونه','هور گالری','موسه','لوتو','کیا گالری','میو گلد','ماوی گالری','دوریس'];
const shops = [...featuredShops, { name:'موسه', wordmark:'flower' }, { name:'لوتو', wordmark:'LOTO' }];
$('#shopList').innerHTML = shops.map(shop => `<a class="shop" href="#new" style="--mobile-order:${mobileShopOrder.indexOf(shop.name)}"><div class="shop-image">${shop.src ? `<img src="${shop.src}" alt="لوگوی ${shop.name}" width="149" height="97" loading="lazy">` : `<span class="shop-wordmark">${shop.wordmark === 'flower' ? icon('flower') : `<b>${shop.wordmark}</b>`}</span>`}</div>${shop.name}</a>`).join('');
$('#reviews').innerHTML = reviews.map(review => `<article class="review-card"><div class="review-header"><img class="avatar" src="${review.avatar}" alt="آواتار کاربر" width="40" height="40" loading="lazy"><div><strong>${review.name}</strong><small>${fa(review.date)}</small></div><span class="stars" aria-label="امتیاز ۳.۷ از ۵" dir="ltr">${icon('star')} ۳.۷</span></div><p>${review.text}</p></article>`).join('');

const articles = [
 { title:'راهنمای خرید طلای دست دوم', image:'assets/articles/buying-gold.webp', alt:'گوشواره‌های طلایی روی زمینه روشن', summary:'پیش از خرید طلای دست دوم، عیار، وزن و فاکتور آن را با دقت بررسی کنید.', paragraphs:['هنگام خرید طلای دست دوم، از فروشنده فاکتور معتبر بخواهید. عیار، وزن دقیق، قیمت هر گرم و هزینه‌های خرید باید روشن و قابل بررسی باشند.','قفل، اتصالات و سطح طلا را بررسی کنید. اگر قطعه سنگ دارد، درباره وزن سنگ و نحوه محاسبه آن در قیمت نهایی سؤال کنید. از فروشگاه معتبر خرید کنید و در صورت تردید، اصالت قطعه را به کارشناس بسپارید.'] },
 { title:'راهنمای انتخاب حلقه مناسب', image:'assets/articles/diamond-ring.webp', alt:'حلقه الماس روی پارچه آبی', summary:'از اندازه حلقه تا فرم نگین؛ انتخابی راحت و ماندگار برای هر روز.', paragraphs:['حلقه‌ای انتخاب کنید که بدون فشار از بند انگشت عبور کند و هنگام پوشیدن به‌راحتی از دست خارج نشود. اندازه انگشت ممکن است با دما و زمان روز تغییر کند.','اگر حلقه را هر روز می‌پوشید، راحتی لبه‌ها و استحکام جای نگین را در اولویت بگذارید. پیش از خرید، شرایط تغییر سایز و خدمات پس از فروش را از فروشنده بپرسید.'] },
 { title:'نگهداری از طلا و جواهرات', image:'assets/articles/jewelry-care.webp', alt:'جواهر طلایی روی پارچه روشن', summary:'چند عادت ساده برای نگه‌داشتن درخشش و زیبایی جواهرات شما.', paragraphs:['زیورآلات را جدا از هم در محفظه نرم نگهداری کنید تا روی هم خط نیندازند. پیش از ورزش، شنا و استفاده از مواد شوینده، طلا و جواهر را از دست خارج کنید.','روش تمیزکردن به نوع سنگ و ساخت قطعه بستگی دارد. برای جواهرات ظریف یا سنگ‌های حساس، از مواد شیمیایی و روش‌های خانگی نامطمئن استفاده نکنید و راهنمای سازنده یا طلافروش را بپرسید.'] },
 { title:'دستبندی برای استایل شما', image:'assets/articles/gold-bracelet.webp', alt:'دستبند زنجیری طلا روی پارچه کرم', summary:'چطور اندازه و طراحی دستبند را متناسب با استفاده روزمره انتخاب کنیم؟', paragraphs:['دستبند باید فضای کافی برای حرکت مچ داشته باشد، اما بیش از حد آزاد نباشد. پیش از انتخاب اندازه، دور مچ را اندازه بگیرید و نوع قفل را بررسی کنید.','برای استفاده روزمره، به وزن، راحتی و استحکام اتصالات توجه کنید. اگر چند دستبند را کنار هم می‌پوشید، تماس مداوم آن‌ها ممکن است به سطح قطعات ظریف آسیب بزند.'] }
];
$('#articles').innerHTML = articles.map((article, index) => `<article class="article-card"><a href="#journal" data-article="${index}"><div class="article-image"><img src="${article.image}" alt="${article.alt}" width="960" height="720" loading="lazy"></div><h3>${article.title}</h3></a><p>${article.summary}</p><div class="article-bottom"><span>${icon('calendar')} ${fa(12 + index)} خرداد ۱۴۰۴</span><a href="#journal" data-article="${index}" aria-label="مطالعه ${article.title}">${icon('arrow-left')}</a></div></article>`).join('');

// Native scrolling provides animated paging, keyboard navigation and touch swipes.
const carouselCleanups = new WeakMap();
function attachCarousel(shell, track, dots = null) {
 carouselCleanups.get(shell)?.();
 $$(':scope > .slide-arrow', shell).forEach(button => button.remove());
 const previous = document.createElement('button');
 previous.className = 'slide-arrow prev';
 previous.setAttribute('aria-label', 'صفحه قبلی');
 previous.innerHTML = icon('caret-right');
 const next = document.createElement('button');
 next.className = 'slide-arrow next';
 next.setAttribute('aria-label', 'صفحه بعدی');
 next.innerHTML = icon('caret-left');
 shell.append(previous, next);
 track.setAttribute('tabindex', '0');
 track.setAttribute('aria-label', 'برای مشاهده موارد بیشتر، به چپ یا راست حرکت کنید');
 let frame = 0;
 const metrics = () => {
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  const pages = max > 2 ? Math.ceil(max / Math.max(1, track.clientWidth)) + 1 : 1;
  return { max, pages, position:Math.min(max, Math.abs(track.scrollLeft)) };
 };
 function goTo(index) {
  const { max, pages } = metrics();
  const target = Math.max(0, Math.min(pages - 1, index));
  track.scrollTo({ left:pages > 1 ? -max * target / (pages - 1) : 0, behavior:scrollBehavior() });
 }
 function update() {
  const { max, pages, position } = metrics();
  const active = max > 2 ? Math.round(position / max * (pages - 1)) : 0;
  previous.hidden = next.hidden = max <= 2;
  previous.disabled = position <= 2;
  next.disabled = position >= max - 2;
  if (dots) {
   if (dots.children.length !== pages) {
    dots.replaceChildren();
    for (let index = 0; index < pages; index++) {
     const button = document.createElement('button');
     button.type = 'button';
     button.setAttribute('aria-label', `صفحه ${fa(index + 1)}`);
     button.addEventListener('click', () => goTo(index));
     dots.append(button);
    }
   }
   [...dots.children].forEach((button, index) => {
    button.classList.toggle('active', index === active);
    if (index === active) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
   });
  }
 }
 function move(direction) {
  const { max, pages, position } = metrics();
  const current = max > 2 ? Math.round(position / max * (pages - 1)) : 0;
  goTo(current + direction);
 }
 function onScroll() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
 function onKey(event) {
  if (event.target !== track) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
   event.preventDefault(); move(event.key === 'ArrowLeft' ? 1 : -1);
  }
 }
 previous.addEventListener('click', () => move(-1));
 next.addEventListener('click', () => move(1));
 track.addEventListener('scroll', onScroll, { passive:true });
 track.addEventListener('keydown', onKey);
 const resizeObserver = new ResizeObserver(update);
 resizeObserver.observe(track);
 update();
 carouselCleanups.set(shell, () => {
  resizeObserver.disconnect();cancelAnimationFrame(frame);
  track.removeEventListener('scroll', onScroll);track.removeEventListener('keydown', onKey);
 });
}

const products = Array.from({length:8}, (_, index) => ({ id:index, type:'انگشتر', name:'انگشتر طلا ۱۸ عیار زنانه مدل گره قلب', price:7650000, originalPrice:8500000, sale:index % 2 === 1, image:index % 2 ? 'assets/design-top/product-wave.webp' : 'assets/design-top/product-heart.webp' }));
const coins = Array.from({length:8}, (_, index) => ({ id:20 + index, type:'شمش', name:'شمش طلا ۱۸ گرمی ونوس مدل ۱۱۴۸', price:7650000, sale:false, image:index % 2 ? 'assets/design-part3/gold-bar-patterned.webp' : 'assets/design-part3/gold-bar-classic.webp' }));
function renderProducts(container, filter = 'همه') {
 const kind = container.dataset.products;
 const source = kind === 'coin' ? coins : products;
 const list = source.filter(product => {
  if (filter === 'همه') return true;
  if (filter.startsWith('budget:')) {
   const budget = Number(filter.split(':')[1]);
   return budget === 20 ? product.price > 20000000 : product.price <= budget * 1000000;
  }
  return product.type === filter || product.name.includes(filter);
 });
 container.dataset.filter = filter;
 const badges = ['popular','suggested'].includes(kind);
 container.innerHTML = `<div class="product-track" role="list">${list.map(product => `<article class="product-card" role="listitem">${badges ? `<span class="badge ${product.sale ? 'sale' : ''}">${icon(product.sale ? 'tag' : 'check')}${product.sale ? 'تخفیف دار' : 'جدید'}</span>` : ''}<button class="product-image" data-add="${product.id}" aria-label="افزودن ${product.name} به سبد خرید"><img class="figma-product ${kind === 'coin' ? 'gold-bar' : product.sale ? 'wave' : 'heart'}" src="${product.image}" alt="${product.name}" width="140" height="140" loading="lazy"></button><h3>${product.name}</h3><div class="product-meta"><span>${icon('shop')}بان گالری</span><span>${icon('scale')}۱.۱ گرم</span></div><div class="price-block">${product.sale ? `<span class="old-price">${number(product.originalPrice)}</span>` : ''}<div class="price-row"><b>${number(product.price)} <small>تومان</small></b>${product.sale ? '<span class="discount">۲٪</span>' : ''}</div></div></article>`).join('') || '<p class="empty-products">محصولی برای این انتخاب موجود نیست.</p>'}</div>`;
 attachCarousel(container, $('.product-track', container), $('.slider-dots', container.closest('section')));
}
$$('[data-products]').forEach(container => renderProducts(container));
attachCarousel($('.story-carousel'), $('#occasions'));
attachCarousel($('.shop-carousel'), $('#shopList'));
attachCarousel($('.review-carousel'), $('#reviews'));
attachCarousel($('.article-carousel'), $('#articles'), $('.journal .slider-dots'));

// Hero: crossfade, autoplay, dots, pause, keyboard and horizontal swipes.
const hero = $('.hero-carousel');
const heroViewport = $('.hero-viewport');
const heroSlides = $$('[data-hero-slide]');
const heroDots = $('.hero-dots');
let heroIndex = 0;
let heroTimer;
let heroPaused = false;
let heroHovered = false;
let heroVisible = true;
function updateAutoplay() {
 clearInterval(heroTimer);
 if (heroPaused || heroHovered || !heroVisible || document.hidden || reducedMotion.matches || hero.contains(document.activeElement)) return;
 heroTimer = setInterval(() => selectHero(heroIndex + 1), 6000);
}
function selectHero(index) {
 heroIndex = (index + heroSlides.length) % heroSlides.length;
 heroSlides.forEach((slide, position) => {
  const active = position === heroIndex;
  slide.classList.toggle('is-active', active);
  slide.setAttribute('aria-hidden', String(!active));
  slide.inert = !active;
 });
 [...heroDots.children].forEach((dot, position) => {
  dot.classList.toggle('active', position === heroIndex);
  dot.setAttribute('aria-pressed', String(position === heroIndex));
 });
 updateAutoplay();
}
heroSlides.forEach((_slide, index) => {
 const dot = document.createElement('button');
 dot.type = 'button';
 dot.setAttribute('aria-label', `نمایش اسلاید ${fa(index + 1)}`);
 dot.addEventListener('click', () => selectHero(index));
 heroDots.append(dot);
});
$('.hero-prev').addEventListener('click', () => selectHero(heroIndex - 1));
$('.hero-next').addEventListener('click', () => selectHero(heroIndex + 1));
$('.hero-pause').addEventListener('click', event => {
 heroPaused = !heroPaused;
 const button = event.currentTarget;
 button.innerHTML = icon(heroPaused ? 'play' : 'pause');
 button.setAttribute('aria-label', heroPaused ? 'شروع پخش خودکار' : 'توقف پخش خودکار');
 button.setAttribute('aria-pressed', String(heroPaused));
 updateAutoplay();
});
heroViewport.addEventListener('keydown', event => {
 if (event.target !== heroViewport || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
 event.preventDefault();selectHero(heroIndex + (event.key === 'ArrowLeft' ? 1 : -1));
});
hero.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') {heroHovered = true;updateAutoplay();} });
hero.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') {heroHovered = false;updateAutoplay();} });
hero.addEventListener('focusin', updateAutoplay);
hero.addEventListener('focusout', () => setTimeout(updateAutoplay, 0));
document.addEventListener('visibilitychange', updateAutoplay);
reducedMotion.addEventListener('change', updateAutoplay);
let swipeStart = null;
heroViewport.addEventListener('pointerdown', event => {
 if (event.target.closest('a,button')) return;
 swipeStart = { x:event.clientX, y:event.clientY };
 heroViewport.setPointerCapture(event.pointerId);
});
heroViewport.addEventListener('pointerup', event => {
 if (!swipeStart) return;
 const dx = event.clientX - swipeStart.x;
 const dy = event.clientY - swipeStart.y;
 if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) selectHero(heroIndex + (dx > 0 ? 1 : -1));
 swipeStart = null;
});
heroViewport.addEventListener('pointercancel', () => {swipeStart = null;});
new IntersectionObserver(entries => {heroVisible = entries[0].isIntersecting;updateAutoplay();}, {threshold:.15}).observe(hero);
selectHero(0);

let toastTimer;
function toast(message) {
 $('.toast').textContent = message;
 $('.toast').hidden = false;
 clearTimeout(toastTimer);
 toastTimer = setTimeout(() => {$('.toast').hidden = true;}, 3200);
}
const cart = [];
function showCart() {
 $('#cartItems').innerHTML = cart.length ? cart.map((product, index) => `<div class="cart-item"><span>${product.name}<br><small>${number(product.price)} تومان</small></span><button data-remove="${index}" aria-label="حذف ${product.name}">حذف</button></div>`).join('') : '<p>سبد خرید شما خالی است.</p>';
 $('#cartCount').textContent = fa(cart.length);
 $('.mobile-cart-count').textContent = fa(cart.length);
 $('.mobile-cart-count').hidden = cart.length === 0;
}
function openCart() {showCart();$('#cartDialog').showModal();}
function closeMobileMenu() {
 $('.nav').classList.remove('menu-open');
 $('.mobile-menu-button').setAttribute('aria-expanded', 'false');
 $('.category-menu').hidden = true;
 $('.category-toggle').setAttribute('aria-expanded','false');
}
function setFilter(filter) {
 $$('.tabs button').forEach(button => button.classList.toggle('active', button.dataset.filter === filter));
 renderProducts($('[data-products="new"]'), filter);
}
document.addEventListener('click', event => {
 const add = event.target.closest('[data-add]');
 if (add) {
  const product = [...products,...coins].find(item => item.id === Number(add.dataset.add));
  if (product) {
   cart.push(product);showCart();toast('محصول به سبد خرید اضافه شد.');
   $('.cart-button').classList.remove('add-pulse');
   requestAnimationFrame(() => {$('.cart-button').classList.add('add-pulse');});
  }
 }
 const remove = event.target.closest('[data-remove]');
 if (remove) {cart.splice(Number(remove.dataset.remove), 1);showCart();}
 if (event.target.closest('[data-open-cart]')) openCart();
 if (event.target.closest('[data-open-account]')) $('#accountDialog').showModal();
 const filter = event.target.closest('.tabs button[data-filter]');
 if (filter) setFilter(filter.dataset.filter);
 const category = event.target.closest('[data-category]');
 if (category) {
  setFilter(['همه','همه','همه','زنجیر','انگشتر','گردنبند','گوشواره','دستبند'][Number(category.dataset.category)]);
  closeMobileMenu();
 }
 const budget = event.target.closest('[data-budget]');
 if (budget) {
  const value = budget.dataset.budget.replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit));
  setFilter(`budget:${value}`);
  $('#new').scrollIntoView({behavior:scrollBehavior()});
 }
 const viewAll = event.target.closest('.view-all[href="#all"]');
 if (viewAll) {
  event.preventDefault();
  const container = $('[data-products]', viewAll.closest('section'));
  if (container) {
   const expanded = container.classList.toggle('is-expanded');
   viewAll.innerHTML = `${expanded ? 'نمایش کمتر' : 'همه'} ${icon('caret-left')}`;
   attachCarousel(container, $('.product-track',container), $('.slider-dots',container.closest('section')));
  }
 }
 const articleLink = event.target.closest('[data-article]');
 if (articleLink) {
  event.preventDefault();
  const article = articles[Number(articleLink.dataset.article)];
  $('#articleContent').innerHTML = `<img src="${article.image}" alt="${article.alt}" width="960" height="720"><h2>${article.title}</h2>${article.paragraphs.map(text => `<p>${text}</p>`).join('')}`;
  $('#articleDialog').showModal();
 }
 if (event.target.closest('.dialog-close')) event.target.closest('dialog').close();
 if (event.target.closest('.nav>a')) closeMobileMenu();
 if (!event.target.closest('.nav,.mobile-menu-button')) closeMobileMenu();
});
$('.mobile-menu-button').addEventListener('click', () => {
 const open = $('.nav').classList.toggle('menu-open');
 $('.mobile-menu-button').setAttribute('aria-expanded', String(open));
});
$('.category-toggle').setAttribute('aria-expanded','false');
$('.category-toggle').addEventListener('click', () => {
 const menu = $('.category-menu');menu.hidden = !menu.hidden;
 $('.category-toggle').setAttribute('aria-expanded', String(!menu.hidden));
});
$('#accountButton').addEventListener('click', () => $('#accountDialog').showModal());
$('#cartButton').addEventListener('click', openCart);
$('#loginForm').addEventListener('submit', event => {
 event.preventDefault();$('#loginMessage').textContent = 'این نسخه نمایشی است؛ اتصال به سرویس ورود هنوز انجام نشده است.';
});
$('.search').addEventListener('submit', event => {
 event.preventDefault();const term = $('.search input').value.trim();
 setFilter(term || 'همه');$('#new').scrollIntoView({behavior:scrollBehavior()});
});
$('#shareButton').addEventListener('click', async () => {
 try {await navigator.clipboard.writeText(location.href);toast('آدرس صفحه کپی شد.');}
 catch {toast('آدرس صفحه را از نوار مرورگر کپی کنید.');}
});
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
 if (event.target !== dialog) return;
 const bounds = dialog.getBoundingClientRect();
 if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
}));
document.addEventListener('keydown', event => {if (event.key === 'Escape') closeMobileMenu();});

// Reveal once, without hiding content if motion is reduced or JavaScript fails.
if (!reducedMotion.matches) {
 document.documentElement.classList.add('motion-ready');
 const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting) {entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
  });
 }, {threshold:.06,rootMargin:'0px 0px 25px 0px'});
 $$('main>section:not(.hero-carousel),main>.wide-banner').forEach(section => {
  section.classList.add('reveal');revealObserver.observe(section);
 });
}
const bottomLinks = $$('.mobile-bottom-nav>a');
bottomLinks.forEach(link => link.addEventListener('click', () => {
 $$('.mobile-bottom-nav .active').forEach(item => item.classList.remove('active'));link.classList.add('active');
}));
