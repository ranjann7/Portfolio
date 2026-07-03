/* ==========================================================================
   RANJAN S — PORTFOLIO SCRIPT
   Vanilla JS only. Organized by feature, each wrapped defensively so one
   failing feature never blocks the rest of the page from working.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. BOOT LOADER ---------- */
  (function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    // Give the mini "boot sequence" a moment to be seen, then reveal the page.
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 900);
    });
    // Fallback in case the load event already fired / is slow to fire.
    setTimeout(() => loader.classList.add('is-hidden'), 2500);
  })();

  /* ---------- 2. DARK / LIGHT MODE TOGGLE ---------- */
  (function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const STORAGE_KEY = 'ranjan-portfolio-theme';

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialTheme = saved || (prefersDark ? 'dark' : 'dark'); // default to dark (brand theme)

    root.setAttribute('data-theme', initialTheme);

    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  })();

  /* ---------- 3. TYPING ANIMATION (Hero roles) ---------- */
  (function initTypingEffect() {
    const el = document.getElementById('typedRole');
    if (!el) return;

    const roles = ['Software Developer', 'Web Developer', 'AI Enthusiast', 'Problem Solver'];
    const TYPE_SPEED = 85;
    const DELETE_SPEED = 45;
    const PAUSE_AFTER_TYPE = 1400;
    const PAUSE_AFTER_DELETE = 400;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        charIndex++;
        el.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          isDeleting = true;
          return setTimeout(tick, PAUSE_AFTER_TYPE);
        }
        return setTimeout(tick, TYPE_SPEED);
      }

      charIndex--;
      el.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, PAUSE_AFTER_DELETE);
      }
      return setTimeout(tick, DELETE_SPEED);
    }

    tick();
  })();

  /* ---------- 4. STICKY NAVBAR STATE ---------- */
  (function initNavbarScrollState() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const updateState = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
  })();

  /* ---------- 5. MOBILE NAV MENU ---------- */
  (function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    const closeMenu = () => {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu whenever a nav link is tapped.
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  })();

  /* ---------- 6. SMOOTH SCROLL (in-page anchors) ---------- */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  })();

  /* ---------- 7. ACTIVE NAVBAR HIGHLIGHTING ---------- */
  (function initActiveNavHighlighting() {
    const navLinkEls = document.querySelectorAll('[data-nav]');
    if (!navLinkEls.length) return;

    // Only track sections that actually have a corresponding nav link
    // ("home" maps to the <main> wrapper; the hero itself isn't in the nav).
    const trackedIds = Array.from(navLinkEls).map((link) => link.getAttribute('href').slice(1));
    const sections = trackedIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const setActive = (id) => {
      navLinkEls.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active-link', isMatch);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  })();

  /* ---------- 8. SCROLL REVEAL ANIMATIONS ---------- */
  (function initScrollReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  })();

  /* ---------- 10. BACK TO TOP BUTTON ---------- */
  (function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const toggleVisibility = () => {
      btn.classList.toggle('is-visible', window.scrollY > 500);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ---------- 11. CONTACT FORM VALIDATION ---------- */
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
      email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
      subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
      message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
    };
    const successEl = document.getElementById('formSuccess');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      field.el.classList.toggle('is-invalid', Boolean(message));
      field.error.textContent = message || '';
    }

    function validate() {
      let isValid = true;

      if (!fields.name.el.value.trim()) {
        setError(fields.name, 'Please enter your name.');
        isValid = false;
      } else {
        setError(fields.name, '');
      }

      const emailVal = fields.email.el.value.trim();
      if (!emailVal) {
        setError(fields.email, 'Please enter your email.');
        isValid = false;
      } else if (!emailPattern.test(emailVal)) {
        setError(fields.email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        setError(fields.email, '');
      }

      if (!fields.subject.el.value.trim()) {
        setError(fields.subject, 'Please add a subject.');
        isValid = false;
      } else {
        setError(fields.subject, '');
      }

      if (!fields.message.el.value.trim()) {
        setError(fields.message, 'Please write a short message.');
        isValid = false;
      } else if (fields.message.el.value.trim().length < 10) {
        setError(fields.message, 'Message should be at least 10 characters.');
        isValid = false;
      } else {
        setError(fields.message, '');
      }

      return isValid;
    }

    // Clear individual field errors as the user types/corrects them.
    Object.values(fields).forEach(({ el }) => {
      el.addEventListener('input', () => {
        el.classList.remove('is-invalid');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successEl.textContent = '';

      if (!validate()) return;

      // No backend is wired up — this simulates a successful send so the
      // form is fully demonstrable. Swap this block for a real API/EmailJS
      // call when connecting the form to a live endpoint.
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        successEl.textContent = "Thanks! Your message has been noted — I'll get back to you soon.";
        submitBtn.innerHTML = originalLabel;
        submitBtn.disabled = false;
        form.reset();
        // Restore default demo values for name/email after reset.
        fields.name.el.value = 'Ranjan S';
        fields.email.el.value = 'ranjann0205@gmail.com';
      }, 900);
    });
  })();

  /* ---------- 12. FOOTER YEAR ---------- */
  (function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  })();

});
