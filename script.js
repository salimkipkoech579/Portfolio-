/**
 * Victor Kipkoech - Modern Tech Portfolio
 * Vanilla JavaScript implementation
 * Features: Typing text, Dark/Light mode, Sticky navbar, Animated skills & counters,
 * Portfolio filters & Lightbox modal, Live Nairobi clock, Contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Determine initial theme: saved preference -> system preference -> dark
  const savedTheme = localStorage.getItem('vk_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('vk_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      const sunIcon = themeToggleBtn.querySelector('.icon-sun');
      const moonIcon = themeToggleBtn.querySelector('.icon-moon');
      if (theme === 'light') {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. Typing Text Animation (Hero Section)
  // --------------------------------------------------------------------------
  const typedTextSpan = document.getElementById('typedText');
  const roles = [
    'Full Stack Developer',
    'Mathematics Teacher',
    'Physics Teacher',
    'Ethical Hacker',
    'Digital Entrepreneur'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingDelay = 90;
  const erasingDelay = 45;
  const newRoleDelay = 1800;

  function typeEffect() {
    if (!typedTextSpan) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delta = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
      delta = newRoleDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delta = 400;
    }

    setTimeout(typeEffect, delta);
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 3. Header Scroll Effect & Navigation Spy
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background blur & shrink
    if (scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 350) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Scroll Spy: highlight current section link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileNavToggle && mobileDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileNavToggle.classList.toggle('open', isOpen);
      mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileNavToggle.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileNavToggle.contains(e.target)
      ) {
        mobileDrawer.classList.remove('open');
        mobileNavToggle.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (IntersectionObserver with Varied Effects)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-on-scroll, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-in, .reveal-fade'
  );

  // Auto-apply staggered delays to elements inside a .reveal-stagger-group
  document.querySelectorAll('.reveal-stagger-group').forEach(group => {
    const children = group.querySelectorAll('.reveal, .reveal-on-scroll, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-in, .reveal-fade');
    children.forEach((child, index) => {
      if (!child.style.transitionDelay && !child.getAttribute('data-delay')) {
        child.style.transitionDelay = `${index * 80}ms`;
      }
    });
  });

  // Apply individual data-delay attribute if present
  revealElements.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 6. Skills Progress Bars (Animated on scroll)
  // --------------------------------------------------------------------------
  const skillBars = document.querySelectorAll('.progress-fill');
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetPercent = fill.getAttribute('data-percent') || '0';
        fill.style.width = `${targetPercent}%`;
        observer.unobserve(fill);
      }
    });
  }, {
    threshold: 0.2
  });

  skillBars.forEach(bar => skillsObserver.observe(bar));

  // --------------------------------------------------------------------------
  // 7. Statistics Animated Counters
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'), 10) || 0;
        animateCounter(target, targetValue);
        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.4
  });

  statNumbers.forEach(stat => statsObserver.observe(stat));

  function animateCounter(element, target) {
    const duration = 1800; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(ease * target);
      element.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // --------------------------------------------------------------------------
  // 8. Portfolio Category Filter & Lightbox Modal
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxHeroImg = document.getElementById('lightboxHeroImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClient = document.getElementById('lightboxClient');
  const lightboxTech = document.getElementById('lightboxTech');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Lightbox view details
  const viewDetailBtns = document.querySelectorAll('.view-project-btn');
  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.portfolio-card');
      if (!card || !lightboxModal) return;

      const title = card.querySelector('.portfolio-title')?.textContent || '';
      const category = card.getAttribute('data-category-label') || '';
      const summary = card.getAttribute('data-long-desc') || card.querySelector('.portfolio-summary')?.textContent || '';
      const img = card.querySelector('.portfolio-img')?.getAttribute('src') || '';
      const client = card.getAttribute('data-client') || 'Private Client';
      const tech = card.getAttribute('data-tech') || 'Modern Web Stack';

      if (lightboxHeroImg) lightboxHeroImg.src = img;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = category;
      if (lightboxDesc) lightboxDesc.textContent = summary;
      if (lightboxClient) lightboxClient.textContent = client;
      if (lightboxTech) lightboxTech.textContent = tech;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Service Card Book / Inquire pre-selection
  // --------------------------------------------------------------------------
  const serviceActionLinks = document.querySelectorAll('.service-action-link');
  const serviceSelect = document.getElementById('serviceSelect');

  serviceActionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = link.getAttribute('data-service-name');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. Live Nairobi Digital Clock
  // --------------------------------------------------------------------------
  const nairobiClock = document.getElementById('nairobiClock');

  function updateNairobiTime() {
    if (!nairobiClock) return;
    try {
      const now = new Date();
      // Format time in Nairobi (Africa/Nairobi, UTC+3)
      const options = {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeFormatter = new Intl.DateTimeFormat('en-US', options);
      nairobiClock.textContent = `${timeFormatter.format(now)} EAT`;
    } catch {
      nairobiClock.textContent = 'Active (UTC+3)';
    }
  }

  updateNairobiTime();
  setInterval(updateNairobiTime, 1000);

  // --------------------------------------------------------------------------
  // 11. Contact Form Handling & Direct WhatsApp Forwarding
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('serviceSelect');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value : 'General Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showFeedback('Please fill in all required fields.', 'error');
        return;
      }

      // Successful client-side submission simulation
      showFeedback(
        `Thank you, ${name}! Your message regarding "${subject}" has been received. You can also send this directly via WhatsApp for an immediate response.`,
        'success'
      );

      // Offer direct WhatsApp link option
      const encodedMsg = encodeURIComponent(
        `Hello Victor, my name is ${name} (${email}). Regarding ${subject}: ${message}`
      );
      const waUrl = `https://wa.me/254769669814?text=${encodedMsg}`;

      // Reset form fields
      contactForm.reset();

      // Open prompt or WhatsApp if user desires instant reply
      setTimeout(() => {
        if (confirm('Would you like to forward this message directly to Victor Kipkoech on WhatsApp now?')) {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
      }, 700);
    });
  }

  function showFeedback(text, type) {
    if (!formFeedback) return;
    formFeedback.textContent = text;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';

    setTimeout(() => {
      if (type === 'success') {
        formFeedback.style.display = 'none';
      }
    }, 8000);
  }
});
