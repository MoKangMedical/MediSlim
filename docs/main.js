/* ============================================================
   MediSlim — Main JavaScript
   OPC Ecosystem | Floating Nav + Scroll Animations
   ============================================================ */

(function() {
  'use strict';

  // ---- OPC Floating Navigation ----
  function initNavigation() {
    const nav = document.querySelector('.opc-nav');
    if (!nav) return;

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.opc-nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function() {
        links.classList.toggle('open');
        toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
      });

      // Close on link click
      links.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          links.classList.remove('open');
          toggle.textContent = '☰';
        });
      });
    }

    // Active page highlight
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.querySelectorAll('a:not(.nav-github)').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // ---- Scroll Reveal Animations ----
  function initScrollAnimations() {
    // Target elements with animation classes
    var animTargets = document.querySelectorAll(
      '.fade-up, .fade-in, .slide-left, .slide-right, .card, .price-card, .card-grid .card, .faq-item'
    );

    if (!animTargets.length) return;

    // Add fade-up class to cards that don't have animation class
    animTargets.forEach(function(el) {
      if (!el.classList.contains('fade-up') && !el.classList.contains('fade-in') &&
          !el.classList.contains('slide-left') && !el.classList.contains('slide-right')) {
        el.classList.add('fade-up');
      }
    });

    // IntersectionObserver for reveal
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          // Stagger delay for grid items
          var el = entry.target;
          var siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
          var siblingIndex = siblings.indexOf(el);
          var delay = Math.min(siblingIndex * 80, 400);

          setTimeout(function() {
            el.classList.add('visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    animTargets.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var targetId = a.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('.opc-nav') ?
            document.querySelector('.opc-nav').offsetHeight : 64;
          var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Counter Animation for Stats ----
  function initCounters() {
    var counters = document.querySelectorAll('.stat-num, .stat .num');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();
          var num = parseInt(text);
          if (!isNaN(num) && num > 0) {
            animateCounter(el, num);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  function animateCounter(el, target) {
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // ---- Parallax on Hero ----
  function initParallax() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
      var scroll = window.pageYOffset;
      if (scroll < 800) {
        hero.style.backgroundPositionY = (scroll * 0.3) + 'px';
      }
    }, { passive: true });
  }

  // ---- Initialize Everything ----
  function init() {
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initCounters();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
