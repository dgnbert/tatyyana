/* ═══════════════════════════════════════════════════════════════
   MAIN.JS — Preloader, Header, Burger, Slider, Filters, Links
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── PRELOADER ──────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    setTimeout(() => { preloader.remove(); }, 700);
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1800);
  } else {
    window.addEventListener('load', () => { setTimeout(hidePreloader, 1800); });
  }

  /* ─── HEADER SCROLL BEHAVIOUR ────────────────────────────── */
  const header = document.getElementById('header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ─── BURGER / MOBILE OVERLAY ────────────────────────────── */
  const burger        = document.getElementById('burger');
  const overlay       = document.getElementById('mobileOverlay');
  const overlayClose  = document.getElementById('overlayClose');
  const mobileLinks   = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  function openMenu() {
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    burger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (burger && overlay) {
    burger.addEventListener('click', () => {
      overlay.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (overlayClose) overlayClose.addEventListener('click', closeMenu);
    mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeMenu(); });
  }

  /* ─── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── PRODUCT FILTER ─────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          /* Re-trigger reveal if not yet visible */
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { card.classList.add('visible'); });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── REVIEWS SLIDER ─────────────────────────────────────── */
  (function initSlider() {
    const track     = document.getElementById('sliderTrack');
    const dotsWrap  = document.getElementById('sliderDots');
    const prevBtn   = document.getElementById('sliderPrev');
    const nextBtn   = document.getElementById('sliderNext');
    if (!track || !dotsWrap) return;

    const cards = Array.from(track.querySelectorAll('.review-card'));
    let current  = 0;
    let perView  = getPerView();
    let maxIndex = Math.max(0, cards.length - perView);
    let autoTimer;

    function getPerView() {
      if (window.innerWidth >= 900) return 3;
      if (window.innerWidth >= 600) return 2;
      return 1;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const btn = document.createElement('button');
        btn.className = 'slider-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Слайд ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(btn);
      }
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex));
      const offset = current * (100 / perView);
      track.style.transform = `translateX(-${offset}%)`;

      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current < maxIndex ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : maxIndex); }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }
    function stopAuto() { clearInterval(autoTimer); }

    /* Swipe support */
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      startAuto();
    }, { passive: true });

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

    /* Responsive rebuild */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        perView  = getPerView();
        maxIndex = Math.max(0, cards.length - perView);
        current  = Math.min(current, maxIndex);
        buildDots();
        goTo(current);
      }, 200);
    });

    /* Set track width for overflow scroll */
    function setTrackWidth() {
      const pv = getPerView();
      track.style.width = `${(cards.length / pv) * 100}%`;
      cards.forEach((c) => { c.style.width = `${100 / cards.length}%`; });
    }

    /* Initial setup */
    setTrackWidth();
    track.style.display     = 'flex';
    track.style.transition  = 'transform .5s cubic-bezier(.4,0,.2,1)';
    track.style.overflow    = 'visible';
    track.parentElement.style.overflow = 'hidden';

    buildDots();
    goTo(0);
    startAuto();
  })();

  /* ─── CONTACT LINKS FROM CONFIG ──────────────────────────── */
  function applyContactLinks() {
    if (typeof CONTACTS === 'undefined') return;

    document.querySelectorAll('[data-contact]').forEach((el) => {
      const key = el.dataset.contact;
      const url = CONTACTS[key];
      if (!url) return;

      if (el.tagName === 'A') {
        el.href = url;
        if (!url.startsWith('tel:') && !url.startsWith('mailto:')) {
          el.target = '_blank';
          el.rel    = 'noopener noreferrer';
        }
      }
    });
  }

  /* ─── BACK TO TOP ────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.removeAttribute('hidden');
      } else {
        backToTop.setAttribute('hidden', '');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', applyContactLinks);
})();
