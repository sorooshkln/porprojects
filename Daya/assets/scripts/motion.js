(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const controllers = new Map();
  const svg = (name) =>
    `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const wrap = (value, length) =>
    length ? ((value % length) + length) % length : 0;
  const fa = (value) => new Intl.NumberFormat("fa-IR").format(value);

  class Playback {
    constructor(root, play, interval = 6000) {
      this.root = root;
      this.play = play;
      this.interval = interval;
      this.timer = null;
      this.paused = false;
      this.holds = new Set();
      this.count = 0;
      root.addEventListener("mouseenter", () => this.hold("hover", true));
      root.addEventListener("mouseleave", () => this.hold("hover", false));
      root.addEventListener("focusin", () => this.hold("focus", true));
      window.addEventListener("blur", () => this.hold("window", true));
      window.addEventListener("focus", () => this.hold("window", false));
      root.addEventListener("focusout", () =>
        queueMicrotask(() =>
          this.hold("focus", root.contains(document.activeElement)),
        ),
      );
      document.addEventListener("visibilitychange", () =>
        this.hold("hidden", document.hidden),
      );
      window.addEventListener("pagehide", () => this.hold("page", true));
      window.addEventListener("pageshow", () => this.hold("page", false));
      this.hold("hidden", document.hidden);
      if ("IntersectionObserver" in window) {
        this.hold("outside", true);
        this.observer = new IntersectionObserver(
          ([entry]) =>
            this.hold(
              "outside",
              !entry.isIntersecting || entry.intersectionRatio < 0.15,
            ),
          { threshold: 0.15 },
        );
        this.observer.observe(root);
      }
      play.addEventListener("click", () => {
        this.paused = !this.paused;
        this.schedule();
      });
      this.status = document.createElement("span");
      this.status.className = "sr-only";
      this.status.setAttribute("role", "status");
      root.append(this.status);
    }
    hold(reason, value) {
      if (value) this.holds.add(reason);
      else this.holds.delete(reason);
      this.schedule();
    }
    schedule() {
      clearTimeout(this.timer);
      this.timer = null;
      this.play.disabled = reduced.matches || this.count < 2;
      this.play.textContent = this.paused ? "پخش" : "توقف";
      this.play.setAttribute(
        "aria-label",
        this.paused ? "شروع پخش خودکار" : "توقف پخش خودکار",
      );
      this.play.title = reduced.matches
        ? "پخش خودکار با تنظیم کاهش حرکت متوقف است."
        : "";
      if (
        !this.paused &&
        !reduced.matches &&
        !this.holds.size &&
        this.count > 1
      ) {
        this.timer = setTimeout(() => {
          this.timer = null;
          this.next(true);
        }, this.interval);
      }
    }
    announce(index, automatic) {
      if (!automatic)
        this.status.textContent = `${fa(index + 1)} از ${fa(this.count)}`;
    }
  }

  class Hero extends Playback {
    constructor(root) {
      super(root, root.querySelector(".hero-play"), 6500);
      this.panels = [...root.querySelectorAll(".hero-slide")];
      this.count = this.panels.length;
      this.index = 0;
      this.dots = root.querySelector(".hero-dots");
      this.dots.innerHTML = this.panels
        .map(
          (_, i) =>
            `<button data-hero-index="${i}" aria-label="اسلاید ${fa(i + 1)}" aria-current="${i === 0}"></button>`,
        )
        .join("");
      root.setAttribute("role", "region");
      root.setAttribute("aria-roledescription", "اسلایدر");
      root
        .querySelector(".hero-next")
        .addEventListener("click", () => this.go(this.index + 1));
      root
        .querySelector(".hero-previous")
        .addEventListener("click", () => this.go(this.index - 1));
      this.dots.addEventListener("click", (event) => {
        const button = event.target.closest("[data-hero-index]");
        if (button) this.go(Number(button.dataset.heroIndex));
      });
      root.addEventListener("keydown", (event) => {
        const index = keyIndex(event, this.index, this.count);
        if (index !== null) {
          event.preventDefault();
          this.go(index);
        }
      });
      attachSwipe(root, (direction) => this.go(this.index + direction), this);
      this.schedule();
    }
    go(index, automatic = false) {
      this.index = wrap(index, this.count);
      this.panels.forEach((panel, i) => {
        const active = i === this.index;
        panel.classList.toggle("is-active", active);
        panel.inert = !active;
        if (active) panel.removeAttribute("inert");
        else panel.setAttribute("inert", "");
        panel.setAttribute("aria-hidden", String(!active));
      });
      [...this.dots.children].forEach((dot, i) =>
        dot.setAttribute("aria-current", String(i === this.index)),
      );
      this.announce(this.index, automatic);
      this.schedule();
    }
    next(automatic = false) {
      this.go(this.index + 1, automatic);
    }
  }

  function keyIndex(event, index, count) {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.closest("input,select,textarea,[contenteditable=true]")
    )
      return null;
    if (event.key === "ArrowLeft") return index + 1;
    if (event.key === "ArrowRight") return index - 1;
    if (event.key === "Home") return 0;
    if (event.key === "End") return count - 1;
    return null;
  }

  // Vertical gestures keep normal page scrolling; horizontal gestures change slides.
  function attachSwipe(element, move, playback) {
    let gesture = null,
      suppress = false;
    element.addEventListener("pointerdown", (event) => {
      if (event.isPrimary === false || event.button > 0) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
      playback.hold("pointer", true);
    });
    const end = (event, cancelled = false) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x,
        dy = event.clientY - gesture.y;
      gesture = null;
      playback.hold("pointer", false);
      if (
        !cancelled &&
        Math.abs(dx) > 45 &&
        Math.abs(dx) > Math.abs(dy) * 1.3
      ) {
        suppress = true;
        move(dx > 0 ? 1 : -1);
        setTimeout(() => {
          suppress = false;
        }, 400);
      }
    };
    window.addEventListener("pointerup", (event) => end(event));
    window.addEventListener("pointercancel", (event) => end(event, true));
    window.addEventListener("blur", () => {
      gesture = null;
      playback.hold("pointer", false);
    });
    element.addEventListener(
      "click",
      (event) => {
        if (suppress) {
          event.preventDefault();
          event.stopImmediatePropagation();
          suppress = false;
        }
      },
      true,
    );
  }

  class Cards extends Playback {
    constructor(track, root, latest = false) {
      const tools = document.createElement("div");
      tools.className = "motion-tools";
      tools.innerHTML = `<button class="motion-previous" aria-label="مورد قبلی">${svg("left")}</button><div class="motion-dots" aria-label="انتخاب موقعیت"></div><button class="motion-next" aria-label="مورد بعدی">${svg("left")}</button><button class="motion-play" aria-label="توقف پخش خودکار">توقف</button>`;
      root.append(tools);
      super(root, tools.querySelector(".motion-play"), 6000);
      this.track = track;
      this.tools = tools;
      this.latest = latest;
      this.dots = latest
        ? document.querySelector("#product-pagination")
        : tools.querySelector(".motion-dots");
      if (latest) {
        tools.classList.add("latest-motion-tools");
        tools.querySelector(".motion-dots").remove();
      }
      this.index = 0;
      this.epoch = 0;
      this.animations = [];
      this.track.classList.add("motion-track");
      this.track.tabIndex = 0;
      this.track.setAttribute("aria-label", "فهرست قابل جابه‌جایی");
      root.setAttribute("aria-roledescription", "اسلایدر");
      tools
        .querySelector(".motion-next")
        .addEventListener("click", () => this.go(this.index + 1));
      tools
        .querySelector(".motion-previous")
        .addEventListener("click", () => this.go(this.index - 1));
      this.dots.addEventListener("click", (event) => {
        const dot = event.target.closest("[data-motion-index]");
        if (dot) this.go(Number(dot.dataset.motionIndex));
      });
      track.addEventListener("daya:refresh", () => this.refresh());
      track.addEventListener("daya:go", (event) => this.go(event.detail.index));
      track.addEventListener("keydown", (event) => {
        const index = keyIndex(event, this.index, this.count);
        if (index !== null) {
          event.preventDefault();
          this.go(index);
        }
      });
      track.addEventListener(
        "scroll",
        () => {
          if (!this.overflow) return;
          const offset = Math.abs(track.scrollLeft);
          this.index = this.positions.reduce(
            (nearest, value, i) =>
              Math.abs(value - offset) <
              Math.abs(this.positions[nearest] - offset)
                ? i
                : nearest,
            0,
          );
          this.update();
          this.hold("scroll", true);
          clearTimeout(this.scrollTimer);
          this.scrollTimer = setTimeout(() => this.hold("scroll", false), 180);
        },
        { passive: true },
      );
      // Touch uses native horizontal scrolling when cards overflow. Mouse uses drag.
      let drag = null,
        moved = false;
      track.addEventListener("pointerdown", (event) => {
        if (event.isPrimary === false || event.button > 0) return;
        this.hold("pointer", true);
        moved = false;
        if (this.overflow && event.pointerType === "mouse")
          drag = {
            id: event.pointerId,
            x: event.clientX,
            scroll: track.scrollLeft,
          };
      });
      window.addEventListener("pointermove", (event) => {
        if (!drag || drag.id !== event.pointerId) return;
        const dx = event.clientX - drag.x;
        if (Math.abs(dx) > 8) {
          moved = true;
          track.scrollLeft = drag.scroll - dx;
          track.classList.add("is-dragging");
          event.preventDefault();
        }
      });
      const release = () => {
        drag = null;
        track.classList.remove("is-dragging");
        this.hold("pointer", false);
        if (moved)
          setTimeout(() => {
            moved = false;
          }, 400);
      };
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      window.addEventListener("blur", release);
      track.addEventListener(
        "click",
        (event) => {
          if (moved) {
            event.preventDefault();
            event.stopImmediatePropagation();
            moved = false;
          }
        },
        true,
      );
      track.addEventListener("dragstart", (event) => event.preventDefault());
      attachSwipe(
        track,
        (direction) => {
          if (!this.overflow) this.go(this.index + direction);
        },
        this,
      );
      this.refresh();
      if ("ResizeObserver" in window) {
        this.resizeObserver = new ResizeObserver(() => this.measure());
        this.resizeObserver.observe(track);
      } else window.addEventListener("resize", () => this.measure());
    }
    cancel() {
      this.epoch++;
      this.animations.forEach((animation) => animation.cancel());
      this.animations = [];
      this.track
        .querySelectorAll(".motion-ghost")
        .forEach((node) => node.remove());
      this.busy = false;
      this.hold("animation", false);
    }
    refresh() {
      this.cancel();
      this.items = [...this.track.children];
      this.index = 0;
      this.track.scrollLeft = 0;
      this.measure();
    }
    measure() {
      if (!this.items || this.busy) return;
      // Restore canonical DOM order when crossing a responsive breakpoint.
      const overflow = this.track.scrollWidth > this.track.clientWidth + 2;
      if (overflow !== this.overflow) {
        this.cancel();
        this.track.append(...this.items);
        this.track.scrollLeft = 0;
        this.index = 0;
      }
      this.overflow = overflow;
      const max = Math.max(0, this.track.scrollWidth - this.track.clientWidth);
      const first = this.items[0]?.getBoundingClientRect().right || 0;
      this.positions = this.overflow
        ? [
            ...new Set(
              this.items.map((item) =>
                Math.round(
                  Math.min(
                    max,
                    Math.max(0, first - item.getBoundingClientRect().right),
                  ),
                ),
              ),
            ),
          ]
        : this.items.map((_, i) => i);
      this.count = this.positions.length;
      this.index = Math.min(this.index, Math.max(0, this.count - 1));
      this.tools.hidden = this.count < 2;
      if (this.latest) {
        document.querySelector("#previous").hidden = this.count < 2;
        document.querySelector("#next").hidden = this.count < 2;
      }
      this.dots.innerHTML = this.positions
        .map(
          (_, i) =>
            `<button ${this.latest ? "data-index" : "data-motion-index"}="${i}" aria-label="موقعیت ${fa(i + 1)}" aria-current="${i === this.index}"></button>`,
        )
        .join("");
      this.update();
      this.schedule();
    }
    update() {
      [...this.dots.children].forEach((dot, i) =>
        dot.setAttribute("aria-current", String(i === this.index)),
      );
      this.track.dispatchEvent(
        new CustomEvent("daya:position", { detail: { index: this.index } }),
      );
    }
    async go(index, automatic = false) {
      if (this.busy || this.count < 2) return;
      const target = wrap(index, this.count);
      if (target === this.index) {
        this.schedule();
        return;
      }
      const direction = index < this.index ? -1 : 1;
      if (this.overflow) {
        this.index = target;
        this.track.scrollTo({
          left: this.positions[target] ? -this.positions[target] : 0,
          behavior: reduced.matches ? "instant" : "smooth",
        });
        this.update();
      } else {
        const currentOrder = [...this.track.children];
        const targetItem = this.items[target];
        const offset = currentOrder.indexOf(targetItem);
        if (offset < 0) return;
        // One-card steps slide continuously; direct dot selection cross-fades.
        const single =
          (direction === 1 && offset === 1) ||
          (direction === -1 && offset === currentOrder.length - 1);
        const focus = document.activeElement;
        const epoch = ++this.epoch;
        this.busy = true;
        this.hold("animation", true);
        const reorder = () =>
          this.track.append(
            ...[...this.items.slice(target), ...this.items.slice(0, target)],
          );
        if (!reduced.matches && this.track.animate && currentOrder.length > 1) {
          if (single) {
            const first = currentOrder[0].getBoundingClientRect();
            const second = currentOrder[1].getBoundingClientRect();
            const step = Math.abs(first.left - second.left);
            const ghost = (
              direction === 1 ? currentOrder[0] : currentOrder.at(-1)
            ).cloneNode(true);
            ghost.classList.add("motion-ghost");
            ghost.setAttribute("aria-hidden", "true");
            ghost.setAttribute("inert", "");
            ghost.removeAttribute("id");
            ghost
              .querySelectorAll("[id]")
              .forEach((node) => node.removeAttribute("id"));
            ghost
              .querySelectorAll("button,a,input,[tabindex]")
              .forEach((node) => (node.tabIndex = -1));
            Object.assign(ghost.style, {
              position: "absolute",
              top: "0",
              left: `${direction === 1 ? -step : this.track.clientWidth + (step - first.width)}px`,
              width: `${first.width}px`,
              pointerEvents: "none",
            });
            this.track.append(ghost);
            this.animations = [...currentOrder, ghost].map((card) =>
              card.animate(
                [
                  { transform: "translateX(0)" },
                  { transform: `translateX(${direction * step}px)` },
                ],
                {
                  duration: 420,
                  easing: "cubic-bezier(.22,.61,.36,1)",
                  fill: "forwards",
                },
              ),
            );
          } else
            this.animations = [
              this.track.animate([{ opacity: 1 }, { opacity: 0.35 }], {
                duration: 160,
                fill: "forwards",
              }),
            ];
          await Promise.allSettled(
            this.animations.map((animation) => animation.finished),
          );
        }
        if (epoch !== this.epoch) return;
        reorder();
        this.animations.forEach((animation) => animation.cancel());
        this.animations = [];
        this.track
          .querySelectorAll(".motion-ghost")
          .forEach((node) => node.remove());
        if (!single && !reduced.matches && this.track.animate) {
          this.animations = [
            this.track.animate([{ opacity: 0.35 }, { opacity: 1 }], {
              duration: 180,
              fill: "forwards",
            }),
          ];
          await Promise.allSettled(
            this.animations.map((animation) => animation.finished),
          );
          if (epoch !== this.epoch) return;
          this.animations.forEach((animation) => animation.cancel());
          this.animations = [];
        }
        this.index = target;
        this.busy = false;
        this.hold("animation", false);
        if (this.track.contains(focus)) focus.focus({ preventScroll: true });
        this.update();
      }
      this.announce(this.index, automatic);
      this.schedule();
    }
    next(automatic = false) {
      this.go(this.index + 1, automatic);
    }
  }

  const hero = document.querySelector(".hero");
  if (hero) controllers.set(hero, new Hero(hero));
  for (const [selector, rootSelector, latest] of [
    ["#products-track", "#products", true],
    ["#bestseller-grid", "#bestsellers", false],
    [".style-grid", ".style-collections", false],
    [".magazine-grid", ".magazine", false],
  ]) {
    const track = document.querySelector(selector),
      root = document.querySelector(rootSelector);
    if (track && root) controllers.set(track, new Cards(track, root, latest));
  }
  const syncModal = () => {
    if (!document) return;
    const open = !!document.querySelector("dialog[open]");
    controllers.forEach((controller) => controller.hold("dialog", open));
  };
  const dialog = document.querySelector("dialog");
  if (dialog)
    new MutationObserver(syncModal).observe(dialog, {
      attributes: true,
      attributeFilter: ["open"],
    });
  syncModal();
  reduced.addEventListener("change", () =>
    controllers.forEach((controller) => {
      controller.cancel?.();
      controller.schedule();
    }),
  );
  window.DayaMotion = { controllers, wrap };

  // Progressive enhancement: content remains visible if observation is unsupported.
  if (!reduced.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        ".categories,.collection-promo,.products-section,.bestsellers,.style-collections,.magazine,.faq,.footer-intro",
      )
      .forEach((section) => {
        // Above-the-fold and already visible sections are never hidden on startup.
        if (section.getBoundingClientRect().top > innerHeight) {
          section.classList.add("reveal-section");
          observer.observe(section);
        }
      });
    reduced.addEventListener("change", () => {
      if (reduced.matches)
        document
          .querySelectorAll(".reveal-section")
          .forEach((section) => section.classList.add("is-revealed"));
    });
  }
})();
