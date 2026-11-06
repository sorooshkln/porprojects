const products = [
  {
    id: "trousers",
    image: "product-trousers.webp",
    alt: "شلوار سبز زیتونی",
    category: "casual",
    audience: "men",
    sizes: ["S", "M", "L", "XL", "2XL"],
    discount: true,
    width: 233,
    height: 233,
    top: 40,
    left: 27,
  },
  {
    id: "patterned",
    image: "product-patterned.webp",
    alt: "پیراهن طرح‌دار کرم",
    category: "casual",
    audience: "men",
    sizes: ["S", "M", "2XL"],
    width: 192,
    height: 192,
    top: 61,
    left: 48,
  },
  {
    id: "mustard",
    image: "product-mustard.webp",
    alt: "بلوز خردلی",
    category: "casual",
    audience: "women",
    sizes: ["S", "L", "2XL"],
    width: 200,
    height: 200,
    top: 57,
    left: 44.5,
  },
  {
    id: "blazer",
    image: "product-blazer.webp",
    alt: "کت مشکی رسمی",
    category: "classic",
    audience: "women",
    sizes: ["S", "L", "2XL"],
    discount: true,
    width: 319,
    height: 319,
    top: 2,
    left: -15,
  },
].map((product) => ({
  ...product,
  title: "پیراهن آستین بلند یقه برگردان مردانه ام کی مدل 1896",
  price: 2687000,
  oldPrice: 4687000,
  stock: 10,
}));
const categoryNames = {
  classic: "کلاسیک و رسمی",
  sport: "اسپرت و ورزشی",
  casual: "روزمره و راحتی",
  kids: "بچگانه",
};
const audienceNames = { women: "زنانه", men: "مردانه", kids: "بچگانه" };
const fa = (value) => new Intl.NumberFormat("fa-IR").format(value);
const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const track = document.querySelector("#products-track");
const search = document.querySelector("#product-search");
const dialog = document.querySelector("#detail-dialog");
const content = document.querySelector("#dialog-content");
let category = "all",
  audience = "all",
  visible = [...products],
  current = 0;
