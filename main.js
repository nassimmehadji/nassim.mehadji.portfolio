/* ============================================================
   NASSIM MEHADJI — Portfolio v7 « Atelier »
   GSAP + ScrollTrigger + Lenis
   ============================================================ */
(function () {
  'use strict';
  window.__ready = true;

  var d = document, html = d.documentElement;
  var $ = function (s, p) { return (p || d).querySelector(s); };
  var $$ = function (s, p) { return Array.prototype.slice.call((p || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasG = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;
  var ANIM = hasG && !reduce && !html.classList.contains('no-anim');

  if (!ANIM) { html.classList.add('no-anim'); html.classList.remove('show-loader'); }

  /* ---------------- Always-on features ---------------- */
  function initYear() { $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  function initClock() {
    var els = $$('[data-clock]');
    if (!els.length) return;
    var fmt;
    try { fmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }); } catch (e) { return; }
    var tick = function () { var t = fmt.format(new Date()); els.forEach(function (el) { el.textContent = t; }); };
    tick(); setInterval(tick, 20000);
  }

  function initHeader() {
    var header = $('.site-header'), bar = $('.progress');
    if (!header) return;
    var last = 0;
    var update = function () {
      var y = window.scrollY || html.scrollTop;
      header.classList.toggle('scrolled', y > 30);
      if (y > 400 && y > last + 4) header.classList.add('hidden');
      else if (y < last - 4 || y < 400) header.classList.remove('hidden');
      last = y;
      if (bar) {
        var max = html.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initMobileMenu() {
    var toggle = $('#navToggle'), menu = $('#mobileMenu'), close = $('#mobileClose');
    if (!toggle || !menu) return;
    var open = function () { menu.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); if (lenis) lenis.stop(); else d.body.style.overflow = 'hidden'; };
    var shut = function () { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); d.body.style.overflow = ''; };
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  function initFilter() {
    var bar = $('.filter-bar');
    if (!bar) return;
    var btns = $$('.filter-btn', bar), cards = $$('[data-category]');
    btns.forEach(function (btn) {
      var cat = btn.dataset.filter;
      var n = cat === 'all' ? cards.length : cards.filter(function (c) { return c.dataset.category.split(' ').indexOf(cat) > -1; }).length;
      var sup = d.createElement('sup'); sup.textContent = n; btn.appendChild(sup);
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        var show = cards.filter(function (c) { return cat === 'all' || c.dataset.category.split(' ').indexOf(cat) > -1; });
        var apply = function () {
          cards.forEach(function (c) { c.classList.toggle('hide', show.indexOf(c) === -1); });
          if (ANIM) {
            gsap.fromTo(show, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .9, stagger: .08, ease: 'expo.out' });
            ScrollTrigger.refresh();
          }
        };
        if (ANIM) gsap.to(cards, { autoAlpha: 0, y: 20, duration: .3, ease: 'power2.in', onComplete: apply });
        else apply();
      });
    });
  }

  function initContactForm() {
    var form = $('#contactForm'), ok = $('#formSuccess');
    if (!form || !ok) return;
    form.addEventListener('submit', function (e) {
      if (!form.action || form.action.indexOf('VOTRE_ID') > -1) {
        e.preventDefault();
        form.style.display = 'none';
        ok.style.display = 'block';
        if (ANIM) gsap.from(ok.children, { y: 30, autoAlpha: 0, stagger: .1, duration: 1, ease: 'expo.out' });
      }
    });
  }

  initYear(); initClock(); initHeader(); initMobileMenu(); initFilter(); initContactForm();
  if (!ANIM) return;

  /* ---------------- Animated layer ---------------- */
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add('gsap-on');

  // Lenis smooth scroll
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  $$('[data-top]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });

  // Split text into masked words
  function split(el) {
    if (el.__split) return el.__split;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(' ')); return; }
            var w = d.createElement('span'); w.className = 'w';
            var i = d.createElement('span'); i.className = 'wi'; i.textContent = p;
            w.appendChild(i); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && !n.classList.contains('w')) walk(n);
      });
    };
    walk(el);
    el.__split = $$('.wi', el);
    return el.__split;
  }

  var curtain = $('.curtain'), curtainLabel = $('.curtain-label');
  var showLoader = html.classList.contains('show-loader');
  var introDelay = showLoader ? 0 : 0.55;

  /* Page intro: curtain wipe out */
  function curtainIn() {
    if (!curtain) return;
    if (showLoader) { gsap.set(curtain, { yPercent: 100 }); return; }
    gsap.set(curtain, { yPercent: 0 });
    gsap.to(curtain, { yPercent: -100, duration: 1.05, ease: 'expo.inOut', delay: 0.1 });
    if (curtainLabel) gsap.to(curtainLabel, { yPercent: -60, autoAlpha: 0, duration: .6, ease: 'power3.in' });
  }

  /* Page leave: curtain wipe in, then navigate */
  function initTransitions() {
    if (!curtain) return;
    $$('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank' || /^(mailto|tel|https?):/i.test(href) || /\.pdf$/i.test(href) || a.hasAttribute('download')) return;
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        html.classList.add('is-leaving');
        if (curtainLabel) {
          curtainLabel.textContent = a.dataset.label || a.textContent.trim().split('\n')[0] || '';
          gsap.fromTo(curtainLabel, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .6, ease: 'expo.out', delay: .35 });
        }
        gsap.fromTo(curtain, { yPercent: 100 }, {
          yPercent: 0, duration: .8, ease: 'expo.inOut',
          onComplete: function () { setTimeout(function () { window.location.href = href; }, 180); }
        });
      });
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { html.classList.remove('is-leaving'); gsap.set(curtain, { yPercent: -100 }); }
    });
  }

  /* Loader (home, first visit) */
  function runLoader(done) {
    var loader = $('.loader');
    if (!showLoader || !loader) { done(); return; }
    try { sessionStorage.setItem('nm-loaded', '1'); } catch (e) {}
    if (lenis) lenis.stop();
    var count = $('.loader-count', loader), bar = $('.loader-bar', loader), letters = $$('.loader-name span', loader);
    var o = { v: 0 };
    var tl = gsap.timeline({
      onComplete: function () { loader.style.display = 'none'; html.classList.remove('show-loader'); if (lenis) lenis.start(); }
    });
    tl.from(letters, { yPercent: 110, duration: 1.1, stagger: .045, ease: 'expo.out' }, 0)
      .to(o, { v: 100, duration: 1.8, ease: 'power3.inOut', onUpdate: function () { count.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0.1)
      .to(bar, { scaleX: 1, duration: 1.8, ease: 'power3.inOut' }, 0.1)
      .to(letters, { yPercent: -110, duration: .7, stagger: .02, ease: 'expo.in' }, 2.05)
      .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 2.4)
      .add(done, 2.75);
  }

  /* Home hero intro */
  function heroIntro() {
    var hero = $('.hero');
    if (!hero) return;
    var title = $('.hero-title', hero);
    var words = split(title);
    title.style.visibility = 'visible';
    var tl = gsap.timeline({ delay: showLoader ? 0 : introDelay });
    tl.from(words, { yPercent: 115, rotate: 3, duration: 1.4, stagger: .07, ease: 'expo.out' }, 0)
      .fromTo($$('[data-hero]', hero), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: .08, ease: 'expo.out' }, .35)
      .from('.hero-ring', { scale: 0, rotate: -180, duration: 1.6, ease: 'expo.out' }, .3)
      .from('.hero-orb', { autoAlpha: 0, scale: .6, duration: 2.2, ease: 'power2.out' }, 0);
    // parallax out on scroll
    gsap.to(title, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-ring', { y: 160, rotate: 90, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* Generic reveals */
  function initReveals() {
    $$('[data-split]').forEach(function (el) {
      if (el.closest('.hero')) return;
      var words = split(el);
      el.style.visibility = 'visible';
      var inHero = !!el.closest('.page-hero');
      gsap.from(words, {
        yPercent: 115, rotate: 2, duration: 1.3, stagger: .05, ease: 'expo.out',
        delay: inHero ? introDelay + (parseFloat(el.dataset.delay) || 0) : (parseFloat(el.dataset.delay) || 0),
        scrollTrigger: inHero ? null : { trigger: el, start: 'top 88%', once: true }
      });
    });
    $$('[data-reveal]').forEach(function (el) {
      if (el.hasAttribute('data-hero')) return;
      var inHero = !!el.closest('.page-hero');
      gsap.fromTo(el, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out',
        delay: (inHero ? introDelay + .25 : 0) + (parseFloat(el.dataset.delay) || 0),
        scrollTrigger: inHero ? null : { trigger: el, start: 'top 90%', once: true }
      });
    });
    $$('[data-stagger]').forEach(function (el) {
      gsap.fromTo(el.children, { autoAlpha: 0, y: 50 }, {
        autoAlpha: 1, y: 0, duration: 1.2, stagger: .09, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    $$('[data-highlight]').forEach(function (el) {
      var words = split(el);
      gsap.set(words, { opacity: .14 });
      gsap.to(words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 50%', scrub: .6 } });
    });
    $$('[data-line]').forEach(function (el) {
      gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  }

  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      var target = parseFloat(el.dataset.count), o = { v: 0 };
      var pad = el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0;
      el.textContent = pad ? '0'.padStart(pad, '0') : '0';
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(o, { v: target, duration: 2, ease: 'power3.out', delay: el.closest('.page-hero') ? introDelay : 0, onUpdate: function () {
            var s = String(Math.round(o.v)); el.textContent = pad ? s.padStart(pad, '0') : s;
          } });
        }
      });
    });
  }

  function initBars() {
    $$('.bar i').forEach(function (i) {
      var pct = parseFloat(getComputedStyle(i).getPropertyValue('--pct')) || 0;
      gsap.to(i, { scaleX: pct, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: i, start: 'top 95%', once: true } });
    });
  }

  function initParallax() {
    $$('[data-speed]').forEach(function (el) {
      var s = parseFloat(el.dataset.speed) || 0.1;
      gsap.fromTo(el, { yPercent: -s * 50 }, { yPercent: s * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.proj-thumb:not(.contain) img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  function initMarquee() {
    $$('.marquee-track').forEach(function (track) {
      var tw = gsap.to(track, { xPercent: -50, duration: parseFloat(track.dataset.speed) || 38, ease: 'none', repeat: -1 });
      tw.totalTime(tw.duration() * 500);
      var dir = 1;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          dir = self.direction;
          var v = Math.min(Math.abs(self.getVelocity()) / 350, 5);
          gsap.to(tw, { timeScale: dir * (1 + v), duration: .25, overwrite: true, onComplete: function () { gsap.to(tw, { timeScale: dir, duration: 1.2 }); } });
        }
      });
    });
  }

  function initHorizontal() {
    var pin = $('.hs-pin'), track = $('.hs-track');
    if (!pin || !track) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      var dist = function () { return track.scrollWidth - window.innerWidth; };
      var tw = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: pin, pin: true, scrub: 1, start: 'top top', end: function () { return '+=' + dist(); }, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      gsap.to('.hs-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true } });
      $$('.hs-panel .yr', track).forEach(function (yr) {
        gsap.from(yr, { yPercent: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: yr.closest('.hs-panel'), containerAnimation: tw, start: 'left 85%', once: true } });
      });
    });
  }

  function initStack() {
    var cards = $$('.stack .xp');
    if (cards.length < 2) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      cards.forEach(function (c, i) {
        var next = cards[i + 1];
        if (!next) return;
        gsap.to(c, { scale: 0.94, filter: 'brightness(0.6)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 55%', end: 'top 160px', scrub: true } });
      });
    });
  }

  function initFooter() {
    var name = $('.footer-name');
    if (!name) return;
    var chars = [];
    Array.prototype.slice.call(name.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = d.createDocumentFragment();
        n.textContent.split('').forEach(function (ch) { var s = d.createElement('span'); s.textContent = ch; frag.appendChild(s); chars.push(s); });
        name.replaceChild(frag, n);
      } else if (n.nodeType === 1) chars.push(n);
    });
    gsap.set(name, { overflow: 'hidden' });
    gsap.from(chars, { yPercent: 100, duration: 1.4, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: name, start: 'top 98%', once: true } });
  }

  /* Cursor + magnetic + tilt + hover preview (fine pointer only) */
  function initPointer() {
    if (!finePointer) return;
    var cur = $('.cursor'), dot = $('.cursor-dot'), label = $('.cursor-label');
    if (cur && dot) {
      var cx = gsap.quickTo(cur, 'x', { duration: .55, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .55, ease: 'power3' });
      var dx = gsap.quickTo(dot, 'x', { duration: .1 }), dy = gsap.quickTo(dot, 'y', { duration: .1 });
      window.addEventListener('mousemove', function (e) { if (!html.classList.contains('has-cursor')) { gsap.set([cur, dot], { x: e.clientX, y: e.clientY }); html.classList.add('has-cursor'); } cx(e.clientX); cy(e.clientY); dx(e.clientX); dy(e.clientY); });
      d.addEventListener('mouseleave', function () { gsap.to([cur, dot], { opacity: 0, duration: .3 }); });
      d.addEventListener('mouseenter', function () { gsap.to([cur, dot], { opacity: 1, duration: .3 }); });
      d.addEventListener('mouseover', function (e) {
        var v = e.target.closest('[data-cursor]');
        var h = e.target.closest('a, button, label, input, textarea');
        cur.classList.toggle('is-view', !!v);
        if (v && label) label.textContent = v.dataset.cursor || 'Voir';
        cur.classList.toggle('is-hover', !v && !!h);
      });
    }

    $$('[data-magnetic]').forEach(function (el) {
      var s = parseFloat(el.dataset.magnetic) || 0.3;
      var xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'power3' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * s); yTo((e.clientY - r.top - r.height / 2) * s);
      });
      el.addEventListener('mouseleave', function () { gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' }); });
    });

    $$('[data-tilt]').forEach(function (el) {
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
        gsap.to(el, { rotateY: (px - .5) * 8, rotateX: (.5 - py) * 8, duration: .6, ease: 'power3' });
      });
      el.addEventListener('mouseleave', function () { gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.4)' }); });
    });

    var prev = $('.hover-preview');
    var rows = $$('[data-img]');
    if (prev && rows.length) {
      var imgs = {};
      rows.forEach(function (r) {
        var src = r.dataset.img;
        if (imgs[src]) return;
        var im = new Image(); im.src = src; im.alt = ''; if (r.dataset.cover !== undefined) im.className = 'cover';
        prev.appendChild(im); imgs[src] = im;
      });
      var px = gsap.quickTo(prev, 'x', { duration: .7, ease: 'power3' }), py = gsap.quickTo(prev, 'y', { duration: .7, ease: 'power3' });
      var rot = gsap.quickTo(prev, 'rotate', { duration: .8, ease: 'power3' });
      var lastX = 0;
      window.addEventListener('mousemove', function (e) { px(e.clientX + 30); py(e.clientY - 120); rot(Math.max(-12, Math.min(12, (e.clientX - lastX) * .6))); lastX = e.clientX; });
      rows.forEach(function (r) {
        r.addEventListener('mouseenter', function () {
          Object.keys(imgs).forEach(function (k) { imgs[k].classList.toggle('on', k === r.dataset.img); });
          gsap.to(prev, { autoAlpha: 1, scale: 1, duration: .5, ease: 'expo.out' });
        });
        r.addEventListener('mouseleave', function () { gsap.to(prev, { autoAlpha: 0, scale: .6, duration: .4, ease: 'power3.in' }); });
      });
    }
  }

  function initMobileMenuAnim() { /* handled in CSS */ }

  /* Boot */
  curtainIn();
  initTransitions();
  initPointer();
  runLoader(function () {
    heroIntro();
  });
  initReveals();
  initCounters();
  initBars();
  initParallax();
  initMarquee();
  initHorizontal();
  initStack();
  initFooter();
  initMobileMenuAnim();

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
