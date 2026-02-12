/* ============================================================
   LANDO NORRIS – WEBSITE INTERACTIVITY
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- THEME TOGGLE ----------
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('ln-theme') || 'dark';
  if (savedTheme === 'light') {
    htmlEl.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (newTheme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
    } else {
      htmlEl.removeAttribute('data-theme');
    }
    localStorage.setItem('ln-theme', newTheme);
  });

  // ---------- HEADER SCROLL ----------
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ---------- MOBILE MENU ----------
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded',
      hamburger.classList.contains('active'));
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on nav link click
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- SCROLL REVEAL ----------
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- HELMET CAROUSEL ----------
  const carousel = document.getElementById('helmets-carousel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const progressBar = document.getElementById('carousel-progress-bar');

  const scrollAmount = 300;

  function updateProgress() {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const progress = maxScroll > 0 ? (carousel.scrollLeft / maxScroll) * 100 : 0;
    const barWidth = Math.max(10, Math.min(100, 30 + progress * 0.7));
    progressBar.style.width = `${barWidth}%`;
    progressBar.style.marginLeft = `${progress * 0.7}%`;
  }

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  carousel.addEventListener('scroll', updateProgress, { passive: true });

  // Drag-to-scroll for carousel
  let isDragging = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mouseup', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  }, { passive: true });

  // ---------- HERO PARTICLES ----------
  const particlesContainer = document.getElementById('hero-particles');

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = (60 + Math.random() * 40) + '%';
    const duration = 4 + Math.random() * 6;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    const size = 1 + Math.random() * 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.opacity = 0.2 + Math.random() * 0.4;
    particlesContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, (duration + 2) * 1000);
  }

  // Create particles periodically
  setInterval(createParticle, 400);

  // Initial batch
  for (let i = 0; i < 15; i++) {
    setTimeout(createParticle, i * 100);
  }

  // ---------- PARALLAX ON HERO ----------
  const heroContent = document.querySelector('.hero-content');
  const heroNumber = document.querySelector('.hero-number');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight) {
      const ratio = scrollY / heroHeight;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - ratio * 1.2;
      heroNumber.style.transform = `translateY(${scrollY * -0.15}px)`;
    }
  }, { passive: true });

  // ---------- ACTIVE NAV LINK ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-72px 0px 0px 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // ---------- SMOOTH SCROLL FOR NAV LINKS ----------
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ---------- HELMET CARD HOVER GLOW ----------
  const helmetCards = document.querySelectorAll('.helmet-card');

  helmetCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ---------- COUNTER ANIMATION FOR HERO ----------
  // Initialize progress bar
  updateProgress();
});
