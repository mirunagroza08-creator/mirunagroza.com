// =============================================
// MIRUNA GROZA — Interactions & Animations
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAV SCROLL BEHAVIOUR ----
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // close on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // Trigger hero reveals immediately (they're above the fold)
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  }, 100);

  // ---- CONTACT FORM ----
  window.handleSubmit = async (e) => {
    e.preventDefault();
    const form    = document.getElementById('contact-form');
    const btn     = document.getElementById('form-submit-btn');
    const success = document.getElementById('form-success');
    const errorEl = document.getElementById('form-error');

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const service = (form.querySelector('[name="service"]') || {}).value || '';

    btn.textContent = 'Sending…';
    btn.disabled = true;
    if (errorEl) errorEl.classList.add('hidden');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key:          WEB3FORMS_KEY,
          name,
          email,
          message:             service ? `[${service}]\n\n${message}` : message,
          subject:             `New inquiry from ${name}`,
          // Auto-reply to the submitter
          autoresponse:        true,
          autoresponse_subject:'Got your message — Miruna Groza',
          autoresponse_message:`Hi ${name},\n\nThanks for reaching out! I've received your inquiry and will get back to you within 48 hours.\n\n— Miruna`,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      form.reset();
      btn.style.display = 'none';
      success.classList.remove('hidden');
    } catch (err) {
      console.error('Web3Forms error:', err);
      btn.textContent = 'Send message';
      btn.disabled = false;
      if (errorEl) errorEl.classList.remove('hidden');
    }
  };

  // ---- SMOOTH ACTIVE NAV LINKS ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const activateLink = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? '#ffffff'
        : 'rgba(255,255,255,0.55)';
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });

  // ---- PARALLAX subtle on hero image ----
  const heroImg = document.querySelector('.hero-image');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      heroImg.style.transform = `translateY(${offset * 0.18}px)`;
    }, { passive: true });
  }

  // ---- CURSOR TRAIL (desktop only) ----
  if (window.matchMedia('(hover: hover)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0; z-index: 9999;
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(201,170,113,0.8);
      pointer-events: none; transform: translate(-50%,-50%);
      transition: transform 0.1s, opacity 0.3s;
      mix-blend-mode: screen;
    `;
    const cursorOuter = document.createElement('div');
    cursorOuter.style.cssText = `
      position: fixed; top: 0; left: 0; z-index: 9998;
      width: 32px; height: 32px; border-radius: 50%;
      border: 1px solid rgba(201,170,113,0.35);
      pointer-events: none; transform: translate(-50%,-50%);
      transition: transform 0.25s ease, width 0.3s, height 0.3s, opacity 0.3s;
    `;
    document.body.append(cursor, cursorOuter);

    let mx = 0, my = 0, ox = 0, oy = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    // Smooth outer cursor
    const animateCursor = () => {
      ox += (mx - ox) * 0.12;
      oy += (my - oy) * 0.12;
      cursorOuter.style.left = ox + 'px';
      cursorOuter.style.top = oy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Expand on interactive elements
    const interactives = document.querySelectorAll('a, button, input, select, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOuter.style.width = '52px';
        cursorOuter.style.height = '52px';
        cursorOuter.style.borderColor = 'rgba(201,170,113,0.6)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOuter.style.width = '32px';
        cursorOuter.style.height = '32px';
        cursorOuter.style.borderColor = 'rgba(201,170,113,0.35)';
      });
    });
  }

  // ---- COUNT UP numbers (if any stat blocks added later) ----
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 28);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObserver.observe(el));
  }

});
