/* ============================================================
   AMERICAN TOWER SCHOOL — main.js
   Animations, Scroll Reveal, Counter, Mobile Menu, Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAV SCROLL ─── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ─── MOBILE MENU ─── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const startVal = 0;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOut(progress) * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  // Observe stat numbers
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ─── PARALLAX on HERO decorative text ─── */
  const decoEn = document.querySelector('.hero__deco--en');
  const decoDe = document.querySelector('.hero__deco--de');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (decoEn) decoEn.style.transform = `translateY(${y * 0.15}px)`;
    if (decoDe) decoDe.style.transform = `translateY(${-y * 0.1}px)`;
  }, { passive: true });

  /* ─── SMOOTH NAV LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── CONTACT FORM → WHATSAPP ─── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name     = document.getElementById('name').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const interest = document.getElementById('interest');
      const level    = document.getElementById('level');

      const interestText = interest.options[interest.selectedIndex]?.text || '';
      const levelText    = level.options[level.selectedIndex]?.text || '';

      const msg = encodeURIComponent(
        `¡Hola! Me llamo *${name}*.\n` +
        `📞 Mi contacto: ${phone}\n` +
        `📚 Interés: ${interestText}\n` +
        `🎯 Nivel actual: ${levelText}\n\n` +
        `Quisiera más información sobre American Tower School. ¡Gracias!`
      );

      window.open(`https://wa.me/522226559584?text=${msg}`, '_blank');
    });
  }

  /* ─── MICRO INTERACTION: Tilt on program cards ─── */
  const cards = document.querySelectorAll('.program-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── ACTIVE NAV LINK on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── PASSIVE SCROLL INDICATOR on hero ─── */
  const heroScrollLine = document.querySelector('.hero__scroll-line');
  if (heroScrollLine) {
    window.addEventListener('scroll', () => {
      const progress = Math.min(window.scrollY / 300, 1);
      heroScrollLine.style.opacity = 1 - progress;
    }, { passive: true });
  }

  /* ─── CSS: Active nav link style ─── */
  const style = document.createElement('style');
  style.textContent = `
    .nav__links a.active {
      color: #fff !important;
    }
    .nav__links a.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);

  /* ─── PAGE LOAD ANIMATION ─── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

});
