// =============================================
// REPORTS QM — Property Reporting Kit
// Interactions & Animations
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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // Trigger hero reveals immediately
  setTimeout(() => {
    document.querySelectorAll('.rk-hero .reveal').forEach(el => el.classList.add('visible'));
  }, 100);

  // ---- COUNT UP ANIMATION ----
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 30);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObserver.observe(el));
  }

  // ---- BAR CHART ANIMATION ----
  const bars = document.querySelectorAll('.rk-bar');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach((bar, i) => {
            const targetH = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => {
              bar.style.transition = 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
              bar.style.height = targetH;
            }, i * 80);
          });
          barObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (bars[0]) barObserver.observe(bars[0].parentElement);
  }

  // ---- CONTACT FORM ----
  window.handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('[id$="-form-submit-btn"]') || form.querySelector('button[type="submit"]');
    const success = form.querySelector('[id$="-form-success"]') || form.querySelector('.form-success');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }
    setTimeout(() => {
      form.reset();
      if (btn) btn.style.display = 'none';
      if (success) success.classList.remove('hidden');
    }, 1200);
  };

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

    const animateCursor = () => {
      ox += (mx - ox) * 0.12;
      oy += (my - oy) * 0.12;
      cursorOuter.style.left = ox + 'px';
      cursorOuter.style.top = oy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
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

  // ---- PRICING CARD HOVER GLOW ----
  document.querySelectorAll('.rk-pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // ---- SMOOTH ACTIVE NAV ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const activateLink = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.style.color = href === `#${current}` ? '#ffffff' : 'rgba(255,255,255,0.55)';
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });

});
