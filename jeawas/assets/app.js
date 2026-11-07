// product sliders: arrows, progress thumb, autoplay (pauses on hover/touch/hidden tab), staggered entrance
const root = document.documentElement;
root.classList.add('js');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.track').forEach((t) => {
  const step = () => t.firstElementChild.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 24);
  const max = () => t.scrollWidth - t.clientWidth;
  const dots = t.closest('section')?.querySelector('.dots');
  [...t.children].forEach((c, i) => c.style.setProperty('--i', i % 4));

  // RTL: scrollLeft is 0 at the start and goes negative toward the end
  const progress = () => {
    if (dots) dots.style.setProperty('--p', max() > 0 ? Math.min(1, Math.abs(t.scrollLeft) / max()) : 0);
  };
  t.addEventListener('scroll', progress, { passive: true });
  progress();

  const next = () => {
    // wrap back to the first card after the last one
    if (Math.abs(t.scrollLeft) >= max() - 2) t.scrollTo({ left: 0 });
    else t.scrollBy({ left: -step() });
  };
  document.querySelectorAll(`[data-slider="${t.id}"]`).forEach((b) =>
    b.addEventListener('click', () => {
      stop();
      t.scrollBy({ left: -b.dataset.dir * step() });
    })
  );

  let timer;
  const play = () => { if (!still && max() > 0 && !timer) timer = setInterval(next, 3800); };
  const stop = () => { clearInterval(timer); timer = 0; };
  let visible = false;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) t.classList.add('in');
    visible ? play() : stop();
  }, { threshold: 0.25 }).observe(t);
  ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => t.addEventListener(ev, stop, { passive: true }));
  ['mouseleave', 'focusout'].forEach((ev) => t.addEventListener(ev, () => visible && play()));
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : visible && play()));
});

document.querySelectorAll('.tabs').forEach((g) =>
  g.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    g.querySelectorAll('.tab').forEach((x) => x.classList.toggle('is-on', x === t));
  })
);
