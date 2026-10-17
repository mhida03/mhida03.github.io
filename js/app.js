/* ============================================================
   Portfolio Motie Hida — logique principale
   ============================================================ */
const ROOT = document.documentElement;
const BASE = ROOT.dataset.base || '';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) ROOT.classList.add('reduced');
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k) } catch { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch {} }
};
let LANG = ROOT.dataset.lang || 'fr';
const T = (fr, en) => (LANG === 'en' ? en : fr);
const SITE_ROOT = new URL(BASE || './', location.href);
const img = p => new URL('assets/' + p, SITE_ROOT).href;
/* Sur le site hébergé, l'adresse suit la langue (/ ou /en/) */
function syncUrl(l) {
  try {
    if (window.top !== window || !/^https?:$/.test(location.protocol)) return;
    const target = new URL(l === 'en' ? 'en/' : './', SITE_ROOT);
    if (target.pathname !== location.pathname) history.replaceState(null, '', target.pathname + location.hash);
  } catch {}
}

/* ===================== Textes de l'interface (JS) ===================== */
const UI = {
  steps: { fr: ['compilation du monde…', 'chargement des particules…', 'assemblage du portrait…', 'prêt.'],
           en: ['compiling the world…', 'loading particles…', 'assembling the portrait…', 'ready.'] },
  open: { fr: 'Ouvrir', en: 'Open' },
  photos: { fr: n => n + ' visuel' + (n > 1 ? 's' : ''), en: n => n + ' image' + (n > 1 ? 's' : '') },
  copied: { fr: 'Adresse copiée : ', en: 'Address copied: ' },
  copyLabel: { fr: 'Copier l’adresse e-mail motiehida1@gmail.com', en: 'Copy the email address motiehida1@gmail.com' },
  menu: { fr: ['Menu', 'Fermer'], en: ['Menu', 'Close'] },
  prev: { fr: 'Image précédente', en: 'Previous image' },
  next: { fr: 'Image suivante', en: 'Next image' },
  mailSubject: { fr: 'Opportunité pour Motie Hida', en: 'Opportunity for Motie Hida' }
};
const u = k => UI[k][LANG];

const projWrap = $('#projects');
function renderProjects() {
  projWrap.innerHTML = PROJECTS.map(projectCardHTML).join('');
  $$('.project-visual:not(:has(img))', projWrap).forEach(el => vio && vio.observe(el));
}

