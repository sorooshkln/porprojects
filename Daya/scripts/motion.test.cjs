const { JSDOM } = require("jsdom");
const FakeTimers = require("@sinonjs/fake-timers");
const fs = require("node:fs"),
  assert = require("node:assert/strict");
const root = require("node:path").resolve(__dirname, "..");
const dom = new JSDOM(fs.readFileSync(root + "/index.html", "utf8"), {
  url: "http://127.0.0.1:3002",
  runScripts: "outside-only",
  pretendToBeVisual: true,
});
const w = dom.window,
  d = w.document;
const changes = [];
const media = {
  matches: false,
  addEventListener(type, callback) {
    changes.push(callback);
  },
};
w.matchMedia = () => media;
const observations = [];
w.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
    observations.push(this);
  }
  observe(root) {
    this.root = root;
  }
  unobserve() {}
};
w.scrollTo = () => {};
w.HTMLElement.prototype.scrollIntoView = function () {};
w.HTMLElement.prototype.scrollTo = function (options) {
  this.scrollLeft = options.left;
};
w.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
w.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
const clock = FakeTimers.withGlobal(w).install({
  toFake: ["setTimeout", "clearTimeout", "Date"],
});
let activeAnimationCount = 0;
w.HTMLElement.prototype.animate = function (frames, options) {
  activeAnimationCount++;
  let resolve, reject;
  const finished = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const timer = w.setTimeout(resolve, options.duration);
  return {
    finished,
    cancel() {
      w.clearTimeout(timer);
      reject(new Error("cancelled"));
    },
  };
};
const track = d.querySelector("#products-track");
let viewport = 1200;
Object.defineProperty(track, "clientWidth", { get: () => viewport });
Object.defineProperty(track, "scrollWidth", { get: () => 1200 });
w.HTMLElement.prototype.getBoundingClientRect = function () {
  const parent = this.parentElement;
  if (parent === track) {
    const cards = [...parent.children].filter(
      (e) => !e.classList.contains("motion-ghost"),
    );
    const i = cards.indexOf(this);
    const left = 900 - i * 300;
    return {
      left,
      right: left + 280,
      width: 280,
      top: 0,
      bottom: 400,
      height: 400,
    };
  }
  return {
    left: 0,
    right: 1200,
    width: 1200,
    top: 0,
    bottom: 700,
    height: 700,
  };
};
w.eval(fs.readFileSync(root + "/app.js", "utf8"));
w.eval(fs.readFileSync(root + "/assets/scripts/motion.js", "utf8"));
observations
  .filter((observer) => observer.root)
  .forEach((observer) =>
    observer.callback([
      { isIntersecting: true, intersectionRatio: 1, target: observer.root },
    ]),
  );
const motion = w.DayaMotion,
  hero = motion.controllers.get(d.querySelector(".hero")),
  cards = motion.controllers.get(track);