let toastTimer;
const CART_KEY = "daya-cart-v1";
// The supplied design shows a cart of two sample items. Keep that initial state local.
let cart = [
  { id: "trousers", size: "M", quantity: 1 },
  { id: "patterned", size: "M", quantity: 1 },
];
try {
  const saved = JSON.parse(localStorage.getItem(CART_KEY));
  if (Array.isArray(saved))
    cart = saved.filter(
      (item) =>
        products.some(
          (p) => p.id === item?.id && p.sizes.includes(item.size),
        ) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 10,
    );
} catch {
  /* Browser storage is optional. */
}
function persistCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* Continue in memory. */
  }
  document.querySelector("#cart-count").textContent = fa(
    cart.reduce((sum, item) => sum + item.quantity, 0),
  );
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}
function renderProducts() {
  const query = search.value.trim().toLocaleLowerCase("fa");
  visible = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (audience === "all" || p.audience === audience) &&
      (!query ||
        `${p.title} ${p.alt} ${categoryNames[p.category]} Superdry سوپردرای`
          .toLocaleLowerCase("fa")
          .includes(query)),
  );
  track.innerHTML = visible
    .map(
      (p) => `<article class="product-card" data-id="${p.id}">
    <button class="product-picture" data-product="${p.id}" aria-label="مشاهدهٔ ${p.alt}" style="--image-width:${p.width}px;--image-height:${p.height}px;--image-top:${p.top}px;--image-left:${p.left}px">
      <img class="product-image" src="./assets/images/${p.image}" width="${p.width}" height="${p.height}" alt="${p.alt}" loading="lazy">
      <span class="sizes" aria-label="سایزهای موجود">${p.sizes.map((size) => `<span class="size-chip">${size}</span>`).join("")}</span>
      ${p.discount ? '<span class="discount">۴۲٪</span>' : ""}<span class="stock">۱۰ عدد موجود</span>
    </button>
    <div class="product-info"><button class="product-title" data-product="${p.id}">${p.title}</button><div class="product-pricing"><span class="old-price"><del>۴,۶۸۷,۰۰۰</del><span class="currency">تومان</span></span><span class="price">۲,۶۸۷,۰۰۰<span class="currency">تومان</span></span></div></div>
  </article>`,
    )
    .join("");
  // Figma's main price sits on the left and its crossed-out price on the right.
  current = 0;
  const empty = visible.length === 0;
  document.querySelector("#empty-results").hidden = !empty;
  document.querySelector("#previous").hidden = empty;
  document.querySelector("#next").hidden = empty;
  const summary = document.querySelector("#filter-summary");
  const filters = [
    categoryNames[category],
    audienceNames[audience],
    query && `«${search.value.trim()}»`,
  ].filter(Boolean);
  summary.textContent = filters.length
    ? `${filters.join(" · ")} — ${fa(visible.length)} محصول`
    : "";
  summary.hidden = !filters.length;
  document
    .querySelectorAll(".category-card")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === category),
      ),
    );
  document.querySelector("#product-pagination").innerHTML = visible
    .map(
      (p, i) =>
        `<button data-index="${i}" aria-label="رفتن به ${p.alt}" aria-current="${i === 0}"></button>`,
    )
    .join("");
  track.scrollLeft = 0;
}
function resetFilters() {
  category = "all";
  audience = "all";
  search.value = "";
  renderProducts();
}
function scrollToProducts() {
  document
    .querySelector("#products")
    .scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
}
function moveTo(index) {
  if (!visible.length) return;
  current = (index + visible.length) % visible.length;
  if (track.scrollWidth <= track.clientWidth + 1) {
    const cards = [...track.children];
    const ordered = [...visible.slice(current), ...visible.slice(0, current)];
    track.replaceChildren(
      ...ordered.map((p) => cards.find((card) => card.dataset.id === p.id)),
    );
    updateDots(current);
    return;
  }
  const cards = [...track.children];
  // RTL scroll positions use negative offsets in standards-compliant browsers.
  const right = cards[0].offsetLeft + cards[0].offsetWidth;
  const targetRight = cards[current].offsetLeft + cards[current].offsetWidth;
  track.scrollTo({
    left: -(right - targetRight),
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  updateDots(current);
}
function updateDots(index) {
  document
    .querySelectorAll("#product-pagination button")
    .forEach((button, i) =>
      button.setAttribute("aria-current", String(i === index)),
    );
}
track.addEventListener(
  "scroll",
  () => {
    if (!track.children.length) return;
    const bounds = track.getBoundingClientRect();
    const distances = [...track.children].map((card) =>
      Math.abs(card.getBoundingClientRect().right - bounds.right),
    );
    current = distances.indexOf(Math.min(...distances));
    updateDots(current);
  },
  { passive: true },
);
function openDialog(title, html) {
  document.querySelector("#dialog-heading").textContent = title;
  content.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
function openProduct(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  openDialog(
    p.alt,
    `<div class="dialog-product"><img src="./assets/images/${p.image}" alt="${p.alt}"><div><p>${p.title}</p><p>${fa(p.price)} تومان</p><label class="size-select">انتخاب سایز<select id="selected-size">${p.sizes.map((size) => `<option>${size}</option>`).join("")}</select></label><p>۱۰ عدد موجود</p><button class="primary-button" data-add="${p.id}">افزودن به سبد خرید</button></div></div>`,
  );
}
function openCart() {
  openDialog(
    "سبد خرید",
    cart.length
      ? cart
          .map((item, index) => {
            const p = products.find((p) => p.id === item.id);
            return `<div class="cart-row"><img src="./assets/images/${p.image}" alt="${p.alt}"><div>${p.alt}<small>سایز ${item.size} · ${fa(p.price)} تومان</small></div><div class="quantity-controls"><button data-cart-index="${index}" data-delta="1" aria-label="افزایش تعداد ${p.alt}">+</button><span>${fa(item.quantity)}</span><button data-cart-index="${index}" data-delta="-1" aria-label="کاهش تعداد ${p.alt}">−</button></div></div>`;
          })
          .join("") +
          `<p class="cart-total">جمع: ${fa(cart.reduce((sum, item) => sum + products.find((p) => p.id === item.id).price * item.quantity, 0))} تومان</p><p class="dialog-note">این سبد خرید نمونه روی همین مرورگر ذخیره می‌شود؛ سفارش یا پرداختی ثبت نمی‌شود.</p>`
      : "<p>سبد خرید شما خالی است.</p>",
  );
}
const info = {
  account: ["حساب کاربری", "<p>ورود و ثبت‌نام در نسخهٔ نمایشی فعال نیست.</p>"],
  about: [
    "دربارهٔ دایامد",
    "<p>دایامد؛ انتخاب پوشاک کلاسیک و رسمی، اسپرت و ورزشی، روزمره و راحتی و بچگانه.</p>",
  ],
  contact: ["تماس با ما", "<p>اطلاعات تماس فروشگاه هنوز اضافه نشده است.</p>"],
  magazine: [
    "دایا مگ",
    "<p>مقاله‌های دایا مگ به‌زودی در این بخش قرار می‌گیرند.</p>",
  ],
};
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.product) openProduct(button.dataset.product);
  if (button.dataset.open) {
    if (button.dataset.open === "cart") openCart();
    else {
      const [title, html] = info[button.dataset.open];
      openDialog(title, html);
    }
  }
  if (button.dataset.category) {
    category = button.dataset.category;
    audience = "all";
    renderProducts();
    closeMenu();
    scrollToProducts();
  }
  if (button.dataset.audience) {
    audience = button.dataset.audience;
    category = "all";
    renderProducts();
    scrollToProducts();
  }
  if (button.dataset.index !== undefined) moveTo(Number(button.dataset.index));
  if (button.dataset.add) {
    const p = products.find((p) => p.id === button.dataset.add),
      size = document.querySelector("#selected-size").value;
    const item = cart.find((item) => item.id === p.id && item.size === size);
    const total = cart
      .filter((item) => item.id === p.id)
      .reduce((sum, item) => sum + item.quantity, 0);
    if (total >= p.stock) {
      showToast("موجودی این محصول کافی نیست.");
      return;
    }
    if (item) item.quantity++;
    else cart.push({ id: p.id, size, quantity: 1 });
    persistCart();
    dialog.close();
    showToast("محصول به سبد خرید اضافه شد.");
  }
  if (button.dataset.cartIndex !== undefined) {
    const index = Number(button.dataset.cartIndex),
      item = cart[index];
    if (!item) return;
    const next = item.quantity + Number(button.dataset.delta);
    const total = cart
      .filter((row) => row.id === item.id)
      .reduce((sum, row) => sum + row.quantity, 0);
    if (Number(button.dataset.delta) > 0 && total >= 10) {
      showToast("موجودی این محصول کافی نیست.");
      return;
    }
    if (next <= 0) cart.splice(index, 1);
    else item.quantity = next;
    persistCart();
    openCart();
  }
});
document.querySelector(".search").addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
  scrollToProducts();
});
search.addEventListener("input", renderProducts);
document.querySelector("#view-all").addEventListener("click", resetFilters);
document
  .querySelector("#clear-filters")
  .addEventListener("click", resetFilters);
document
  .querySelector("#previous")
  .addEventListener("click", () => moveTo(current - 1));
document
  .querySelector("#next")
  .addEventListener("click", () => moveTo(current + 1));
document
  .querySelector(".close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
const toggle = document.querySelector("#category-toggle"),
  dropdown = document.querySelector("#category-dropdown");
function closeMenu() {
  dropdown.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
}
toggle.addEventListener("click", () => {
  dropdown.hidden = !dropdown.hidden;
  toggle.setAttribute("aria-expanded", String(!dropdown.hidden));
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".category-menu")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    toggle.blur();
  }
});
persistCart();
renderProducts();
