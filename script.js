document.addEventListener('DOMContentLoaded', () => {

  // Force page scroll to top on load (ignore previous cached scroll position)
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ==========================================
  // LIGHT/DARK THEME SYSTEM (DEFAULT: DARK THEME)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  const mobileThemeIcon = document.getElementById('mobile-theme-icon');

  function setTheme(theme, persist = true) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.className = 'bx bx-moon';
      if (mobileThemeIcon) mobileThemeIcon.className = 'bx bx-moon';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
      if (mobileThemeToggleBtn) mobileThemeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
      if (persist) {
        try {
          localStorage.setItem('portfolio-theme-preference-v2', 'light');
        } catch (e) {}
      }
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) themeIcon.className = 'bx bx-sun';
      if (mobileThemeIcon) mobileThemeIcon.className = 'bx bx-sun';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
      if (mobileThemeToggleBtn) mobileThemeToggleBtn.setAttribute('title', 'Switch to Light Theme');
      if (persist) {
        try {
          localStorage.setItem('portfolio-theme-preference-v2', 'dark');
        } catch (e) {}
      }
    }
  }

  // Check saved preference; default to DARK theme
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('portfolio-theme-preference-v2') || 'dark';
  } catch (e) {}

  // Apply default theme
  setTheme(savedTheme, false);

  // Toggle button actions
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      setTheme(currentTheme, true);
    });
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      setTheme(currentTheme, true);
    });
  }


  // ==========================================
  // HEADER REFERENCE (SCROLL MANAGED VIA UNIFIED ENGINE)
  // ==========================================
  const header = document.querySelector('header');

  // ==========================================
  // MOBILE NAVIGATION MENU
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      mobileLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });



  // Fallback handler if images fail to load
  const projectImages = document.querySelectorAll('.project-img-display');
  projectImages.forEach(img => {
    function handleLoadSuccess() {
      img.style.display = 'block';
      const fallback = img.nextElementSibling;
      if (fallback && fallback.classList.contains('project-img-fallback')) {
        fallback.style.display = 'none';
      }
    }

    function handleLoadError() {
      img.style.display = 'none';
      const fallback = img.nextElementSibling;
      if (fallback && fallback.classList.contains('project-img-fallback')) {
        fallback.style.display = 'flex';
      }
    }

    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) {
        handleLoadSuccess();
      } else {
        handleLoadError();
      }
    });
    
    img.addEventListener('error', handleLoadError);

    // Initial check for cached or already failed images
    if (img.complete) {
      if (img.naturalWidth > 0) {
        handleLoadSuccess();
      } else {
        handleLoadError();
      }
    }
  });

  // ==========================================
  // CERTIFICATIONS FILTER EXPLORER
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const certCards = document.querySelectorAll('.cert-card');

  // Count categories dynamically and append to headings if required
  function updateCategoryCounts() {
    const counts = { all: certCards.length, security: 0, sysadmin: 0, cloud: 0 };
    certCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    filterTabs.forEach(tab => {
      const filter = tab.getAttribute('data-filter');
      const baseText = tab.textContent.split(' (')[0];
      if (counts[filter] !== undefined) {
        tab.textContent = `${baseText} (${counts[filter]})`;
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      // Filter cards
      certCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          // trigger subtle animation entry
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Run counting
  updateCategoryCounts();

  // ==========================================
  // ACTIVE NAVLINK SECTION CACHE (ZERO FORCED REFLOWS)
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  let sectionPositions = [];

  function cacheSectionPositions() {
    sectionPositions = [];
    sections.forEach(sec => {
      const id = sec.getAttribute('id');
      if (id) {
        sectionPositions.push({
          id: id,
          top: sec.offsetTop - 160
        });
      }
    });
  }
  cacheSectionPositions();

  // Debounced recalculation on resize / orientation change only
  let sectionResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(sectionResizeTimer);
    sectionResizeTimer = setTimeout(cacheSectionPositions, 200);
  }, { passive: true });

  // ==========================================
  // MODALS ORCHESTRATION (CONTACT & PROJECTS)
  // ==========================================
  const contactModal = document.getElementById('contact-modal');
  const contactModalClose = document.getElementById('modal-close-btn');
  const contactBtnHeader = document.getElementById('contact-btn-header');

  function openContactModal(e) {
    if (e) e.preventDefault();
    contactModal.classList.add('active');
  }

  function closeContactModal() {
    contactModal.classList.remove('active');
  }

  // Bind email click elements to modal triggers
  if (contactBtnHeader) {
    contactBtnHeader.addEventListener('click', openContactModal);
  }

  if (contactModalClose) {
    contactModalClose.addEventListener('click', closeContactModal);
  }

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  // Project Details Modal
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close-btn');
  const pmTitle = document.getElementById('pm-title');
  const pmDesc = document.getElementById('pm-desc');
  const pmTags = document.getElementById('pm-tags');

  const projectDetails = {
    agro: {
      title: 'AgroSonic Defence System',
      desc: 'AgroSonic Defence System is an advanced automated agricultural security network. Powered by ESP32 microcontrollers, it incorporates ultrasonic ranging, thermal sensors, and machine learning models to identify pest/animal intruders. Upon threat validation, it triggers targeted acoustic frequencies and strobe lights to deter them safely while notifying farmers in real-time via local gateways. Aimed at reducing 30–40% annual crop losses while significantly enhancing agricultural resilience.',
      tags: ['ESP32', 'IoT Sensors', 'Machine Learning', 'Acoustic Deterrents', 'Crop Resilience'],
      pptUrl: 'certs/AgroSonic_Defence_Final_ppt.pptx'
    }
  };

  const pmAction = document.getElementById('pm-action');

  window.openProjectModal = function(projectId) {
    const proj = projectDetails[projectId];
    if (proj && projectModal) {
      pmTitle.textContent = proj.title;
      pmDesc.textContent = proj.desc;
      
      // Inject tags
      pmTags.innerHTML = '';
      proj.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        pmTags.appendChild(span);
      });

      // Inject Action button/link if exists
      if (pmAction) {
        if (proj.pptUrl) {
          pmAction.innerHTML = `
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="${proj.pptUrl}" class="btn-primary" style="display: inline-flex; text-align: center; gap: 10px;" download>
                <i class='bx bx-download' style="font-size: 1.2rem;"></i> Download PPTX
              </a>
              <button class="btn-outline" onclick="openPptPreview('${projectId}')" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px;">
                <i class='bx bx-slideshow' style="font-size: 1.2rem;"></i> Preview Slides
              </button>
            </div>
          `;
        } else {
          pmAction.innerHTML = '';
        }
      }

      projectModal.classList.add('active');
    }
  };

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
    }
  }

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  // Preview Modal Elements
  const previewModal = document.getElementById('preview-modal');
  const previewModalClose = document.getElementById('preview-modal-close-btn');
  const previewIframe = document.getElementById('preview-iframe');
  const previewTitle = document.getElementById('prev-title');
  const fallbackMsg = document.getElementById('preview-fallback-message');

  window.openPptPreview = function(projectId) {
    const proj = projectDetails[projectId];
    if (proj && previewModal) {
      if (previewTitle) previewTitle.textContent = `${proj.title} - Presentation`;
      const pptPath = proj.pptUrl;
      const pdfPath = pptPath.replace('.pptx', '.pdf');

      // Load the PDF directly into the iframe.
      // Direct load works consistently offline, under file:// protocols, and on local web servers without CORS blocks.
      previewIframe.src = pdfPath;
      previewIframe.style.display = 'block';
      if (fallbackMsg) fallbackMsg.style.display = 'none';

      previewModal.classList.add('active');
    }
  };

  function closePreviewModal() {
    if (previewModal) {
      previewModal.classList.remove('active');
      if (previewIframe) previewIframe.src = '';
    }
  }

  if (previewModalClose) {
    previewModalClose.addEventListener('click', closePreviewModal);
  }

  // ==========================================
  // SHARE SYSTEM API / CLIPBOARD FALLBACK
  // ==========================================
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: 'Jagadeeshwaran S Portfolio',
        text: 'Check out the cybersecurity and offensive security portfolio of Jagadeeshwaran S.',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
          .catch((error) => console.log('Error sharing:', error));
      } else {
        // Fallback: Copy link to clipboard
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            // Show custom visual feedback
            const originalIcon = shareBtn.innerHTML;
            shareBtn.innerHTML = "<i class='bx bx-check'></i>";
            shareBtn.title = "Link Copied!";
            shareBtn.style.color = "var(--accent-mint)";
            shareBtn.style.borderColor = "var(--accent-mint)";
            
            setTimeout(() => {
              shareBtn.innerHTML = originalIcon;
              shareBtn.title = "Share Portfolio";
              shareBtn.style.color = "";
              shareBtn.style.borderColor = "";
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      }
    });
  }

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
    if (e.target === projectModal) {
      closeProjectModal();
    }
    if (e.target === previewModal) {
      closePreviewModal();
    }
  });

  // ==========================================
  // HERO GRAPHIC PARALLAX INTERACTION (RAF THROTTLED)
  // ==========================================
  const heroGraphic = document.querySelector('.hero-graphic');
  const floatingElements = document.querySelectorAll('.floating-badge, .floating-sphere, .floating-doodle');

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroGraphic && canHover && !prefersReduced) {
    let heroRect = null;
    let heroRafId = null;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function renderHeroParallax() {
      heroRafId = null;
      if (!heroRect) return;

      const normX = (targetMouseX - heroRect.left) / heroRect.width - 0.5;
      const normY = (targetMouseY - heroRect.top) / heroRect.height - 0.5;

      floatingElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 1;
        const translateX = (normX * 35 * speed).toFixed(2);
        const translateY = (normY * 35 * speed).toFixed(2);
        el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });
    }

    heroGraphic.addEventListener('mouseenter', () => {
      heroRect = heroGraphic.getBoundingClientRect();
    }, { passive: true });

    heroGraphic.addEventListener('mousemove', (e) => {
      if (!heroRect) heroRect = heroGraphic.getBoundingClientRect();
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;

      if (!heroRafId) {
        heroRafId = requestAnimationFrame(renderHeroParallax);
      }
    }, { passive: true });

    heroGraphic.addEventListener('mouseleave', () => {
      if (heroRafId) {
        cancelAnimationFrame(heroRafId);
        heroRafId = null;
      }
      heroRect = null;
      floatingElements.forEach(el => {
        el.style.transform = '';
      });
    }, { passive: true });
  }

  // ==========================================
  // BUTTONS CLICK RIPPLE EFFECT
  // ==========================================
  const animatedButtons = document.querySelectorAll('button, .btn-primary, .btn-outline, .action-btn, .project-action-btn, .filter-tab, .cert-view-btn');
  animatedButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // ==========================================
  // VIEWPORT SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('active');
          observer.unobserve(el);
          // Free GPU compositor layer after reveal animation completes
          setTimeout(() => {
            el.style.willChange = 'auto';
          }, 900);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // DYNAMIC LIQUID GLASS SPECULAR SPOTLIGHT (RAF THROTTLED)
  // ==========================================
  const glassCards = document.querySelectorAll('.service-card, .timeline-card, .skill-category-card, .cert-card, .single-project-card, .about-bio, .stat-box');
  
  if (canHover) {
    glassCards.forEach(card => {
      let cardRect = null;
      let cardRafId = null;
      let mouseCardX = 0;
      let mouseCardY = 0;

      function renderCardSpotlight() {
        cardRafId = null;
        card.style.setProperty('--mouse-x', `${mouseCardX}px`);
        card.style.setProperty('--mouse-y', `${mouseCardY}px`);
      }

      card.addEventListener('mouseenter', () => {
        cardRect = card.getBoundingClientRect();
      }, { passive: true });

      card.addEventListener('mousemove', (e) => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        mouseCardX = Math.round(e.clientX - cardRect.left);
        mouseCardY = Math.round(e.clientY - cardRect.top);

        if (!cardRafId) {
          cardRafId = requestAnimationFrame(renderCardSpotlight);
        }
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (cardRafId) {
          cancelAnimationFrame(cardRafId);
          cardRafId = null;
        }
        cardRect = null;
      }, { passive: true });
    });
  }

  // ==========================================
  // CONSOLIDATED MASTER SCROLL ENGINE (SINGLE RAF LOOP)
  // ==========================================
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const glowBlobs = document.querySelectorAll('.glow-blob');

  let scrollTicking = false;
  let cachedScrollY = 0;
  let isHeaderScrolled = false;
  let isBackToTopVisible = false;
  let activeNavId = '';

  function handleUnifiedScroll() {
    const scrollY = cachedScrollY;

    // 1. Header glass morph on scroll
    const shouldHeaderScroll = scrollY > 50;
    if (shouldHeaderScroll !== isHeaderScrolled) {
      isHeaderScrolled = shouldHeaderScroll;
      header?.classList.toggle('scrolled', shouldHeaderScroll);
    }

    // 2. Active Section Navigation Link (Uses cached section offsets)
    let matchedId = 'home';
    for (let i = 0; i < sectionPositions.length; i++) {
      if (scrollY >= sectionPositions[i].top) {
        matchedId = sectionPositions[i].id;
      }
    }
    if (matchedId !== activeNavId) {
      activeNavId = matchedId;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${matchedId}`);
      });
    }

    // 3. Scroll Progress Indicator
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // 4. Back to Top Button
    const shouldBackToTop = scrollY > 400;
    if (shouldBackToTop !== isBackToTopVisible) {
      isBackToTopVisible = shouldBackToTop;
      backToTopBtn?.classList.toggle('visible', shouldBackToTop);
    }

    // 5. Subtle ambient glow parallax (desktop only, respecting motion preference)
    if (!prefersReduced && window.innerWidth > 768 && glowBlobs.length > 0) {
      const scrollFactor = (scrollY * 0.035).toFixed(1);
      glowBlobs.forEach((blob, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        blob.style.transform = `translate3d(0, ${dir * scrollFactor}px, 0)`;
      });
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    cachedScrollY = window.scrollY;
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(handleUnifiedScroll);
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // PAGE VISIBILITY: BATTERY & GPU PRESERVER
  // ==========================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('page-hidden');
    } else {
      document.body.classList.remove('page-hidden');
    }
  });

  // ==========================================
  // STATS NUMBER ROLL-UP ANIMATION ON SCROLL
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const decimals = parseInt(stat.getAttribute('data-decimals')) || 0;
      const suffix = stat.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      const duration = 1800;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = (target * easeProgress).toFixed(decimals);

        stat.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const statsContainer = document.querySelector('.about-stats');
  if (statsContainer && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsContainer);
  }
});
