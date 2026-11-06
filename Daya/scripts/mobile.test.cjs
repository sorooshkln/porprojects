const { JSDOM } = require("jsdom");
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const dom = new JSDOM(fs.readFileSync(path.join(root, "index.html"), "utf8"), {
  url: "http://127.0.0.1:3002",
  runScripts: "outside-only",
  pretendToBeVisual: true,
});
const w = dom.window,
  d = w.document;
let width = 390;
const media = new Map();
w.matchMedia = (query) => {
  if (!media.has(query))
    media.set(query, {
      listeners: [],
      get matches() {
        return (
          query.includes("prefers-reduced-motion") ||
          (query.includes("max-width: 600px") && width <= 600)
        );
      },
      addEventListener(type, listener) {
        this.listeners.push(listener);
      },
    });
  return media.get(query);
};
w.HTMLElement.prototype.scrollIntoView = function () {};
w.HTMLElement.prototype.scrollTo = function (options) {
  this.scrollLeft = options.left;
};
w.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
w.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
  this.dispatchEvent(new w.Event("close"));
};
const isTrack = (e) =>
  e.matches?.("#products-track,#bestseller-grid,.style-grid,.magazine-grid");
Object.defineProperty(w.HTMLElement.prototype, "clientWidth", {
  get() {
    return isTrack(this) ? width - 40 : width;
  },
});
Object.defineProperty(w.HTMLElement.prototype, "scrollWidth", {
  get() {
    if (!isTrack(this) || (this.matches(".style-grid") && width <= 600))
      return this.clientWidth;
    const count = [...this.children].filter(
        (e) => !e.classList.contains("motion-ghost"),
      ).length,
      gap = 16,
      visible = width <= 600 ? 2 : 4;
    return Math.max(
      this.clientWidth,
      (count * (this.clientWidth - gap * (visible - 1))) / visible +
        Math.max(0, count - 1) * gap,
    );
  },
});
w.HTMLElement.prototype.getBoundingClientRect = function () {
  if (isTrack(this.parentElement)) {
    const visible = width <= 600 ? 2 : 4,
      gap = 16,
      card = (width - 40 - gap * (visible - 1)) / visible;
    const i = [...this.parentElement.children].indexOf(this),
      right = width - 20 - i * (card + gap);
    return {
      left: right - card,
      right,
      width: card,
      top: 0,
      bottom: 320,
      height: 320,
    };
  }
  return { left: 0, right: width, width, top: 0, bottom: 600, height: 600 };
};
for (const script of [
  "app.js",
  "assets/scripts/motion.js",
  "assets/scripts/mobile.js",
])
  w.eval(fs.readFileSync(path.join(root, script), "utf8"));
