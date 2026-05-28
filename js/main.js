/* ═══════════════════════════════════════════════════════
   PIXLURK PORTFOLIO — main.js
   Joel B. Gacho · joelgacho.com
   ─────────────────────────────────────────────────────
   1. Theme toggle (dark / light) with localStorage
   2. Typing / role animation (reeni-wp.laralink.com style)
   3. Mobile hamburger menu
   4. Active nav link on scroll
   5. Skill bar animation (IntersectionObserver)
   6. Scroll-reveal animations (IntersectionObserver)
   7. Animated stat counters
   8. Header shadow on scroll
   9. Footer year
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   1. THEME TOGGLE
───────────────────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY   = 'pixlurk-theme';

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

(function initTheme() {
  const saved      = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeToggle.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});


/* ─────────────────────────────────────────────────────
   2. TYPING / ROLE ANIMATION
   Types each role character by character, erases right
   to left, then types the next — reeni-wp.laralink.com
───────────────────────────────────────────────────── */
const typedEl = document.getElementById('typedRole');

if (typedEl) {
  const roles = [
    'WordPress Web Designer',
    'SEO Specialist',
    'Elementor Pro Expert',
  ];

  let roleIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;

  function typeRole() {
    const current = roles[roleIdx];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    typedEl.setAttribute('aria-label', typedEl.textContent);

    let delay = isDeleting ? 55 : 100;

    if (!isDeleting && charIdx === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 450;
    }

    setTimeout(typeRole, delay);
  }

  setTimeout(typeRole, 800);
}


/* ─────────────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
───────────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close on link click
mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ─────────────────────────────────────────────────────
   4. ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ─────────────────────────────────────────────────────
   5. SKILL BAR ANIMATION
   Fills bars to their CSS --pct value when in viewport
───────────────────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill__fill');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* ─────────────────────────────────────────────────────
   6. SCROLL-REVEAL ANIMATIONS
   Elements with [data-animate] fade/slide in when visible
───────────────────────────────────────────────────── */
const animEls = document.querySelectorAll('[data-animate]');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-animate]')];
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80;

      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────────────
   7. ANIMATED STAT COUNTERS
   Counts up from 0 to data-count when About scrolls in
───────────────────────────────────────────────────── */
const counters = document.querySelectorAll('[data-count]');

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1400;
  const stepTime = 16;
  const steps    = Math.floor(duration / stepTime);
  let   current  = 0;

  const timer = setInterval(() => {
    current++;
    el.textContent = Math.round((current / steps) * target);
    if (current >= steps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, stepTime);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));


/* ─────────────────────────────────────────────────────
   8. HEADER SHADOW ON SCROLL
───────────────────────────────────────────────────── */
const siteHeader = document.getElementById('siteHeader');

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });


/* ─────────────────────────────────────────────────────
   9. FOOTER YEAR
───────────────────────────────────────────────────── */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ─────────────────────────────────────────────────────
   11. PROJECT CATEGORY FILTER + LOAD MORE
───────────────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.projects__filter .filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const loadMoreBtn  = document.getElementById('loadMoreBtn');
const PAGE_SIZE    = 9;

function applyCollapse(filter) {
  const cards = [...projectCards];

  if (filter === 'all') {
    let shown = 0;
    cards.forEach(card => {
      card.classList.remove('project-card--hidden');
      if (shown < PAGE_SIZE) {
        card.classList.remove('project-card--collapsed');
        shown++;
      } else {
        card.classList.add('project-card--collapsed');
      }
    });
    const hasMore = cards.some(c => c.classList.contains('project-card--collapsed'));
    loadMoreWrap.style.display = hasMore ? 'block' : 'none';
  } else {
    cards.forEach(card => {
      card.classList.remove('project-card--collapsed');
      if (card.dataset.category === filter) {
        card.classList.remove('project-card--hidden');
      } else {
        card.classList.add('project-card--hidden');
      }
    });
    loadMoreWrap.style.display = 'none';
  }

  const visibleCount = cards.filter(c =>
    !c.classList.contains('project-card--hidden') &&
    !c.classList.contains('project-card--collapsed')
  ).length;
  document.querySelector('.projects__grid').classList.toggle('projects__grid--solo', visibleCount === 1);
}

// Initialise on page load
applyCollapse('all');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    applyCollapse(btn.dataset.filter);
  });
});

// Load More — reveal all remaining cards
loadMoreBtn.addEventListener('click', () => {
  projectCards.forEach(card => card.classList.remove('project-card--collapsed'));
  loadMoreWrap.style.display = 'none';
});


/* ─────────────────────────────────────────────────────
   10. CONTACT FORM — Web3Forms submission
   Sends to joelgacho.ffseo@gmail.com via web3forms.com
───────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn    = document.getElementById('submitBtn');
    const result = document.getElementById('formResult');

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    result.className = 'form__result';
    result.textContent = '';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   new FormData(contactForm)
      });
      const json = await res.json();

      if (json.success) {
        result.textContent = '✓ Message sent! I\'ll get back to you as soon as possible.';
        result.classList.add('form__result--success');
        contactForm.reset();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      result.textContent = '✗ Something went wrong. Please email me directly at joelgacho.ffseo@gmail.com';
      result.classList.add('form__result--error');
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
    }
  });
}
