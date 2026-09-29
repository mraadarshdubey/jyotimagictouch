/**
 * Jyoti Magic Touch — Interactive JavaScript
 * Plain ES6+ Vanilla JavaScript for Beauty Salon & Academy Website
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Primary WhatsApp phone number
  const PRIMARY_PHONE = '8160666278';
  const SECONDARY_PHONE = '8799279247';

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE SECTION HIGHLIGHTING (RAF Throttled)
     ========================================================================== */
  const header = document.getElementById('top-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  let isHeaderScrolled = false;
  let scrollTicking = false;

  const updateHeaderOnScroll = () => {
    const shouldBeScrolled = window.scrollY > 30;
    if (shouldBeScrolled !== isHeaderScrolled) {
      isHeaderScrolled = shouldBeScrolled;
      if (isHeaderScrolled) {
        header?.classList.add('is-scrolled');
      } else {
        header?.classList.remove('is-scrolled');
      }
    }
    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeaderOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  updateHeaderOnScroll();

  // Active section indicator using IntersectionObserver
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0.05
    });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // Silky smooth scroll for all hash links with fixed header offset compensation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileDrawerClose?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close drawer if user clicks outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer?.classList.contains('is-open')) {
      if (!mobileDrawer.contains(e.target) && !mobileToggle?.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  /* ==========================================================================
     3. SCROLL REVEAL (IntersectionObserver with GPU settlement cleanup)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          entry.target.addEventListener('transitionend', () => {
            entry.target.classList.add('is-revealed-settled');
          }, { once: true });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px -25px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     4. ACADEMY COURSES ACCORDION
     ========================================================================== */
  const academyCourseItems = document.querySelectorAll('.academy-course-item');

  academyCourseItems.forEach(item => {
    const headerBtn = item.querySelector('.course-header-btn');
    const bodyPanel = item.querySelector('.course-body-panel');
    const toggleIcon = item.querySelector('.course-toggle-indicator');

    headerBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (single open behavior)
      academyCourseItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          otherItem.querySelector('.course-header-btn')?.setAttribute('aria-expanded', 'false');
          const otherPanel = otherItem.querySelector('.course-body-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
          const otherIcon = otherItem.querySelector('.course-toggle-indicator');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('is-open');
        headerBtn.setAttribute('aria-expanded', 'false');
        if (bodyPanel) bodyPanel.style.maxHeight = null;
        if (toggleIcon) toggleIcon.textContent = '+';
      } else {
        item.classList.add('is-open');
        headerBtn.setAttribute('aria-expanded', 'true');
        if (bodyPanel) {
          bodyPanel.style.maxHeight = bodyPanel.scrollHeight + 30 + 'px';
        }
        if (toggleIcon) toggleIcon.textContent = '−';
      }
    });
  });

  /* ==========================================================================
     4B. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');
    const toggleIcon = item.querySelector('.faq-toggle-icon');

    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          otherItem.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
          const otherIcon = otherItem.querySelector('.faq-toggle-icon');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        questionBtn.setAttribute('aria-expanded', 'false');
        if (answerPanel) answerPanel.style.maxHeight = null;
        if (toggleIcon) toggleIcon.textContent = '+';
      } else {
        item.classList.add('is-open');
        questionBtn.setAttribute('aria-expanded', 'true');
        if (answerPanel) answerPanel.style.maxHeight = answerPanel.scrollHeight + 40 + 'px';
        if (toggleIcon) toggleIcon.textContent = '−';
      }
    });
  });

  /* ==========================================================================
     5. PORTFOLIO FILTER & LIGHTBOX
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Filter functionality with RAF animation
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          item.style.display = 'block';
          window.requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translate3d(0, 0, 0) scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translate3d(0, 10px, 0) scale(0.96)';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 240);
        }
      });
    });
  });

  // Lightbox functionality
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxTitle = document.getElementById('lightbox-title');

  let currentGalleryIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  const updateLightbox = (index) => {
    const items = visibleGalleryItems();
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentGalleryIndex = index;

    const item = items[index];
    const imgEl = item.querySelector('.gallery-img');
    const catEl = item.querySelector('.gallery-cat');
    const titleEl = item.querySelector('.gallery-title');

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || 'Gallery photo';
    }
    if (lightboxCat && catEl) lightboxCat.textContent = catEl.textContent;
    if (lightboxTitle && titleEl) lightboxTitle.textContent = titleEl.textContent;
  };

  const openLightbox = (index) => {
    if (!lightboxModal) return;
    updateLightbox(index);
    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const items = visibleGalleryItems();
      const currentIdx = items.indexOf(item);
      openLightbox(currentIdx !== -1 ? currentIdx : index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  lightboxPrev?.addEventListener('click', () => {
    updateLightbox(currentGalleryIndex - 1);
  });

  lightboxNext?.addEventListener('click', () => {
    updateLightbox(currentGalleryIndex + 1);
  });

  // Lightbox keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentGalleryIndex + 1);
  });

  /* ==========================================================================
     6. ENQUIRY MODAL & TRIGGER HANDLING
     ========================================================================== */
  const enquiryModal = document.getElementById('enquiry-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseSuccessBtn = document.getElementById('modal-close-success-btn');
  const modalInterestSelect = document.getElementById('modal-interest');
  const modalSuccessBox = document.getElementById('modal-success-box');
  const modalForm = document.getElementById('modal-enquiry-form');

  const openEnquiryModal = (preferredInterest = '') => {
    if (!enquiryModal) return;
    enquiryModal.classList.add('is-open');
    enquiryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Pre-select interest if passed
    if (preferredInterest && modalInterestSelect) {
      for (let i = 0; i < modalInterestSelect.options.length; i++) {
        if (modalInterestSelect.options[i].value.toLowerCase().includes(preferredInterest.toLowerCase())) {
          modalInterestSelect.selectedIndex = i;
          break;
        }
      }
    }

    // Reset success state if previously shown
    if (modalSuccessBox) modalSuccessBox.hidden = true;
    if (modalForm) modalForm.hidden = false;
  };

  const closeEnquiryModal = () => {
    if (!enquiryModal) return;
    enquiryModal.classList.remove('is-open');
    enquiryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach modal triggers
  document.querySelectorAll('[data-modal-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const interest = btn.getAttribute('data-modal-trigger') || '';
      openEnquiryModal(interest === 'general' ? '' : interest);
    });
  });

  modalCloseBtn?.addEventListener('click', closeEnquiryModal);
  modalBackdrop?.addEventListener('click', closeEnquiryModal);
  modalCloseSuccessBtn?.addEventListener('click', closeEnquiryModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && enquiryModal?.classList.contains('is-open')) {
      closeEnquiryModal();
    }
  });

  /* ==========================================================================
     7. FORM VALIDATION, ROUTING FEEDBACK & WHATSAPP INTEGRATION
     ========================================================================== */
  const enquiryForm = document.getElementById('enquiry-form');
  const interestSelect = document.getElementById('form-interest');
  const routingHint = document.getElementById('routing-hint');
  const routingHintText = document.getElementById('routing-hint-text');
  const formSuccessState = document.getElementById('form-success-state');
  const successUserName = document.getElementById('success-user-name');
  const successUserInterest = document.getElementById('success-user-interest');
  const successWhatsappLink = document.getElementById('success-whatsapp-link');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');

  // Service vs Academy Categorization
  const serviceInterests = [
    'Beauty Service', 'Bridal Makeup', 'Party / Occasion Makeup',
    'Hairstyling', 'Facial & Skin Care', 'Waxing & Eyebrow', 'Mehendi', 'Nail Art'
  ];

  const academyInterests = [
    'Beauty Academy', 'Makeup Training', 'Hairstyle Training',
    'Bridal Makeup Training', 'Mehendi Training', 'Beauty & Salon Skills'
  ];

  // Routing hint updater
  const updateRoutingHint = (interest) => {
    if (!routingHint || !routingHintText) return;
    if (!interest) {
      routingHint.hidden = true;
      return;
    }

    routingHint.hidden = false;
    if (academyInterests.includes(interest)) {
      routingHintText.textContent = 'Your enquiry is related to professional beauty training at Jyoti Magic Touch Academy.';
    } else if (serviceInterests.includes(interest)) {
      routingHintText.textContent = 'Your enquiry is related to salon & beauty styling services.';
    } else {
      routingHintText.textContent = 'We will get back to you with personalized details.';
    }
  };

  interestSelect?.addEventListener('change', (e) => {
    updateRoutingHint(e.target.value);
  });

  // Helper to build WhatsApp Click-to-Chat URL
  const buildWhatsAppUrl = (name = '', interest = '', branch = '', customMessage = '') => {
    const interestText = interest || 'your beauty services / academy courses';
    const nameText = name || 'Customer';
    
    let message = `Hello Jyoti Magic Touch, I would like to enquire about ${interestText}. My name is ${nameText}.`;
    if (branch && branch !== 'Not Sure') {
      message += ` Preferred branch: ${branch}.`;
    }
    if (customMessage) {
      message += ` Details: ${customMessage}`;
    }

    return `https://wa.me/91${PRIMARY_PHONE}?text=${encodeURIComponent(message)}`;
  };

  // WhatsApp button on main contact form
  whatsappDirectBtn?.addEventListener('click', () => {
    const name = document.getElementById('form-name')?.value.trim() || '';
    const interest = document.getElementById('form-interest')?.value || '';
    const branch = document.getElementById('form-branch')?.value || '';
    const msg = document.getElementById('form-message')?.value.trim() || '';
    
    const url = buildWhatsAppUrl(name, interest, branch, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // WhatsApp button on modal
  modalWhatsappBtn?.addEventListener('click', () => {
    const name = document.getElementById('modal-name')?.value.trim() || '';
    const interest = document.getElementById('modal-interest')?.value || '';
    const branch = document.getElementById('modal-branch')?.value || '';
    const msg = document.getElementById('modal-message')?.value.trim() || '';

    const url = buildWhatsAppUrl(name, interest, branch, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // Quick Interest Category Switcher Tabs
  const quickTabBtns = document.querySelectorAll('.quick-tab-btn');
  quickTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      quickTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      if (interestSelect) {
        if (category === 'service') {
          interestSelect.value = 'Beauty Service';
        } else if (category === 'academy') {
          interestSelect.value = 'Beauty Academy';
        } else {
          interestSelect.value = 'Other';
        }
        updateRoutingHint(interestSelect.value);
        interestSelect.closest('.form-group')?.classList.remove('has-error');
      }
    });
  });

  // Main Enquiry Form Submission Handler
  enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const interestInput = document.getElementById('form-interest');
    const branchInput = document.getElementById('form-branch');
    const messageInput = document.getElementById('form-message');

    let isValid = true;

    // Validate Name
    if (!nameInput?.value.trim()) {
      nameInput?.closest('.form-group')?.classList.add('has-error');
      isValid = false;
    } else {
      nameInput?.closest('.form-group')?.classList.remove('has-error');
    }

    // Validate Phone (10 digits)
    const phoneVal = phoneInput?.value.trim() || '';
    const cleanPhone = phoneVal.replace(/\D/g, '');
    if (!/^[0-9]{10}$/.test(cleanPhone.slice(-10))) {
      phoneInput?.closest('.form-group')?.classList.add('has-error');
      isValid = false;
    } else {
      phoneInput?.closest('.form-group')?.classList.remove('has-error');
    }

    // Validate Interest
    if (!interestInput?.value) {
      interestInput?.closest('.form-group')?.classList.add('has-error');
      isValid = false;
    } else {
      interestInput?.closest('.form-group')?.classList.remove('has-error');
    }

    if (!isValid) return;

    // Show Success State with safe defaults
    const customerName = nameInput.value.trim() || 'Valued Client';
    const customerInterest = interestInput.value || 'your enquiry';
    const customerBranch = branchInput?.value || '';
    const customerMessage = messageInput?.value.trim() || '';

    if (successUserName) successUserName.textContent = customerName;
    if (successUserInterest) successUserInterest.textContent = customerInterest;
    if (successWhatsappLink) {
      successWhatsappLink.href = buildWhatsAppUrl(customerName, customerInterest, customerBranch, customerMessage);
    }

    enquiryForm.hidden = true;
    if (formSuccessState) formSuccessState.hidden = false;
  });

  // Reset Contact Form
  resetFormBtn?.addEventListener('click', () => {
    if (enquiryForm) {
      enquiryForm.reset();
      enquiryForm.hidden = false;
    }
    if (formSuccessState) formSuccessState.hidden = true;
    if (routingHint) {
      routingHint.hidden = false;
      if (routingHintText) routingHintText.textContent = 'Select an interest above to personalize your inquiry.';
    }
    quickTabBtns.forEach((t, i) => {
      if (i === 0) t.classList.add('active');
      else t.classList.remove('active');
    });
  });

  // Modal Form Submission Handler
  modalForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('modal-name');
    const phoneInput = document.getElementById('modal-phone');
    const interestInput = document.getElementById('modal-interest');

    let isValid = true;

    if (!nameInput?.value.trim()) {
      nameInput?.closest('.form-group')?.classList.add('has-error');
      isValid = false;
    } else {
      nameInput?.closest('.form-group')?.classList.remove('has-error');
    }

    const phoneVal = phoneInput?.value.trim() || '';
    if (!/^[0-9]{10}$/.test(phoneVal.replace(/\D/g, '').slice(-10))) {
      phoneInput?.closest('.form-group')?.classList.add('has-error');
      isValid = false;
    } else {
      phoneInput?.closest('.form-group')?.classList.remove('has-error');
    }

    if (!interestInput?.value) {
      interestInput?.closest('.form-group')?.classList.add('has-error');
      isValid = false;
    } else {
      interestInput?.closest('.form-group')?.classList.remove('has-error');
    }

    if (!isValid) return;

    // Show Modal Success State
    modalForm.hidden = true;
    if (modalSuccessBox) modalSuccessBox.hidden = false;
  });

  // Real-time error removal on input
  document.querySelectorAll('.form-input, .form-select').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group')?.classList.remove('has-error');
    });
    input.addEventListener('change', () => {
      input.closest('.form-group')?.classList.remove('has-error');
    });
  });

  // Branch Map Console Interactive Tab Switcher
  const mapTabBtns = document.querySelectorAll('.map-tab-btn');
  const mapFrame = document.getElementById('branch-map-frame');
  const mapLandmarkInfo = document.getElementById('map-landmark-info');
  const mapExternalLink = document.getElementById('map-external-link');

  mapTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mapTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const mapSrc = btn.getAttribute('data-map-src');
      const directUrl = btn.getAttribute('data-direct-url');
      const isMain = btn.id === 'map-tab-main';

      if (mapFrame && mapSrc) {
        mapFrame.src = mapSrc;
      }
      if (mapExternalLink && directUrl) {
        mapExternalLink.href = directUrl;
      }
      if (mapLandmarkInfo) {
        if (isMain) {
          mapLandmarkInfo.innerHTML = '<strong>Landmark:</strong> Opp. Millennium Park, Gate No. 5 • Surat, Gujarat';
        } else {
          mapLandmarkInfo.innerHTML = '<strong>Landmark:</strong> Near Rami Park, Shivalik A/C Market, Dindoli • Surat, Gujarat';
        }
      }
    });
  });

  // Smooth scroll anchor link offset handling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