const click = (selector) => {
  const node = d.querySelector(selector);
  assert.ok(node, selector);
  node.click();
};
function viewport(next) {
  const prior = new Map(
    [...media].map(([query, entry]) => [query, entry.matches]),
  );
  width = next;
  for (const [query, entry] of media)
    if (entry.matches !== prior.get(query))
      entry.listeners.forEach((listener) =>
        listener({ matches: entry.matches }),
      );
  w.dispatchEvent(new w.Event("resize"));
}
(async () => {
  const drawer = d.querySelector("#mobile-menu-dialog");
  assert.equal(d.querySelectorAll("#product-search").length, 1);
  assert.ok(
    drawer.contains(d.querySelector("#product-search")),
    "original search moves into mobile menu",
  );
  assert.ok(
    d
      .querySelector(".latest-motion-tools")
      .contains(d.querySelector("#product-pagination")),
    "pagination and pause share compact mobile control",
  );
  for (const button of d.querySelectorAll(".footer-disclosure")) {
    assert.equal(button.getAttribute("aria-expanded"), "false");
    assert.ok(d.getElementById(button.getAttribute("aria-controls")).hidden);
  }
  click(".mobile-menu-toggle");
  assert.ok(drawer.open);
  assert.equal(
    d.querySelector(".mobile-menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await Promise.resolve();
  for (const controller of w.DayaMotion.controllers.values())
    assert.ok(
      controller.holds.has("dialog"),
      "mobile menu pauses all carousels",
    );
  click('#mobile-menu-dialog [data-category="classic"]');
  assert.equal(drawer.open, false);
  assert.equal(d.querySelectorAll("#products-track>.product-card").length, 1);
  click("#view-all");
  click(".mobile-menu-toggle");
  click('#mobile-menu-dialog [data-open="cart"]');
  assert.equal(drawer.open, false);
  assert.ok(d.querySelector("#detail-dialog").open);
  await Promise.resolve();
  for (const controller of w.DayaMotion.controllers.values())
    assert.ok(
      controller.holds.has("dialog"),
      "cart dialog also pauses playback",
    );
  click(".close-dialog");
  await Promise.resolve();
  for (const controller of w.DayaMotion.controllers.values())
    assert.ok(!controller.holds.has("dialog"));
  click(".mobile-menu-toggle");
  d.querySelector("#product-search").value = "خردلی";
  d.querySelector(".search").dispatchEvent(
    new w.Event("submit", { bubbles: true, cancelable: true }),
  );
  assert.equal(drawer.open, false);
  assert.equal(
    d.querySelector("#products-track>.product-card").dataset.id,
    "mustard",
  );
  click("#view-all");
  click(".footer-disclosure");
  const first = d.querySelector(".footer-disclosure");
  assert.equal(first.getAttribute("aria-expanded"), "true");
  assert.equal(
    d.getElementById(first.getAttribute("aria-controls")).hidden,
    false,
  );
  const styleTrack = d.querySelector(".style-grid"),
    styleController = w.DayaMotion.controllers.get(styleTrack);
  assert.ok(styleController.staticLayout);
  assert.equal(styleController.count, 1);
  assert.ok(styleController.tools.hidden);
  const order = [...styleTrack.children];
  await styleController.go(1);
  assert.deepEqual(
    [...styleTrack.children],
    order,
    "mobile style grid must not rotate",
  );
  const latest = w.DayaMotion.controllers.get(
    d.querySelector("#products-track"),
  );
  assert.equal(
    latest.count,
    3,
    "two visible cards yield three reachable positions",
  );
  assert.ok(
    w.DayaMotion.controllers
      .get(d.querySelector("#bestseller-grid"))
      .holds.has("mobile-manual"),
  );
  for (const picture of d.querySelectorAll(
    "#products-track .product-picture,#bestseller-grid .product-picture",
  ))
    for (const variable of ["--image-w", "--image-h", "--image-x", "--image-y"])
      assert.match(
        picture.style.getPropertyValue(variable),
        /^-?[\d.]+%$/,
        "proportional image placement " + variable,
      );
  viewport(1280);
  assert.ok(
    d
      .querySelector(".header-main")
      .contains(d.querySelector("#product-search")),
  );
  assert.ok(
    !d
      .querySelector(".latest-motion-tools")
      .contains(d.querySelector("#product-pagination")),
  );
  assert.ok(!styleController.staticLayout);
  assert.equal(styleController.count, 4);
  for (const button of d.querySelectorAll(".footer-disclosure"))
    assert.equal(
      d.getElementById(button.getAttribute("aria-controls")).hidden,
      false,
      "desktop links are always expanded",
    );
  viewport(320);
  assert.ok(drawer.contains(d.querySelector("#product-search")));
  assert.equal(
    first.getAttribute("aria-expanded"),
    "true",
    "mobile disclosure state survives resize",
  );
  assert.equal(d.querySelectorAll("#product-search").length, 1);
  assert.equal(d.querySelectorAll("#product-pagination").length, 1);
  click(".mobile-menu-toggle");
  viewport(768);
  assert.equal(drawer.open, false, "drawer closes at desktop breakpoint");
  viewport(414);
  assert.ok(styleController.staticLayout);
  click(".announcement-close");
  assert.equal(d.querySelector(".announcement").hidden, true);
  const ids = [...d.querySelectorAll("[id]")].map((n) => n.id);
  assert.equal(new Set(ids).size, ids.length);
  console.log(
    `PASS ${process.version}: mobile drawer/search/cart, both modal pauses, footer disclosure, 320/390/414/768/1280 responsive transitions, static grid, two-card stops, proportional images, unique DOM instances`,
  );
  await Promise.resolve();
  w.close();
})().catch((error) => {
  console.error(error);
  w.close();
  process.exitCode = 1;
});
