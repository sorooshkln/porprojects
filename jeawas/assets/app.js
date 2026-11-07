// slider arrows scroll the track; tabs toggle the active pill
document.querySelectorAll('.sl-btn').forEach((b) =>
  b.addEventListener('click', () => {
    const t = document.getElementById(b.dataset.slider);
    t.scrollBy({ left: -b.dataset.dir * (t.firstElementChild.offsetWidth + 24), behavior: 'smooth' });
  })
);
document.querySelectorAll('.tabs').forEach((g) =>
  g.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    g.querySelectorAll('.tab').forEach((x) => x.classList.toggle('is-on', x === t));
  })
);
