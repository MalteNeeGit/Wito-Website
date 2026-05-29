// ============================================================
// Wito – Landing Page Scripts
// ============================================================

// Navigation: Scroll-Status (Glas-Effekt)
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function navScrollState() {
    if (window.scrollY > 24) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', navScrollState, { passive: true });
  navScrollState();
})();

// Mobiles Menü: Öffnen / Schließen
(function () {
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (!toggle || !mobileMenu) return;

  const iconHamburger = `
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  `;

  const iconClose = `
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  `;

  function openMenu() {
    mobileMenu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    toggle.querySelector('svg').innerHTML = iconClose;
  }

  function closeMenu() {
    mobileMenu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    toggle.querySelector('svg').innerHTML = iconHamburger;
  }

  toggle.addEventListener('click', function () {
    if (mobileMenu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  // Menü bei Link-Klick automatisch schließen
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Escape-Taste schließt Menü
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hidden) {
      closeMenu();
      toggle.focus();
    }
  });
})();

// Smooth Scroll für Anker-Links (mit Nav-Offset)
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();

// Kennzahlen-Counter Animation
(function () {
  const section = document.querySelector('.stats');
  if (!section) return;

  const counters = section.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  let statsAnimated = false;

  // Ease-Out-Kurve: schnell am Anfang, verlangsamt zum Ende hin
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 1400;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function onScroll() {
    if (statsAnimated) return;
    if (window.scrollY <= 100) return;

    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      statsAnimated = true;
      counters.forEach(animateCounter);
      window.removeEventListener('scroll', onScroll);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// Scroll-Reveal via Intersection Observer
(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: alle Elemente sofort einblenden
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
})();
