/* =====================================================
   INDOLOGY.AI — SCRIPT
   Minimal, purposeful interactions
   ===================================================== */

(function () {
  'use strict';

  // =====================================================
  // NAVBAR — scroll state & video-overlay detection
  // =====================================================
  const navbar  = document.getElementById('navbar');
  const hero    = document.getElementById('hero');

  function updateNavbar() {
    const scrolled  = window.scrollY > 20;
    const overVideo = hero && window.scrollY < (hero.offsetHeight - 80);

    navbar.classList.toggle('scrolled',   scrolled);
    navbar.classList.toggle('over-video', overVideo && !scrolled);
  }

  // Keep logo/links white only while over the video area
  // (handled purely in CSS via .over-video class)
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // on load

  // =====================================================
  // HAMBURGER MENU
  // =====================================================
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks  = document.getElementById('nav-links');

  hamburger && hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  navLinks && navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // =====================================================
  // SMOOTH SCROLL
  // =====================================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // =====================================================
  // SCROLL REVEAL
  // =====================================================
  function initReveal() {
    const els = document.querySelectorAll(
      '.feature-row, .know-item, .scholar-card, .price-card, .panel-copy, .panel-demo, .intro-left, .intro-right, .cta-inner'
    );

    els.forEach((el, i) => {
      el.classList.add('reveal');
      const delay = (i % 4) * 80;
      el.style.transitionDelay = delay + 'ms';
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target); // fire once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    els.forEach(el => io.observe(el));
  }

  // =====================================================
  // COUNTER ANIMATION
  // =====================================================
  function animateCounter(el, target, duration) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-n[data-target]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target, parseInt(e.target.dataset.target, 10), 2000);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  }

  // =====================================================
  // TOOLS TABS
  // =====================================================
  function initTabs() {
    const tabs   = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tool-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.querySelector(`.tool-panel[data-panel="${tab.dataset.tab}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // =====================================================
  // ACTIVE NAV LINK (intersection)
  // =====================================================
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.removeAttribute('style'));
          const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (active) active.style.color = 'var(--ink)';
        }
      });
    }, { threshold: 0.45 });

    sections.forEach(s => io.observe(s));
  }

  // =====================================================
  // VIDEO FALLBACK — ensure autoplay works
  // =====================================================
  function initVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    // Some browsers need a user gesture for unmuted video.
    // Since it's already muted, autoplay should work.
    // Just make sure it plays:
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: show poster image (already set in HTML)
        video.style.display = 'none';
      });
    }
  }

  // =====================================================
  // OCR BAR ENTRANCE
  // =====================================================
  function initOcrBars() {
    const bars = document.querySelectorAll('.ocr-fill');
    bars.forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0%';
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => { bar.style.width = target; }, 250);
          io.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(bar);
    });
  }

  // =====================================================
  // MARQUEE — pause on hover (handled in CSS too)
  // =====================================================
  // Already handled via CSS :hover on .marquee-bar

  // =====================================================
  // CONTACT FORM
  // =====================================================
  function initContactForm() {
    const form   = document.getElementById('contact-form');
    const btn    = document.getElementById('cf-submit');
    if (!form || !btn) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      btn.textContent = 'Message sent ✓';
      btn.style.background = 'var(--gold-dark)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send message';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // =====================================================
  // INIT
  // =====================================================
  document.addEventListener('DOMContentLoaded', () => {
    initVideo();
    initReveal();
    initCounters();
    initTabs();
    initActiveNav();
    initOcrBars();
    initContactForm();
  });

})();
