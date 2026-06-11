/* =========================================
   PHAN QUOC CUONG — Portfolio main.js
   Code_template.md aesthetic
   ========================================= */

/* ─── SCROLL REVEAL (handles .reveal, .reveal-left, .reveal-right, .reveal-heading) ─── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-heading');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
}

/* ─── MAGNETIC AVATAR ─── */
function initMagneticAvatar() {
  const avatar = document.querySelector('.hero-avatar');
  if (!avatar) return;

  const PADDING  = 160;
  const STRENGTH = 3.5;
  let isActive   = false;

  document.addEventListener('mousemove', (e) => {
    const rect    = avatar.getBoundingClientRect();
    const cx      = rect.left + rect.width  / 2;
    const cy      = rect.top  + rect.height / 2;
    const dx      = e.clientX - cx;
    const dy      = e.clientY - cy;
    const dist    = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(rect.width, rect.height) / 2 + PADDING;

    if (dist < maxDist) {
      if (!isActive) {
        isActive = true;
        avatar.style.animationPlayState = 'paused';
        avatar.style.transition = 'transform 0.3s ease-out, filter 0.35s ease';
      }
      const tx = dx / STRENGTH;
      const ty = dy / STRENGTH;
      avatar.style.transform = `translateX(calc(-50% + ${tx}px)) translateY(${ty}px)`;
    } else {
      if (isActive) {
        isActive = false;
        avatar.style.transition = 'transform 0.6s ease-in-out, filter 0.35s ease';
        avatar.style.transform  = '';
        setTimeout(() => {
          avatar.style.animationPlayState = 'running';
          avatar.style.transition = '';
          avatar.style.transform  = '';
        }, 620);
      }
    }
  });
}

/* ─── MOBILE NAV ─── */
function initMobileNav() {
  const btn  = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
  });
}

/* ─── NAV SCROLL STYLE ─── */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ─── LIGHTBOX ─── */
function initLightbox() {
  const box   = document.getElementById('lightbox');
  const img   = document.getElementById('lightbox-img');
  const close = document.getElementById('lightbox-close');
  if (!box) return;

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      img.src = card.dataset.lightbox;
      box.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    box.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { img.src = ''; }, 300);
  }
  close.addEventListener('click', closeLB);
  box.addEventListener('click', e => { if (e.target === box) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
}

/* ─── SCROLL PROGRESS BAR ─── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max  = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const start    = performance.now();
  const statVal  = el.closest('.cc-stat-value');

  function tick(now) {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = target * ease;
    const formatted = Number.isInteger(target)
      ? Math.round(val)
      : parseFloat(val.toFixed(1));
    el.textContent = formatted + suffix;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else if (statVal) {
      statVal.classList.add('pop');
      setTimeout(() => statVal.classList.remove('pop'), 450);
    }
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => io.observe(el));
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initReveal();
  initMobileNav();
  initNavScroll();
  initLightbox();
  initCounters();
  initMagneticAvatar();
});