/* Modale avec galerie */
const modal = $('#modal'), mVis = $('#modal-visual'), mThumbs = $('#modal-thumbs'), mBody = $('#modal-body');
let current = null, slide = 0;
function showSlide(i) {
  const p = current; if (!p.images) return;
  slide = (i + p.images.length) % p.images.length;
  const [src, ...cap] = p.images[slide];
  mVis.innerHTML = `<img src="${img(src)}" alt="${L(cap)}">` + (p.images.length > 1
    ? `<div class="gallery-nav"><button type="button" data-g="-1" aria-label="${u('prev')}">‹</button><button type="button" data-g="1" aria-label="${u('next')}">›</button></div>` : '');
  $$('.thumbs button', mThumbs).forEach((t, k) => t.setAttribute('aria-current', k === slide));
  const c = $('.caption', mThumbs); if (c) c.textContent = `${slide + 1} / ${p.images.length} · ${L(cap)}`;
}
function openProject(id) {
  current = PROJECTS.find(x => x.id === id);
  const p = current;
  modal.classList.toggle('has-gallery', !!p.images);
  if (p.images) {
    mThumbs.innerHTML = (p.images.length > 1 ? `<div class="thumbs">${p.images.map((im, k) => `<button type="button" data-t="${k}" aria-label="${L(im.slice(1))}"><img src="${img(im[0])}" alt=""></button>`).join('')}</div>` : '') + '<p class="caption"></p>';
    showSlide(0);
  } else {
    mThumbs.innerHTML = '';
    mVis.innerHTML = VISUALS[p.id]();
    requestAnimationFrame(() => mVis.classList.add('in-view'));
  }
  mBody.innerHTML = `<p class="project-meta">${L(p.meta)}</p><h3 id="modal-title">${L(p.title)}</h3><p style="color:var(--steel)">${L(p.desc)}</p><ul>${L(p.details).map(d => `<li>${d}</li>`).join('')}</ul><div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}
projWrap.addEventListener('click', e => { const c = e.target.closest('.project'); if (c) openProject(c.dataset.id) });
mVis.addEventListener('click', e => { const g = e.target.closest('[data-g]'); if (g) showSlide(slide + +g.dataset.g) });
mThumbs.addEventListener('click', e => { const t = e.target.closest('[data-t]'); if (t) showSlide(+t.dataset.t) });
modal.addEventListener('keydown', e => { if (current?.images && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); showSlide(slide + (e.key === 'ArrowRight' ? 1 : -1)) } });
$('#modal-close').onclick = () => modal.close();
modal.addEventListener('click', e => { if (e.target === modal) modal.close() });
modal.addEventListener('close', () => mVis.classList.remove('in-view'));

/* ===================== Coulisses : anneau 3D ===================== */
const ring = $('#ring'), stage = $('#ring-stage');
let ringAngle = 0, ringVel = 0, ringScroll = 0;
function buildRing() {
  const n = MOMENTS.length;
  const cw = Math.max(150, Math.min(240, innerWidth * .2));
  const r = Math.round((cw + 26) / 2 / Math.tan(Math.PI / n));
  ring.style.setProperty('--cw', cw + 'px');
  ring.innerHTML = MOMENTS.map((m, i) => momentHTML(m, `transform:rotateY(${i * 360 / n}deg) translateZ(${r}px)`)).join('');
  ring.dataset.r = r;
}
function ringLoop() {
  const r = +ring.dataset.r || 600;
  if (!dragging) ringVel *= .94;
  ringAngle += ringVel + (reduced ? 0 : .04);
  const total = ringAngle + ringScroll;
  ring.style.transform = `translateZ(${-r}px) rotateX(-6deg) rotateY(${total}deg)`;
  const n = MOMENTS.length;
  $$('figure', ring).forEach((f, i) => {
    let a = ((i * 360 / n + total) % 360 + 360) % 360; if (a > 180) a -= 360;
    const k = 1 - Math.min(1, Math.abs(a) / 120);
    f.style.filter = `brightness(${.35 + .65 * k}) grayscale(${1 - k})`;
  });
  requestAnimationFrame(ringLoop);
}
let dragging = false, lastX = 0;
stage.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId) });
stage.addEventListener('pointermove', e => { if (!dragging) return; ringVel = (e.clientX - lastX) * .25; lastX = e.clientX });
addEventListener('pointerup', () => dragging = false);

/* ===================== Langue ===================== */
const ORIG = new Map(), ORIG_ATTR = [];
$$('[data-i18n]').forEach(el => ORIG.set(el, el.innerHTML));
$$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
  const [attr, key] = pair.split(':'); ORIG_ATTR.push({ el, attr, key, fr: el.getAttribute(attr) });
}));
function splitTitles() {
  $$('.h2.split').forEach(h => { if (!h.querySelector('.line')) h.innerHTML = `<span class="line"><span>${h.innerHTML}</span></span>` });
  const man = $('#manifesto');
  man.innerHTML = man.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
}
function applyLang(l, first) {
  LANG = l;
  const D = window.I18N_EN || {};
  ORIG.forEach((fr, el) => {
    const k = el.dataset.i18n;
    const v = l === 'en' && D[k] != null ? D[k] : fr;
    if (el.tagName === 'TITLE') document.title = v.replace(/&amp;/g, '&'); else el.innerHTML = v;
  });
  ORIG_ATTR.forEach(o => o.el.setAttribute(o.attr, l === 'en' && D[o.key] != null ? D[o.key] : o.fr));
  ROOT.lang = l;
  syncUrl(l);
  $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.setLang === l));
  $('#copy-mail').setAttribute('aria-label', u('copyLabel'));
  $('.btn.primary[href^="mailto:"]').href = 'mailto:motiehida1@gmail.com?subject=' + encodeURIComponent(u('mailSubject'));
  menuBtn.textContent = u('menu')[nav.classList.contains('open') ? 1 : 0];
  splitTitles();
  renderProjects();
  buildRing();
  if (!first) { lightManifesto(); if (window.ScrollTrigger) ScrollTrigger.refresh(); termWelcome(true) }
}
$$('[data-set-lang]').forEach(b => b.addEventListener('click', () => {
  const l = b.dataset.setLang; if (l === LANG) return;
  store.set('lang', l);
  ROOT.classList.add('swapping');
  setTimeout(() => { applyLang(l); ROOT.classList.remove('swapping') }, 220);
}));

/* ===================== Utilitaires ===================== */
$('#year').textContent = new Date().getFullYear();
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200) };

function fitHero() {
  $$('.hero-name.fit').forEach(el => {
    el.style.fontSize = '100px';
    const w = $('.chars', el).getBoundingClientRect().width;
    const target = innerWidth * (innerWidth < 760 ? .94 : .96);
    el.style.fontSize = Math.min(100 * target / w, innerHeight * (innerWidth < 760 ? .34 : .46)) + 'px';
  });
}
$$('.hero-name .chars').forEach(s => {
  s.innerHTML = [...s.textContent].map(c => c === ' ' ? '<span class="char">&nbsp;</span>' : `<span class="char">${c}</span>`).join('');
});

/* Navigation */
const nav = $('#nav'), menuBtn = $('#menu-btn');
menuBtn.onclick = () => { const o = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); menuBtn.textContent = u('menu')[o ? 1 : 0] };

/* Observateur de visibilité (dessins SVG, barres) */
const vio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in-view'); vio.unobserve(en.target) } }), { threshold: .25 });

/* Premier rendu dans la bonne langue */
const saved = store.get('lang');
applyLang(saved === 'en' || saved === 'fr' ? saved : LANG, true);
$$('.edu article').forEach(el => vio.observe(el));

/* ===================== Préchargeur + introduction ===================== */
const loader = $('#loader');
function intro() {
  if (intro.done) return; intro.done = true;
  fitHero();
  if (typeof gsap === 'undefined' || reduced) { loader.classList.add('done'); return }
  const steps = u('steps'), o = { v: 0 };
  gsap.to('.loader-bar i', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' });
  gsap.to(o, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate() {
    $('#loader-count').textContent = String(Math.round(o.v)).padStart(3, '0');
    $('#loader-step').textContent = steps[Math.min(3, Math.floor(o.v / 26))];
  }, onComplete() {
    loader.classList.add('done');
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero-name.solid .char', { yPercent: 110, opacity: 0, duration: 1.4, stagger: .05 })
      .from('.hero-photo', { y: 120, opacity: 0, scale: 1.08, duration: 1.6 }, '-=1.2')
      .from('.hero-name.ghost .char', { opacity: 0, duration: 1.2, stagger: .04 }, '-=1')
      .from('.roles li,.hero-intro,.hero-foot > *,.nav', { y: 24, opacity: 0, duration: 1, stagger: .06, clearProps: 'transform,opacity' }, '-=1.1');
    window.__world && window.__world.burst();
  } });
}
document.fonts && document.fonts.ready ? document.fonts.ready.then(intro) : addEventListener('load', intro);
setTimeout(intro, 4000);
addEventListener('resize', () => { fitHero(); clearTimeout(buildRing._t); buildRing._t = setTimeout(buildRing, 200) });

/* Rôles qui tournent */
let ri = 0;
setInterval(() => { const roles = $$('#roles li'); roles[ri].classList.remove('on'); ri = (ri + 1) % roles.length; roles[ri].classList.add('on') }, 2000);

/* ===================== Défilement ===================== */
let lenis = null;
if (!reduced && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: .09, smoothWheel: true });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf) }; requestAnimationFrame(raf);
  if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const id = a.getAttribute('href'), t = id.length > 1 && document.querySelector(id); if (!t) return;
  e.preventDefault(); nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = u('menu')[0];
  lenis ? lenis.scrollTo(t, { offset: id === '#top' ? 0 : -20, duration: 1.4 }) : t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
});

let lastY = 0;
const progress = $('.progress');
function onScroll() {
  const y = scrollY;
  nav.classList.toggle('solid', y > 40);
  nav.classList.toggle('hide', y > lastY && y > 400 && !nav.classList.contains('open'));
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  window.__world && window.__world.scroll(y / innerHeight);
}
addEventListener('scroll', onScroll, { passive: true });

const links = $$('.nav-links a');
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id)) }), { rootMargin: '-45% 0px -50% 0px' });
['profil', 'parcours', 'projets', 'competences', 'coulisses', 'contact'].forEach(id => io.observe(document.getElementById(id)));

let manTrigger = null;
function lightManifesto() {
  const words = $$('#manifesto .w');
  if (!manTrigger) { words.forEach(w => w.style.color = 'var(--bone)'); return }
  const n = Math.round(manTrigger.progress * words.length);
  words.forEach((w, i) => w.style.color = i < n ? 'var(--bone)' : '');
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.hero-layer[data-depth="0.35"]', { yPercent: -18, scale: .92, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-layer[data-depth="0.7"]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-layer[data-depth="1"]', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('.h2 .line > span, .contact-title .line > span').forEach(s => {
    gsap.from(s, { yPercent: 105, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: s.parentElement, start: 'top 88%' } });
  });
  manTrigger = ScrollTrigger.create({ trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: lightManifesto });
  gsap.utils.toArray('.reveal').forEach((el, i) => gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', delay: (i % 3) * .08, scrollTrigger: { trigger: el, start: 'top 88%' } }));
  $$('.count').forEach(c => {
    const o = { v: 0 };
    gsap.to(o, { v: +c.dataset.to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%' }, onStart() { c.textContent = '0' }, onUpdate() { c.textContent = Math.round(o.v) } });
  });
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': function () {
      const track = $('#journey-track');
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#journey-pin', start: 'top 12%', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: s => $('#journey-bar').style.transform = `scaleX(${s.progress})` } });
    }
  });
  ScrollTrigger.create({ trigger: '#coulisses', start: 'top bottom', end: 'bottom top', scrub: true, onUpdate: s => ringScroll = s.progress * -140 });
  gsap.from('.contact-row .btn', { y: 30, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact-row', start: 'top 90%' } });
} else {
  lightManifesto();
}
ringLoop();

/* ===================== Parallaxe 3D du hero ===================== */
const hero = $('.hero'), layers = $$('.hero-layer');
let mx = 0, my = 0, cx = 0, cy = 0;
if (fine && !reduced) {
  hero.addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5 });
  hero.addEventListener('pointerleave', () => { mx = 0; my = 0 });
  (function loop() {
    cx += (mx - cx) * .06; cy += (my - cy) * .06;
    layers.forEach(l => { const d = +l.dataset.depth; l.style.translate = `${cx * -40 * d}px ${cy * -24 * d}px`; l.style.rotate = `y ${cx * 6 * d}deg` });
    requestAnimationFrame(loop);
  })();
}

/* ===================== Curseur, magnétisme, inclinaison ===================== */
if (fine && !reduced) {
  const dot = $('.cursor'), ringC = $('.cursor-ring');
  let x = -100, y = -100, rx = x, ry = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x - 3}px,${y - 3}px)` });
  (function r() { rx += (x - rx) * .18; ry += (y - ry) * .18; ringC.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(r) })();
  document.addEventListener('pointerover', e => {
    const v = e.target.closest('[data-cursor="view"]'), h = e.target.closest('a,button,.chip,input,.sphere-wrap,.ring-stage');
    ringC.classList.toggle('is-view', !!v); ringC.textContent = v ? u('open') : '';
    ringC.classList.toggle('is-hover', !v && !!h);
  });
  document.addEventListener('pointermove', e => {
    const m = e.target.closest('.magnetic');
    $$('.magnetic.pulled').forEach(o => { if (o !== m) { o.classList.remove('pulled'); o.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; o.style.transform = ''; setTimeout(() => o.style.transition = '', 600) } });
    if (m) { const r = m.getBoundingClientRect(); m.classList.add('pulled'); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)` }
    const t = e.target.closest('.tilt');
    $$('.tilt.tilting').forEach(o => { if (o !== t) { o.classList.remove('tilting'); o.style.transform = '' } });
    if (!t) return;
    const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    t.classList.add('tilting');
    t.style.transform = `perspective(1000px) rotateY(${(px - .5) * 8}deg) rotateX(${(.5 - py) * 8}deg)`;
    t.style.setProperty('--mx', px * 100 + '%'); t.style.setProperty('--my', py * 100 + '%');
  });
}

/* ===================== Sphère de compétences 3D ===================== */
(function () {
  const words = ['Java', 'Spring Boot', 'Angular', 'React', 'PHP', 'Symfony', 'Laravel', 'TypeScript', 'MySQL', 'Docker', 'Kubernetes', 'Odoo', 'n8n', 'OpenAI', 'REST', 'Microservices', 'JUnit', 'TDD', 'SonarQube', 'GitHub Actions', 'Grafana', 'Prometheus', 'Hibernate', 'MongoDB', 'Scrum', 'GCP', 'AWS', 'Python', 'ASP.NET', 'DDD', 'Java EE', 'Jenkins', 'Ansible', 'JavaScript'];
  const core = new Set(['Java', 'Spring Boot', 'Angular', 'React', 'Symfony', 'Laravel', 'Odoo']);
  const s = $('#sphere'), wrap = $('#sphere-wrap');
  const N = words.length, pts = words.map((w, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / N), th = Math.sqrt(N * Math.PI) * phi;
    const el = document.createElement('span'); el.textContent = w; if (core.has(w)) el.className = 'core'; s.appendChild(el);
    return { x: Math.cos(th) * Math.sin(phi), y: Math.sin(th) * Math.sin(phi), z: Math.cos(phi), el };
  });
  let ax = .003, ay = .005, drag = false, lx = 0, ly = 0, visible = false;
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(wrap);
  wrap.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; wrap.setPointerCapture(e.pointerId) });
  wrap.addEventListener('pointermove', e => { if (!drag) return; ay = (e.clientX - lx) * .0009; ax = (e.clientY - ly) * -.0009; lx = e.clientX; ly = e.clientY });
  addEventListener('pointerup', () => drag = false);
  let first = true;
  function rot() {
    if (visible || first) {
      first = false;
      const R = wrap.clientWidth * .4, cX = Math.cos(ax), sX = Math.sin(ax), cY = Math.cos(ay), sY = Math.sin(ay);
      pts.forEach(p => {
        let y = p.y * cX - p.z * sX, z = p.y * sX + p.z * cX; p.y = y; p.z = z;
        const x = p.x * cY + p.z * sY; z = -p.x * sY + p.z * cY; p.x = x; p.z = z;
        p.el.style.transform = `translate(-50%,-50%) translate3d(${p.x * R}px,${p.y * R}px,0) scale(${(p.z + 2) / 3})`;
        p.el.style.opacity = (.18 + .82 * (p.z + 1) / 2).toFixed(2);
        p.el.style.zIndex = Math.round(p.z * 100) + 100;
      });
      if (!drag) { ax += (.002 - ax) * .02; ay += (.004 - ay) * .02 }
    }
    if (!reduced) requestAnimationFrame(rot);
  }
  rot();
})();

$$('.skill-cat button').forEach(b => b.addEventListener('click', () => {
  const c = b.closest('.skill-cat'), o = c.hasAttribute('data-open');
  o ? c.removeAttribute('data-open') : c.setAttribute('data-open', ''); b.setAttribute('aria-expanded', !o);
}));

/* ===================== Terminal ===================== */
const out = $('#term-out'), form = $('#term-form'), input = $('#term-input');
const hist = []; let hi = 0;
const CMD = {
  help: () => T(`Commandes disponibles :
  <span class="em">whoami</span>       qui je suis
  <span class="em">experience</span>   mon parcours professionnel
  <span class="em">projects</span>     mes projets
  <span class="em">skills</span>       mes compétences
  <span class="em">education</span>    ma formation
  <span class="em">contact</span>      comment me joindre
  <span class="em">cv</span>           télécharger mon CV
  <span class="em">lang en</span>      switch to English
  <span class="em">clear</span>        effacer l’écran
<span class="dim">Astuce : flèche haut pour l’historique, Tab pour compléter.</span>`, `Available commands:
  <span class="em">whoami</span>       who I am
  <span class="em">experience</span>   my work history
  <span class="em">projects</span>     my projects
  <span class="em">skills</span>       my skills
  <span class="em">education</span>    my education
  <span class="em">contact</span>      how to reach me
  <span class="em">cv</span>           download my résumé
  <span class="em">lang fr</span>      passer en français
  <span class="em">clear</span>        clear the screen
<span class="dim">Tip: up arrow for history, Tab to autocomplete.</span>`),
  whoami: () => T(`<span class="ok">Motie Hida</span> — ingénieur d’État (EHEI, 2026), développeur Full Stack.
Java/Spring Boot · PHP/Symfony & Laravel · Angular · React · Odoo · agents IA.
Basé à Tanger. <span class="ok">Disponible immédiatement pour un CDI.</span>`, `<span class="ok">Motie Hida</span> — state-certified software engineer (EHEI, 2026), Full Stack developer.
Java/Spring Boot · PHP/Symfony & Laravel · Angular · React · Odoo · AI agents.
Based in Tangier, Morocco. <span class="ok">Available now for a permanent role.</span>`),
  experience: () => T(`<span class="em">2026 →</span>  Dromiss by SMODU · Odoo / ERP et agents IA · Tanger
<span class="em">2026</span>     SILAMIR Grand Ouest · PFE Java/Spring, système critique · Rennes
<span class="em">2025</span>     SQLI · plateforme d’e-signature Spring + React · Oujda
<span class="em">2023</span>     Préfecture d’Oujda · Laravel, 300 000+ enregistrements`, `<span class="em">2026 →</span>  Dromiss by SMODU · Odoo / ERP and AI agents · Tangier
<span class="em">2026</span>     SILAMIR Grand Ouest · final-year Java/Spring, critical system · Rennes
<span class="em">2025</span>     SQLI · Spring + React e-signature platform · Oujda
<span class="em">2023</span>     Oujda Prefecture · Laravel, 300,000+ records`),
  projects: () => PROJECTS.map(p => `<span class="em">▸</span> ${L(p.title)} <span class="dim">(${p.tags.slice(0, 3).join(', ')})</span>`).join('\n') + `\n<span class="dim">${T('Détails et captures : section Projets.', 'Details and screenshots: Projects section.')}</span>`,
  skills: () => `backend   Java, Spring Boot, Java EE, PHP, Symfony, Laravel, REST, microservices
frontend  Angular, TypeScript, React, JavaScript, HTML5, CSS3
data/ai   MySQL, MongoDB, JPA/Hibernate, machine learning
devops    Docker, Kubernetes, GCP/AWS, GitHub Actions, Jenkins, Ansible, Grafana
auto/erp  n8n, OpenAI API, Odoo
quality   JUnit, TDD, SonarQube, Scrum`,
  education: () => T(`<span class="em">2023–2026</span> EHEI · Ingénieur d’État en génie informatique
<span class="em">2021–2023</span> OFPPT · Technicien spécialisé, développement digital
<span class="em">2026</span>      Odoo Functional Certification`, `<span class="em">2023–2026</span> EHEI · State Engineering Degree, Computer Science
<span class="em">2021–2023</span> OFPPT · Specialised Technician, Digital Development
<span class="em">2026</span>      Odoo Functional Certification`),
  contact: () => `e-mail    <a href="mailto:motiehida1@gmail.com">motiehida1@gmail.com</a>
linkedin  <a href="https://www.linkedin.com/in/motie-hida" target="_blank" rel="noopener">linkedin.com/in/motie-hida</a>
${T('tél.', 'phone')}     <a href="tel:+212706146185">+212 706 146 185</a>`,
  cv: () => { const a = document.createElement('a'); a.href = new URL('assets/CV_Motie_HIDA.pdf', SITE_ROOT).href; a.download = ''; a.click(); return `<span class="ok">${T('Téléchargement du CV lancé.', 'Résumé download started.')}</span>` },
  ls: () => 'experience/  projects/  skills/  cv.pdf  contact.txt',
  date: () => new Date().toLocaleString(LANG === 'en' ? 'en-GB' : 'fr-FR'),
  'lang fr': () => { $('[data-set-lang="fr"]').click(); return '<span class="ok">Langue : français.</span>' },
  'lang en': () => { $('[data-set-lang="en"]').click(); return '<span class="ok">Language: English.</span>' },
  'sudo hire motie': () => { celebrate(); return T(`<span class="ok">[sudo] accès accordé.</span>
Excellent choix. Écrivez-moi : <a href="mailto:motiehida1@gmail.com">motiehida1@gmail.com</a>`, `<span class="ok">[sudo] access granted.</span>
Great choice. Write to me: <a href="mailto:motiehida1@gmail.com">motiehida1@gmail.com</a>`) },
  sudo: () => T('Essayez plutôt : <span class="em">sudo hire motie</span>', 'Try this instead: <span class="em">sudo hire motie</span>'),
  'rm -rf /': () => T('<span class="em">Bien tenté.</span> Ce portfolio a une couverture de tests à 80 %.', '<span class="em">Nice try.</span> This portfolio has 80% test coverage.')
};
const print = (html, cls) => { const d = document.createElement('div'); d.style.whiteSpace = 'pre-wrap'; if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight };
function run(raw) {
  const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  print(`<span class="em">motie@portfolio:~$</span> ${raw.replace(/</g, '&lt;')}`);
  if (!cmd) return;
  hist.push(raw); hi = hist.length;
  if (cmd === 'clear') { out.innerHTML = ''; return }
  const f = CMD[cmd];
  print(f ? f() : T(`Commande introuvable : ${cmd.replace(/</g, '&lt;')}. Tapez <span class="em">help</span> pour la liste.`, `Command not found: ${cmd.replace(/</g, '&lt;')}. Type <span class="em">help</span> for the list.`));
}
function termWelcome(swap) {
  if (swap) print(`<span class="dim">— ${T('langue : français', 'language: English')} —</span>`);
  else print(T(`Bienvenue dans le terminal de <span class="ok">Motie Hida</span>.\nTapez <span class="em">help</span> pour commencer.`, `Welcome to <span class="ok">Motie Hida</span>’s terminal.\nType <span class="em">help</span> to start.`));
}
form.addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = '' });
input.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi] } }
  if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi] } else { hi = hist.length; input.value = '' } }
  if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(CMD).find(k => k.startsWith(input.value.toLowerCase())); if (m) input.value = m }
});
$('#chips').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { run(c.textContent); input.focus({ preventScroll: true }) } });
termWelcome(false);
$('#term').addEventListener('click', () => input.focus({ preventScroll: true }));

function celebrate() {
  if (reduced) return;
  const c = document.createElement('canvas'); c.style.cssText = 'position:fixed;inset:0;z-index:170;pointer-events:none'; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
  const g = c.getContext('2d'), P = Array.from({ length: 160 }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 6, s: Math.random() * 6 + 3, r: Math.random() * 6, c: ['#ff4a1c', '#ece8e1', '#3ddc84'][Math.floor(Math.random() * 3)] }));
  let t = 0; (function f() { g.clearRect(0, 0, c.width, c.height); P.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += .1; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); g.restore() }); if (++t < 160) requestAnimationFrame(f); else c.remove() })();
}

$('#copy-mail').addEventListener('click', async e => {
  const m = e.currentTarget.dataset.mail;
  try { await navigator.clipboard.writeText(m); toast(u('copied') + m) }
  catch { const r = document.createRange(); r.selectNodeContents(e.currentTarget.firstChild.parentNode); getSelection().removeAllRanges(); getSelection().addRange(r) }
});
