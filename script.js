document.addEventListener('DOMContentLoaded', () => {

  // Force page scroll to top on load (ignore previous cached scroll position)
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ==========================================
  // LIGHT/DARK THEME SYSTEM
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  const mobileThemeIcon = document.getElementById('mobile-theme-icon');

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.className = 'bx bx-moon';
      if (mobileThemeIcon) mobileThemeIcon.className = 'bx bx-moon';
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) themeIcon.className = 'bx bx-sun';
      if (mobileThemeIcon) mobileThemeIcon.className = 'bx bx-sun';
      localStorage.setItem('portfolio-theme', 'dark');
    }
  }

  // Check saved preference, default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

  // Toggle button actions
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      setTheme(currentTheme);
    });
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      setTheme(currentTheme);
    });
  }


  // ==========================================
  // HEADER SCROLL TRANSITION
  // ==========================================
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // MOBILE NAVIGATION MENU
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      
      // Update active state in mobile menu
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
  // ACTIVE NAVLINK HIGHLIGHT ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

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
      desc: 'AgroSonic Defence System is an advanced automated agricultural security network. Powered by ESP32 microcontrollers, it incorporates ultrasonic ranging, thermal sensors, and machine learning models to identify pest/animal intruders. Upon threat validation, it triggers targeted acoustic frequencies and strobe lights to deter them safely while notifying farmers in real-time via local gateways.',
      tags: ['ESP32', 'IoT Sensors', 'Machine Learning', 'Acoustic Deterrents'],
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
      previewTitle.textContent = `${proj.title} - Presentation`;
      const pptPath = proj.pptUrl;
      const pdfPath = pptPath.replace('.pptx', '.pdf');

      // Load the PDF directly into the iframe.
      // Direct load works consistently offline, under file:// protocols, and on local web servers without CORS blocks.
      previewIframe.src = pdfPath;
      previewIframe.style.display = 'block';
      fallbackMsg.style.display = 'none';

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
  // HERO GRAPHIC PARALLAX INTERACTION
  // ==========================================
  const heroGraphic = document.querySelector('.hero-graphic');
  const floatingElements = document.querySelectorAll('.floating-badge, .floating-sphere, .floating-doodle');

  if (heroGraphic) {
    heroGraphic.addEventListener('mousemove', (e) => {
      const rect = heroGraphic.getBoundingClientRect();
      // Mouse position relative to center of container (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      floatingElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 1;
        const translateX = x * 35 * speed;
        const translateY = y * 35 * speed;
        
        // Combine floating animation with mouse parallax
        el.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    });

    heroGraphic.addEventListener('mouseleave', () => {
      floatingElements.forEach(el => {
        el.style.transform = '';
      });
    });
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
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }
});
