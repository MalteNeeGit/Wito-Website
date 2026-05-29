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

// How It Works – 2-Phasen Fächer-Animation
(function () {
  const section = document.getElementById('how-it-works');
  if (!section) return;

  const cards = section.querySelectorAll('.how-stage > .how-card');
  const texts = section.querySelectorAll('.how-text-block');
  const popup = section.querySelector('.how-popup');
  if (cards.length < 3 || texts.length < 3) return;

  const lerp  = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  function update() {
    if (window.innerWidth < 1024) return;

    const progress = clamp(
      (window.scrollY - section.offsetTop) / (section.offsetHeight - window.innerHeight),
      0, 1
    );

    let r0, r1, r2;

    if (progress <= 0.5) {
      const t = progress / 0.5;

      r0 = lerp(0,  -45, t);
      r1 = lerp(45,   0, t);
      r2 = lerp(90,  45, t);

      cards[0].style.zIndex = t > 0.5 ? 1 : 3;
      cards[1].style.zIndex = t > 0.5 ? 3 : 2;
      cards[2].style.zIndex = 1;

      texts[0].style.opacity = t < 0.6 ? 1 : lerp(1, 0, (t - 0.6) / 0.4);
      texts[1].style.opacity = t < 0.6 ? 0 : lerp(0, 1, (t - 0.6) / 0.4);
      texts[2].style.opacity = 0;

      if (popup) popup.style.opacity = t < 0.8 ? 0 : lerp(0, 1, (t - 0.8) / 0.2);

    } else {
      const t = (progress - 0.5) / 0.5;

      r0 = lerp(-45, -90, t);
      r1 = lerp(  0, -45, t);
      r2 = lerp( 45,   0, t);

      cards[0].style.zIndex = 1;
      cards[1].style.zIndex = t > 0.5 ? 2 : 3;
      cards[2].style.zIndex = t > 0.5 ? 3 : 2;

      texts[0].style.opacity = 0;
      texts[1].style.opacity = t < 0.4 ? 1 : lerp(1, 0, (t - 0.4) / 0.3);
      texts[2].style.opacity = t < 0.4 ? 0 : lerp(0, 1, (t - 0.4) / 0.3);

      if (popup) popup.style.opacity = t < 0.3 ? lerp(1, 0, t / 0.3) : 0;
    }

    cards[0].style.transform = `translateX(-50%) rotate(${r0}deg)`;
    cards[1].style.transform = `translateX(-50%) rotate(${r1}deg)`;
    cards[2].style.transform = `translateX(-50%) rotate(${r2}deg)`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', update, { passive: true });
  update();
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
