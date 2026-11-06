const { JSDOM } = require("jsdom");
const fs = require("fs");
const assert = require("node:assert/strict");
const root = require("node:path").resolve(__dirname, "..");
const dom = new JSDOM(fs.readFileSync(root + "/index.html", "utf8"), {
  url: "http://127.0.0.1:3002",
  runScripts: "outside-only",
  pretendToBeVisual: true,
});
const w = dom.window,
  d = w.document;
w.matchMedia = () => ({ matches: true, addEventListener() {} });
w.HTMLElement.prototype.scrollIntoView = function () {};
w.HTMLElement.prototype.scrollTo = function (options) {
  this.scrollLeft = options.left;
};
w.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
w.HTMLDialogElement.prototype.close = function () {
  this.open = false;
};
w.eval(fs.readFileSync(root + "/app.js", "utf8"));
w.eval(fs.readFileSync(root + "/assets/scripts/motion.js", "utf8"));
const click = (s) => {
  const e = d.querySelector(s);
  assert.ok(e, s);
  e.click();
};
const cards = () => d.querySelectorAll(".product-card");
assert.equal(cards().length, 4);
assert.equal(d.querySelector("#cart-count").textContent, "۲");
click("#category-toggle");
assert.equal(
  d.querySelector("#category-toggle").getAttribute("aria-expanded"),
  "true",
);
click('[data-category="classic"]');
assert.equal(cards().length, 1);
assert.equal(cards()[0].dataset.id, "blazer");
assert.equal(
  d.querySelector("#category-toggle").getAttribute("aria-expanded"),
  "false",
);
click('[data-category="kids"]');
assert.equal(cards().length, 0);
assert.equal(d.querySelector("#empty-results").hidden, false);
click("#clear-filters");
assert.equal(cards().length, 4);
const search = d.querySelector("#product-search");
search.value = "خردلی";
search.dispatchEvent(new w.Event("input"));
assert.equal(cards().length, 1);
assert.equal(cards()[0].dataset.id, "mustard");
click("#view-all");
click('[data-audience="women"]');
assert.equal(cards().length, 2);
click("#view-all");
click('[data-product="blazer"]');
assert.ok(d.querySelector("#detail-dialog").open);
d.querySelector("#selected-size").value = "L";
click('[data-add="blazer"]');
assert.equal(d.querySelector("#cart-count").textContent, "۳");
assert.equal(d.querySelector("#detail-dialog").open, false);
click('[data-open="cart"]');
assert.equal(d.querySelectorAll(".cart-row").length, 3);
assert.ok(d.querySelector(".cart-total").textContent.includes("۸٬۰۶۱٬۰۰۰"));
click('[data-cart-index="2"][data-delta="-1"]');
assert.equal(d.querySelectorAll(".cart-row").length, 2);
assert.equal(d.querySelector("#cart-count").textContent, "۲");
click(".close-dialog");
click('[data-open="account"]');
assert.match(d.querySelector("#dialog-content").textContent, /فعال نیست/);
click(".close-dialog");
click("#next");
assert.ok(
  d.querySelector('[data-index="1"]').getAttribute("aria-current") === "true",
);
search.value = "<img src=x onerror=alert(1)>";
search.dispatchEvent(new w.Event("input"));
assert.equal(d.querySelector("#filter-summary img"), null);
assert.equal(cards().length, 0);
assert.equal(d.querySelectorAll('a[href="#"]').length, 0);
click("#view-all");
assert.equal(d.querySelectorAll(".bestseller-card").length, 4);
click('[data-best-audience="women"]');
assert.equal(d.querySelectorAll(".bestseller-card").length, 1);
assert.equal(
  d.querySelector(".bestseller-card").dataset.id,
  "best-brown-shirt",
);
click('[data-best-audience="men"]');
assert.equal(d.querySelectorAll(".bestseller-card").length, 2);
click('[data-best-audience="kids"]');
assert.equal(d.querySelectorAll(".bestseller-card").length, 0);
assert.equal(d.querySelector("#best-empty").hidden, false);
click("#best-view-all");
assert.equal(d.querySelectorAll(".bestseller-card").length, 4);
click('[data-product="best-bag"]');
assert.match(
  d.querySelector("#dialog-content").textContent,
  /سایز در طرح مشخص نشده/,
);
click('[data-add="best-bag"]');
assert.equal(d.querySelector("#cart-count").textContent, "۳");
assert.ok(
  JSON.parse(w.localStorage.getItem("daya-cart-v1")).some(
    (item) => item.id === "best-bag",
  ),
);
click('[data-open="cart"]');
assert.equal(d.querySelectorAll(".cart-row").length, 3);
click(".close-dialog");
click('[data-article="0"]');
assert.match(d.querySelector("#dialog-heading").textContent, /استایل با اصالت/);
assert.match(d.querySelector("#dialog-content").textContent, /هنوز منتشر نشده/);
click(".close-dialog");
click("#magazine-all");
assert.equal(d.querySelectorAll("#dialog-content [data-article]").length, 4);
click('#dialog-content [data-article="2"]');
assert.match(d.querySelector("#dialog-heading").textContent, /ترندهای روز/);
click(".close-dialog");
click('[data-style="minimal"]');
assert.match(d.querySelector("#dialog-heading").textContent, /مینیمال/);
click("#style-view-products");
assert.equal(d.querySelector("#detail-dialog").open, false);
click('[data-open="branches"]');
assert.ok(d.querySelector('#dialog-content a[href="tel:+98212541478"]'));
click(".close-dialog");
click('[data-open="privacy"]');
assert.match(d.querySelector("#dialog-content").textContent, /مرورگر/);
click(".close-dialog");
assert.equal(d.querySelectorAll("#faq details").length, 6);
click("#faq summary");
assert.ok(d.querySelector("#faq details").open);
click("#faq summary");
assert.equal(d.querySelector("#faq details").open, false);
for (const anchor of d.querySelectorAll('a[href^="#"]'))
  assert.ok(
    d.querySelector(anchor.getAttribute("href")),
    anchor.getAttribute("href"),
  );
const ids = [...d.querySelectorAll("[id]")].map((e) => e.id);
assert.equal(new Set(ids).size, ids.length);
console.log(
  "PASS Part 2: bestseller tabs, missing sizing, shared cart and persistence, magazine dialogs, style cards, FAQ toggles, footer links, unique IDs",
);
console.log(
  `PASS ${process.version}: category/audience/search filters, empty state, dialogs, sizes, cart totals and persistence, pagination, search escaping`,
);
w.close();