function event(target, type, props = {}) {
  const e = new w.Event(type, { bubbles: true, cancelable: true });
  Object.assign(e, props);
  target.dispatchEvent(e);
  return e;
}
const click = (s) => {
  const el = d.querySelector(s);
  assert.ok(el, s);
  el.click();
};
(async () => {
  assert.equal(motion.controllers.size, 5);
  assert.equal(hero.index, 0);
  assert.equal(hero.count, 3);
  await clock.tickAsync(6501);
  assert.equal(hero.index, 1, "hero auto advance");
  assert.equal(d.querySelectorAll(".hero-slide.is-active").length, 1);
  assert.equal(d.querySelectorAll(".hero-slide:not([inert])").length, 1);
  assert.equal(
    d.querySelector(".hero-slide.is-active").getAttribute("aria-hidden"),
    "false",
  );
  click(".hero-next");
  assert.equal(hero.index, 2);
  click(".hero-next");
  assert.equal(hero.index, 0, "hero loop");
  event(d.querySelector(".hero"), "mouseenter");
  await clock.tickAsync(15000);
  assert.equal(hero.index, 0, "pause on hover");
  event(d.querySelector(".hero"), "mouseleave");
  await clock.tickAsync(6501);
  assert.equal(hero.index, 1, "resume from hover");
  click(".hero-play");
  assert.equal(hero.paused, true);
  const paused = hero.index;
  await clock.tickAsync(14000);
  assert.equal(hero.index, paused, "explicit pause");
  click(".hero-play");
  await clock.tickAsync(6501);
  assert.equal(hero.index, 2, "explicit resume");
  const cta = d.querySelector(".hero-slide.is-active .ticket-link");
  cta.focus();
  await clock.tickAsync(14000);
  assert.equal(hero.index, 2, "pause on keyboard focus");
  cta.blur();
  await clock.tickAsync(6501);
  assert.equal(hero.index, 0, "resume after focus leaves");
  Object.defineProperty(d, "hidden", { configurable: true, value: true });
  event(d, "visibilitychange");
  await clock.tickAsync(14000);
  assert.equal(hero.index, 0, "pause hidden tab");
  Object.defineProperty(d, "hidden", { configurable: true, value: false });
  event(d, "visibilitychange");
  click('[data-open="account"]');
  await clock.tickAsync(0);
  assert.ok(hero.holds.has("dialog"));
  const dialogIndex = hero.index;
  await clock.tickAsync(14000);
  assert.equal(hero.index, dialogIndex, "pause open dialog");
  click(".close-dialog");
  await clock.tickAsync(0);
  assert.ok(!hero.holds.has("dialog"));
  event(d.querySelector(".hero"), "pointerdown", {
    pointerId: 1,
    clientX: 100,
    clientY: 100,
    button: 0,
  });
  event(w, "pointerup", { pointerId: 1, clientX: 180, clientY: 105 });
  assert.equal(hero.index, 1, "swipe right advances RTL");
  event(d.querySelector(".hero"), "pointerdown", {
    pointerId: 2,
    clientX: 100,
    clientY: 100,
    button: 0,
  });
  event(w, "pointerup", { pointerId: 2, clientX: 110, clientY: 210 });
  assert.equal(hero.index, 1, "vertical gesture preserves page scroll");
  event(d.querySelector(".hero"), "keydown", { key: "End" });
  assert.equal(hero.index, 2);
  event(d.querySelector(".hero"), "keydown", { key: "ArrowLeft" });
  assert.equal(hero.index, 0);
  hero.observer.callback([{ isIntersecting: true, intersectionRatio: 0.01 }]);
  const outsideIndex = hero.index;
  await clock.tickAsync(14000);
  assert.equal(hero.index, outsideIndex, "pause when less than 15% visible");
  hero.observer.callback([{ isIntersecting: true, intersectionRatio: 1 }]);
  // Isolate deterministic desktop carousel steps from its autoplay timer.
  for (const controller of motion.controllers.values())
    controller.hold("test", true);
  click("#view-all");
  cards.refresh();
  const originalOrder = [...track.children].map((e) => e.dataset.id);
  const pending = cards.go(1);
  assert.equal(cards.busy, true);
  assert.equal(track.querySelectorAll(".motion-ghost").length, 1);
  assert.ok(track.querySelector(".motion-ghost").hasAttribute("inert"));
  await clock.tickAsync(450);
  await pending;
  assert.equal(cards.index, 1);
  assert.equal(track.children[0].dataset.id, originalOrder[1]);
  assert.equal(
    track.querySelectorAll(".motion-ghost").length,
    0,
    "remove animation ghost",
  );
  assert.equal(cards.busy, false);
  await cards.go(1);
  assert.equal(cards.index, 1, "same dot is stable");
  const backwards = cards.go(0);
  await clock.tickAsync(450);
  await backwards;
  assert.deepEqual(
    [...track.children].map((e) => e.dataset.id),
    originalOrder,
    "previous restores order",
  );
  click('[data-index="3"]');
  await clock.tickAsync(400);
  assert.equal(cards.index, 3, "direct dots finish cross-fade");
  assert.equal(track.children[0].dataset.id, originalOrder[3]);
  click("#view-all");
  // An interrupted filter must never reinsert stale products after animation completion.
  const interrupted = cards.go(1);
  click('[data-category="classic"]');
  await clock.tickAsync(450);
  await interrupted;
  assert.equal(track.children.length, 1);
  assert.equal(track.children[0].dataset.id, "blazer");
  assert.equal(cards.count, 1);
  assert.equal(cards.tools.hidden, true);
  assert.equal(track.querySelectorAll(".motion-ghost").length, 0);
  click("#view-all");
  assert.equal(cards.count, 4);
  assert.equal(cards.index, 0);
  viewport = 600;
  cards.measure();
  assert.equal(cards.overflow, true);
  assert.deepEqual([...cards.positions], [0, 300, 600]);
  assert.equal(cards.count, 3, "only reachable mobile positions have dots");
  await cards.go(2);
  assert.equal(track.scrollLeft, -600);
  assert.equal(cards.index, 2);
  await cards.go(3);
  assert.equal(track.scrollLeft, 0, "mobile loop reaches first position");
  track.scrollLeft = -300;
  event(track, "scroll");
  assert.equal(cards.index, 1, "native swipe synchronizes dots");
  event(track, "pointerdown", {
    pointerId: 3,
    pointerType: "mouse",
    clientX: 100,
    clientY: 20,
    button: 0,
  });
  event(w, "pointermove", { pointerId: 3, clientX: 150, clientY: 20 });
  assert.equal(track.scrollLeft, -350, "mouse drag follows pointer");
  event(w, "pointerup", { pointerId: 3 });
  const draggedClick = event(track.querySelector("button"), "click");
  assert.equal(
    draggedClick.defaultPrevented,
    true,
    "drag does not open product",
  );
  viewport = 1200;
  cards.measure();
  assert.equal(cards.overflow, false);
  assert.equal(cards.index, 0);
  assert.deepEqual(
    [...track.children].map((e) => e.dataset.id),
    originalOrder,
    "resize restores canonical order",
  );
  const animationBefore = activeAnimationCount;
  media.matches = true;
  changes.forEach((fn) => fn({ matches: true }));
  const reducedIndex = hero.index;
  for (const controller of motion.controllers.values())
    controller.hold("test", false);
  await clock.tickAsync(20000);
  assert.equal(hero.index, reducedIndex, "reduced motion disables autoplay");
  assert.ok(d.querySelector(".hero-play").disabled);
  await cards.go(1);
  assert.equal(
    cards.index,
    1,
    "manual controls still work with reduced motion",
  );
  assert.equal(
    activeAnimationCount,
    animationBefore,
    "no animation under reduced motion",
  );
  console.log(
    `PASS ${process.version}: autoplay, loop, manual/dot/keyboard/swipe controls, hover/focus/modal/visibility pause, RTL scroll positions, desktop animation cleanup, filter interruption, resize, drag click suppression, reduced motion`,
  );
})()
  .then(() => {
    clock.uninstall();
    w.close();
  })
  .catch((error) => {
    console.error(error);
    clock.uninstall();
    w.close();
    process.exitCode = 1;
  });
