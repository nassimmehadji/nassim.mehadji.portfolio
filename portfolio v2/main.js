/* ═══════════════════════════════════════════════════
   NASSIM MEHADJI — PORTFOLIO
   Shared JavaScript — Enhanced Version
   ═══════════════════════════════════════════════════ */

// ── Loader (page d'accueil uniquement, première visite) ──
(function() {
    const loader = document.getElementById('siteLoader');
    if (!loader) return;
    
    // Si déjà visité dans cette session, masquer immédiatement
    if (sessionStorage.getItem('loaderShown')) {
        loader.remove();
        return;
    }
    
    sessionStorage.setItem('loaderShown', '1');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
        setTimeout(() => {
            loader.remove();
        }, 2500);
    });
    // Fallback
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 4000);
})();

document.addEventListener('DOMContentLoaded', () => {

    // ── Header scroll effect ──
    const header = document.querySelector('.site-header');
    if (header) {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── Mobile menu ──
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('mobileClose');

    if (toggle && menu) {
        const open = () => {
            menu.classList.add('open');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            menu.classList.remove('open');
            document.body.style.overflow = '';
        };
        toggle.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) close();
        });
    }

    // ── Active nav link ──
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ── Reveal on scroll (IntersectionObserver) ──
    const reveals = document.querySelectorAll('.reveal, .stagger');
    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        reveals.forEach(el => observer.observe(el));
    }

    // ── Skill bars animation ──
    const skillBars = document.querySelectorAll('[data-width]');
    if (skillBars.length) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.width;
                }
            });
        }, { threshold: 0.5 });
        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // ── Smooth anchor scrolling ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Page load: trigger reveals already in viewport ──
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});
