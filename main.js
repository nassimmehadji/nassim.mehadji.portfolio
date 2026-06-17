/* ============================================================
   NASSIM MEHADJI — Portfolio v5 "Nocturne"
   ============================================================ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  /* Lenis smooth scroll */
  function initSmoothScroll() {
    if (prefersReduced || typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id && id.length > 1) {
          const t = document.querySelector(id);
          if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80, duration: 1.2 }); }
        }
      });
    });
    window.__lenis = lenis;
  }

  /* Header scroll state */
  function initHeader() {
    const header = $('.site-header');
    if (!header) return;
    const update = () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* Mobile menu */
  function initMobileMenu() {
    const toggle = $('#navToggle');
    const menu = $('#mobileMenu');
    const closeBtn = $('#mobileClose');
    if (!toggle || !menu) return;
    const open = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };
    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    $$('.mobile-nav a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* Reveals */
  function initReveals() {
    if (prefersReduced) {
      $$('.reveal, .stagger').forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    $$('.reveal, .stagger').forEach((el) => io.observe(el));
  }

  /* Magnetic buttons */
  function initMagnetic() {
    if (prefersReduced) return;
    $$('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.22;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* Skill bars */
  function initSkillBars() {
    const bars = $$('.skill-bar-fill');
    if (!bars.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pct = entry.target.dataset.pct || '0';
            requestAnimationFrame(() => { entry.target.style.width = pct + '%'; });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((b) => io.observe(b));
  }

  /* Counters */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* Projects filter */
  function initFilter() {
    const bar = $('.filter-bar');
    if (!bar) return;
    const buttons = $$('.filter-btn', bar);
    const cards = $$('[data-category]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        buttons.forEach((b) => b.classList.toggle('active', b === btn));
        cards.forEach((card) => {
          const match = cat === 'all' || (card.dataset.category || '').split(' ').includes(cat);
          card.style.display = match ? '' : 'none';
          if (match) {
            card.classList.remove('visible');
            void card.offsetWidth;
            card.classList.add('visible');
          }
        });
      });
    });
  }

  /* Project modal */
  function initModal() {
    const overlay = $('#projectModal');
    if (!overlay) return;
    const body = $('#modalBody', overlay);

    const open = (card) => {
      const d = {
        title: card.dataset.title || card.querySelector('h3')?.textContent || '',
        subtitle: card.dataset.subtitle || '',
        year: card.dataset.year || '',
        role: card.dataset.role || '',
        description: card.dataset.description || '',
        image: card.dataset.image || '',
        tags: (card.dataset.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
        images: (card.dataset.images || '').split(',').map((s) => s.trim()).filter(Boolean),
        link: card.dataset.link || '',
        linkLabel: card.dataset.linkLabel || 'Voir le site',
        isPhoto: card.classList.contains('bento-photo'),
      };
      body.innerHTML = renderModal(d);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      const gal = $('.gallery-carousel', body);
      if (gal && d.images.length > 1) initGallery(gal);
    };

    const close = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    const renderModal = (d) => {
      const heroImg = d.image || d.images[0] || '';
      const mediaClass = d.isPhoto ? 'modal-media modal-media-photo' : 'modal-media';
      const gallery = d.images && d.images.length > 1
        ? `<div class="gallery-section">
             <div class="gallery-carousel" tabindex="0">
               <div class="gallery-track">
                 ${d.images.map((src, i) =>
                   `<div class="gallery-slide"><img src="${src}" alt="${d.title} ${i + 1}" loading="lazy"></div>`
                 ).join('')}
               </div>
               <button class="gallery-btn gallery-prev" aria-label="Précédent"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
               <button class="gallery-btn gallery-next" aria-label="Suivant"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
               <div class="gallery-dots">${d.images.map((_, i) => `<span class="gallery-dot${i === 0 ? ' active' : ''}"></span>`).join('')}</div>
             </div>
             <div class="gallery-counter"><span class="gc-current">1</span> / ${d.images.length}</div>
           </div>`
        : '';

      const ctaRow = d.link
        ? `<div class="modal-cta-row">
             <a href="${d.link}" target="_blank" rel="noopener" class="modal-cta">
               <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
               ${d.linkLabel}
             </a>
           </div>`
        : '';

      return `
        ${heroImg ? `<div class="${mediaClass}"><img src="${heroImg}" alt="${d.title}"></div>` : ''}
        <div class="modal-body">
          <div class="modal-header">
            <h2>${d.title}</h2>
            <button class="modal-close" aria-label="Fermer"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
          ${d.year || d.role ? `<div class="modal-meta" style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-mute); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:14px;">${[d.year, d.role].filter(Boolean).join(' · ')}</div>` : ''}
          ${d.tags.length ? `<div class="modal-tags">${d.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
          ${d.description ? `<div class="modal-desc">${d.description.split('\n').map((p) => `<p style="margin:0 0 10px;">${p}</p>`).join('')}</div>` : ''}
          ${gallery}
          ${ctaRow}
        </div>
      `;
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
      if (e.target.closest('.modal-close')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    $$('[data-project]').forEach((card) => {
      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });
  }

  function initGallery(gal) {
    const track = $('.gallery-track', gal);
    const slides = $$('.gallery-slide', gal);
    const dots = $$('.gallery-dot', gal);
    const counter = gal.parentElement.querySelector('.gc-current');
    const prev = $('.gallery-prev', gal);
    const next = $('.gallery-next', gal);
    let index = 0;
    const total = slides.length;
    const set = (i) => {
      index = (i + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === index));
      if (counter) counter.textContent = index + 1;
    };
    prev?.addEventListener('click', () => set(index - 1));
    next?.addEventListener('click', () => set(index + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => set(k)));
    gal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') set(index - 1);
      if (e.key === 'ArrowRight') set(index + 1);
    });
  }

  /* Contact form (success without backend) */
  function initContactForm() {
    const form = $('#contactForm');
    const success = $('#formSuccess');
    if (!form || !success) return;
    form.addEventListener('submit', (e) => {
      if (!form.action || form.action.includes('VOTRE_ID')) {
        e.preventDefault();
        form.style.display = 'none';
        success.style.display = 'block';
      }
    });
  }

  /* Hero parallax on mouse move */
  function initHeroParallax() {
    if (prefersReduced) return;
    const hero = $('.hero');
    if (!hero) return;
    const orbs = $$('.hero-orb', hero);
    const floaters = $$('[data-float]', hero);
    if (!orbs.length && !floaters.length) return;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    const loop = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      orbs.forEach((s, i) => {
        const depth = (i + 1) * 20;
        s.style.transform = `translate(${targetX * depth}px, ${targetY * depth}px)`;
      });
      floaters.forEach((el) => {
        const depth = parseFloat(el.dataset.float) || 10;
        el.style.transform = `translate(${targetX * depth}px, ${targetY * depth}px)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* Split-text title reveal (letter by letter) */
  function initSplitTitle() {
    if (prefersReduced) return;
    $$('[data-split]').forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      text.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px) rotate(4deg)';
        span.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.02 * i + 0.15}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.02 * i + 0.15}s`;
        el.appendChild(span);
      });
      requestAnimationFrame(() => {
        el.querySelectorAll('span').forEach((s) => {
          s.style.opacity = '1';
          s.style.transform = 'translateY(0) rotate(0)';
        });
      });
    });
  }

  /* Realisations interactive panels */
  function initRealisations() {
    const panels = $$('.realisations-panel');
    if (!panels.length) return;
    panels.forEach((panel) => {
      panel.addEventListener('click', () => {
        panels.forEach((p) => p.classList.remove('active'));
        panel.classList.add('active');
      });
      panel.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover)').matches) {
          panels.forEach((p) => p.classList.remove('active'));
          panel.classList.add('active');
        }
      });
    });
  }

  /* Current year */
  function initYear() {
    const y = new Date().getFullYear();
    $$('[data-year]').forEach((el) => (el.textContent = y));
  }

  /* Init */
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initHeader();
    initMobileMenu();
    initReveals();
    initMagnetic();
    initSkillBars();
    initCounters();
    initFilter();
    initModal();
    initContactForm();
    initHeroParallax();
    initSplitTitle();
    initRealisations();
    initYear();
  });
})();
