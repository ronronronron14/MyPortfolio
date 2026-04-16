// ─── Luxury Cursor ───
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0, hovering = false;

  // Position both off-screen initially
  cursor.style.left = '-100px'; cursor.style.top = '-100px';
  ring.style.left   = '-100px'; ring.style.top   = '-100px';

  // Dot follows mouse instantly — offset by half size to center
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = (mx - 4) + 'px';
    cursor.style.top  = (my - 4) + 'px';
  });

  // Ring follows with smooth spring lag
  (function animateRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = (rx - 19) + 'px';
    ring.style.top  = (ry - 19) + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover — dot vanishes, ring expands
  document.querySelectorAll('a, button, .work-item, .filter-btn, .nav-cta, .form-submit, .service-card, .next-project').forEach(el => {
    el.addEventListener('mouseenter', () => {
      hovering = true;
      cursor.style.opacity = '0';
      ring.style.width       = '60px';
      ring.style.height      = '60px';
      ring.style.borderColor = 'rgba(255,255,255,0.5)';
      ring.style.background  = 'rgba(255,255,255,0.05)';
    });
    el.addEventListener('mouseleave', () => {
      hovering = false;
      cursor.style.opacity = '1';
      ring.style.width       = '38px';
      ring.style.height      = '38px';
      ring.style.borderColor = 'rgba(255,255,255,0.35)';
      ring.style.background  = 'transparent';
    });
  });

  // Click squeeze
  document.addEventListener('mousedown', () => {
    ring.style.width  = hovering ? '50px' : '26px';
    ring.style.height = hovering ? '50px' : '26px';
  });
  document.addEventListener('mouseup', () => {
    ring.style.width  = hovering ? '60px' : '38px';
    ring.style.height = hovering ? '60px' : '38px';
  });
}

// ─── Burger / Mobile Menu ───
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

function closeMobileMenu() {
  if (!mobileMenu || !burger) return;
  menuOpen = false;
  mobileMenu.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

// ─── Scroll Reveal ───
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(r => observer.observe(r));
}

// ─── Filter Buttons ───
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems  = document.querySelectorAll('.work-item');

if (filterBtns.length && workItems.length) {
  workItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selected = btn.textContent.trim().toLowerCase();
      workItems.forEach(item => {
        const match = selected === 'all' || item.getAttribute('data-category') === selected;
        if (match) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ─── Nav Scroll Effect ───
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 80
      ? 'rgba(15,15,13,0.95)'
      : 'linear-gradient(to bottom, rgba(15,15,13,0.9) 0%, transparent 100%)';
  });
}

// ─── Contact Form (Formspree) ───
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      const err = field.parentElement.querySelector('.form-error-msg');
      const bad = !field.value.trim() || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
      if (bad) { valid = false; field.style.borderColor = '#8a3a3a'; if (err) err.style.display = 'block'; }
      else { field.style.borderColor = ''; if (err) err.style.display = 'none'; }
    });
    if (!valid) return;
    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Sending...'; btn.disabled = true; btn.style.opacity = '0.6';
    try {
      const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        document.getElementById('form-success').style.display = 'block';
        document.getElementById('form-error').style.display   = 'none';
        contactForm.reset(); btn.textContent = 'Sent ✓'; btn.style.background = '#a89f8c';
      } else throw new Error();
    } catch {
      document.getElementById('form-error').style.display   = 'block';
      document.getElementById('form-success').style.display = 'none';
      btn.textContent = 'Send Message →'; btn.disabled = false; btn.style.opacity = '1';
    }
  });
  contactForm.querySelectorAll('.form-input, .form-textarea').forEach(f => {
    f.addEventListener('input', () => {
      f.style.borderColor = '';
      const err = f.parentElement.querySelector('.form-error-msg');
      if (err) err.style.display = 'none';
    });
  });
}
