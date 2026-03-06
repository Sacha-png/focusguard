/* ═══════════════════════════════════════════════
   FocusGuard — Landing page script
   iOS Safari compatible
═══════════════════════════════════════════════ */

/* ── iOS / Safari detection ── */
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/* Show the iOS card only on iOS, highlight it */
if (isIOS) {
  document.querySelectorAll('.dl-card').forEach(card => {
    const platform = card.querySelector('.dl-platform');
    if (platform && platform.textContent.trim().startsWith('iOS')) {
      card.classList.add('primary');
      card.style.order = '-1';
    }
  });
}

/* ── Navbar scroll shadow ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile burger menu ── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  // Animate burger → X
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMenu();
  });
});

/* ── Scroll-reveal animation ── */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        revealObserver.unobserve(el.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Add reveal class to animatable elements
[
  '#features .feature-card',
  '#how .step',
  '#sites .site-chip',
  '#download .dl-card',
  '#download .install-block',
  '#download .requirements',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 60}ms`;
    revealObserver.observe(el);
  });
});

/* ── Copy code button ── */
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    btn.title = 'Copié !';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.title = 'Copier';
    }, 2000);
  });
}

/* ── Download toast ── */
const toast = document.getElementById('toast');

function triggerDownload(e, platform) {
  e.preventDefault();

  // In production: replace with real release URL
  // const url = 'https://github.com/votre-user/focusguard/releases/download/v1.0.0/FocusGuard-Setup.exe';
  // window.location.href = url;

  showToast();
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── Mockup typewriter animation on the banner ── */
const bannerTexts = [
  'Agreed: 105 min total entertainment today.',
  'Light schedule — enjoy your evening!',
  'Exam tomorrow — 45 min suggested.',
];
const bannerEl = document.querySelector('.mockup-banner.green');
if (bannerEl) {
  let i = 0;
  setInterval(() => {
    bannerEl.style.opacity = '0';
    bannerEl.style.transition = 'opacity .3s';
    setTimeout(() => {
      i = (i + 1) % bannerTexts.length;
      bannerEl.textContent = bannerTexts[i];
      bannerEl.style.opacity = '1';
    }, 320);
  }, 3500);
}

/* ── Countup animation on hero stats ── */
function countUp(el, target, duration = 1200) {
  const start = performance.now();
  const isText = isNaN(target);
  if (isText) return;
  const update = (now) => {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
    if (pct < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Observe hero stats
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);
