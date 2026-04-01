/* ══════════════════════════════════════════════════════════
   AMERICAN TOWER SCHOOL — main.js  v2.0  PREMIUM
   ══════════════════════════════════════════════════════════ */

/* ─── UTILS ─── */
const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════
     LOADER
  ══════════════════ */
  const loader = $('#loader');
  const loaderBar = loader?.querySelector('.loader__progress');

  if (loader) {
    // Animate bar then dismiss — guaranteed, no external dependency
    if (loaderBar) loaderBar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
    }, 900);
  }

  /* ══════════════════
     CUSTOM CURSOR
  ══════════════════ */
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    const animateCursor = () => {
      fx = lerp(fx, mx, 0.14);
      fy = lerp(fy, my, 0.14);
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  /* ══════════════════
     NAV SCROLL
  ══════════════════ */
  const nav = $('#nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    // Hide/show nav on scroll direction
    if (y > 150) {
      nav.style.transform = y > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
      nav.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), background 0.5s, border-color 0.5s';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScroll = y;
  }, { passive: true });

  /* ══════════════════
     MOBILE MENU
  ══════════════════ */
  const burger  = $('#burger');
  const overlay = $('#mobileOverlay');

  burger.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ══════════════════
     SCROLL REVEAL
  ══════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ══════════════════
     HERO CANVAS — floating particles
  ══════════════════ */
  const canvas = $('#heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

    const COLORS = [
      'rgba(8,149,214,',
      'rgba(237,50,55,',
      'rgba(255,255,255,'
    ];

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.r = Math.random() * 1.2 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.35 + 0.05;
        this.life = 0;
        this.maxLife = Math.random() * 400 + 200;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.life++;
        const half = this.maxLife / 2;
        this.alpha = this.life < half
          ? (this.life / half) * this.maxAlpha
          : ((this.maxLife - this.life) / half) * this.maxAlpha;
        if (this.life >= this.maxLife) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }

    // Grid lines
    class GridLine {
      constructor(vertical) {
        this.vert = vertical;
        this.reset();
      }
      reset() {
        this.pos = this.vert ? Math.random() * W : Math.random() * H;
        this.speed = Math.random() * 0.15 + 0.05;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.04 + 0.01;
        this.life = 0; this.maxLife = Math.random() * 600 + 300;
      }
      update() {
        this.life++;
        const half = this.maxLife / 2;
        this.alpha = this.life < half
          ? (this.life / half) * this.maxAlpha
          : ((this.maxLife - this.life) / half) * this.maxAlpha;
        this.pos += this.speed;
        if (this.life >= this.maxLife) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(8,149,214,${this.alpha})`;
        ctx.lineWidth = 1;
        if (this.vert) {
          ctx.moveTo(this.pos, 0); ctx.lineTo(this.pos, H);
        } else {
          ctx.moveTo(0, this.pos); ctx.lineTo(W, this.pos);
        }
        ctx.stroke();
      }
    }

    let gridLines = [];
    const initParticles = () => {
      particles = Array.from({ length: 80 }, () => new Particle());
      gridLines = [
        ...Array.from({ length: 5 }, () => new GridLine(true)),
        ...Array.from({ length: 3 }, () => new GridLine(false))
      ];
    };
    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      gridLines.forEach(l => { l.update(); l.draw(); });
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(render);
    };
    render();
  }

  /* ══════════════════
     COUNTER ANIMATION
  ══════════════════ */
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const dur = 1800;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ══════════════════
     CARD TILT
  ══════════════════ */
  $$('.pcard, .cert').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ══════════════════
     SMOOTH SCROLL
  ══════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = $(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
    });
  });

  /* ══════════════════
     ACTIVE NAV
  ══════════════════ */
  const navLinks = $$('.nav__links a');
  const sections = $$('section[id]');

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('nav-active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObs.observe(s));

  // inject active style
  const style = document.createElement('style');
  style.textContent = `.nav__links a.nav-active { color: #fff; } .nav__links a.nav-active::after { width: 100%; }`;
  document.head.appendChild(style);

  /* ══════════════════
     PARALLAX HERO TEXT
  ══════════════════ */
  const heroBody = $('.hero__body');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight && heroBody) {
      heroBody.style.transform = `translateY(${y * 0.18}px)`;
      heroBody.style.opacity = 1 - (y / (window.innerHeight * 0.8));
    }
  }, { passive: true });

  /* ══════════════════
     SCROLL PROGRESS BAR
  ══════════════════ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, #ed3237, #0895d6);
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ══════════════════
     MARQUEE PAUSE on HOVER
  ══════════════════ */
  const marqueeTrack = $('.marquee__track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
    marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
  }

  /* ══════════════════
     STAR ANIMATION trigger
  ══════════════════ */
  const rating = $('.t-rating');
  if (rating) {
    const starObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      $$('.t-rating__stars span').forEach(s => {
        s.style.animationPlayState = 'running';
      });
      starObs.disconnect();
    }, { threshold: 0.5 });
    starObs.observe(rating);
    // Initially paused
    $$('.t-rating__stars span').forEach(s => s.style.animationPlayState = 'paused');
  }

  /* ══════════════════
     CONTACT FORM → WHATSAPP
  ══════════════════ */
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name     = $('#fname')?.value.trim();
      const phone    = $('#fphone')?.value.trim();
      const interest = $('#finterest');
      const level    = $('#flevel');
      const interestText = interest?.options[interest.selectedIndex]?.text || '';
      const levelText    = level?.options[level.selectedIndex]?.text || '';

      const msg = encodeURIComponent(
        `¡Hola! 👋 Me llamo *${name}*\n` +
        `📞 Contacto: ${phone}\n` +
        `📚 Me interesa: *${interestText}*\n` +
        `🎯 Mi nivel: ${levelText}\n\n` +
        `Quisiera más información sobre American Tower School. ¡Gracias!`
      );
      window.open(`https://wa.me/522226559584?text=${msg}`, '_blank');
    });
  }

  /* ══════════════════
     CERTIFICATE EMBLEM PULSE on scroll
  ══════════════════ */
  const certEmblemRing = $('.cert__emblem-ring');
  if (certEmblemRing) {
    const certObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        certEmblemRing.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0.3 });
    const cert = $('.cert');
    if (cert) certObs.observe(cert);
  }

});
