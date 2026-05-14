/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function initReveal() {
    document.querySelectorAll('.reveal-item').forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     PARALLAX — Hero dragon & CTA dragon
  ═══════════════════════════════════════════════════════════════ */
  const heroDragon = document.getElementById('heroDragon');
  const ctaDragon  = document.getElementById('ctaDragon');

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }

  function updateParallax() {
    const sy = window.scrollY;

    if (heroDragon) {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const rect   = heroSection.getBoundingClientRect();
        const factor = sy * 0.18;
        heroDragon.style.transform = `translate(-50%, calc(-50% - ${factor}px))`;
      }
    }

    if (ctaDragon) {
      const ctaSection = document.getElementById('cta');
      if (ctaSection) {
        const rect   = ctaSection.getBoundingClientRect();
        const factor = rect.top * -0.1;
        ctaDragon.style.transform = `translateY(${factor}px)`;
      }
    }

    ticking = false;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();
