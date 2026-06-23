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

/* ─── AVATAR 3D (perspective tilt + zoom follow cursor) ─── */
function initMagneticAvatar() {
  const avatar = document.querySelector('.hero-avatar');
  if (!avatar) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const PADDING  = 260;   // detection radius beyond avatar edge
  const STRENGTH = 5;     // translation divisor (lower = stronger pull)
  const TILT     = 22;    // max tilt degrees (rotateX / rotateY)
  const ZOOM_MAX = 1.10;  // max scale when cursor is dead-center
  let isActive   = false;
  let raf;

  document.addEventListener('mousemove', (e) => {
    const rect    = avatar.getBoundingClientRect();
    const cx      = rect.left + rect.width  / 2;
    const cy      = rect.top  + rect.height / 2;
    const dx      = e.clientX - cx;
    const dy      = e.clientY - cy;
    const dist    = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(rect.width, rect.height) / 2 + PADDING;

    if (dist < maxDist) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!isActive) {
          isActive = true;
          avatar.style.animationPlayState = 'paused';
          avatar.style.transition = 'transform 0.1s ease-out, filter 0.25s ease';
        }

        // ratio: 0 at detection edge → 1 at avatar center
        const ratio = Math.max(0, 1 - dist / maxDist);
        const ease  = ratio * ratio;          // quadratic — more subtle at edges

        // translation (magnetic pull toward cursor)
        const tx = dx / STRENGTH;
        const ty = dy / STRENGTH;

        // 3D tilt based on cursor angle relative to avatar center
        const nx   = dx / (rect.width  / 2);  // -1 → +1
        const ny   = dy / (rect.height / 2);  // -1 → +1
        const rotX = -ny * TILT * ease;        // tilt: top/bottom axis
        const rotY =  nx * TILT * ease;        // tilt: left/right axis

        // zoom: face "comes toward" viewer as cursor gets closer
        const scale = 1 + ease * (ZOOM_MAX - 1);

        // glow: deepens with proximity
        const g1 = 0.15 + ease * 0.5;
        const g2 = 0.08 + ease * 0.35;
        const r1 = Math.round(40 + ease * 56);
        const r2 = Math.round(80 + ease * 40);

        avatar.style.transform =
          `perspective(680px) translateX(calc(-50% + ${tx}px)) translateY(${ty}px) ` +
          `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        avatar.style.filter =
          `drop-shadow(0 0 ${r1}px rgba(59,91,245,${g1.toFixed(2)})) ` +
          `drop-shadow(0 0 ${r2}px rgba(74,181,212,${g2.toFixed(2)}))`;
      });
    } else {
      if (isActive) {
        cancelAnimationFrame(raf);
        isActive = false;
        avatar.style.transition = 'transform 0.85s cubic-bezier(0.16,1,0.3,1), filter 0.55s ease';
        avatar.style.transform  = '';
        avatar.style.filter     = '';
        setTimeout(() => {
          if (!isActive) {
            avatar.style.animationPlayState = 'running';
            avatar.style.transition = '';
            avatar.style.transform  = '';
            avatar.style.filter     = '';
          }
        }, 880);
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
  const raw      = el.dataset.target;
  const target   = parseFloat(raw);
  const suffix   = el.dataset.suffix || '';
  const decimals = (raw.split('.')[1] || '').length;
  const duration = 1600;
  const start    = performance.now();
  const statVal  = el.closest('.cc-stat-value');
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    el.textContent = (target >= 10000 ? target.toLocaleString('en-US') : raw) + suffix;
    if (statVal) statVal.classList.add('pop');
    return;
  }

  function tick(now) {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = target * ease;
    let formatted;
    if (decimals === 0) {
      const n = Math.round(val);
      formatted = n >= 10000 ? n.toLocaleString('en-US') : String(n);
    } else {
      formatted = parseFloat(val.toFixed(decimals)).toString();
    }
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

/* ─── ACTIVE NAV LINK ─── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
}

/* ─── SCROLL TO TOP ─── */
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── 3D TILT (premium depth effect: card tilts toward cursor, springs back) ─── */
function initTilt3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const configs = [
    { selector: '.diff-card', tilt: 11, scale: 1.03, perspective: 700 },
  ];

  configs.forEach(({ selector, tilt, scale, perspective }) => {
    document.querySelectorAll(selector).forEach(el => {
      let raf;

      el.addEventListener('mousemove', e => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r  = el.getBoundingClientRect();
          const x  = (e.clientX - r.left)  / r.width  - 0.5;   // -0.5 → 0.5
          const y  = (e.clientY - r.top)   / r.height - 0.5;
          const rx = -y * tilt;
          const ry =  x * tilt;
          el.style.transition =
            `transform 0.08s ease-out,
             box-shadow 0.3s ease,
             border-color 0.3s ease`;
          el.style.transform =
            `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale},${scale},${scale})`;
        });
      });

      el.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        el.style.transition =
          `transform 0.7s cubic-bezier(0.16,1,0.3,1),
           box-shadow 0.3s ease,
           border-color 0.3s ease`;
        el.style.transform = '';
      });
    });
  });
}

/* ─── CARD SPOTLIGHT (radial glow follows cursor inside each card) ─── */
function initCardSpotlight() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.cc-card, .diff-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });
}

/* ─── DECO PARALLAX (4 corner icons shift in 3D depth on mouse move) ─── */
function initDecoParallax() {
  const section = document.querySelector('.about-section');
  if (!section) return;
  const tl = document.querySelector('.deco-tl');
  const tr = document.querySelector('.deco-tr');
  const bl = document.querySelector('.deco-bl');
  const br = document.querySelector('.deco-br');
  if (!tl || !tr || !bl || !br) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const DEPTH = 18;

  section.addEventListener('mousemove', e => {
    const r  = section.getBoundingClientRect();
    const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    tl.style.setProperty('--px', (dx * -0.8 * DEPTH) + 'px');
    tl.style.setProperty('--py', (dy * -0.6 * DEPTH) + 'px');
    tr.style.setProperty('--px', (dx *  0.9 * DEPTH) + 'px');
    tr.style.setProperty('--py', (dy * -0.5 * DEPTH) + 'px');
    bl.style.setProperty('--px', (dx * -0.6 * DEPTH) + 'px');
    bl.style.setProperty('--py', (dy *  0.7 * DEPTH) + 'px');
    br.style.setProperty('--px', (dx *  0.7 * DEPTH) + 'px');
    br.style.setProperty('--py', (dy *  0.8 * DEPTH) + 'px');
  });

  section.addEventListener('mouseleave', () => {
    [tl, tr, bl, br].forEach(el => {
      el.style.setProperty('--px', '0px');
      el.style.setProperty('--py', '0px');
    });
  });
}

/* ─── SKILL SECTION STAGGER ─── */
function initSkillStagger() {
  const section = document.querySelector('.skills-section');
  if (!section) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.classList.add('visible');
        io.unobserve(section);
      }
    });
  }, { threshold: 0.08 });
  io.observe(section);
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
  initActiveNav();
  initScrollTop();
  initTilt3D();
  initCardSpotlight();
  initDecoParallax();
  initSkillStagger();
});
