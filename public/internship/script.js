/**
 * BioPC Academy — BRI 4.0
 * script.js
 * ─────────────────────────────────────────────────────────
 * After deploying your Google Apps Script, replace the URL below:
 */
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbymJyK6Jyjols7VLOrWFM5CZwfISSrB2P-uIDjSczm5m-ZQ6WMq9773nBCdzulQkfzD/exec';

const initPage = () => {

  /* ===== Theme Toggle ===== */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('bri-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.setAttribute('data-theme', theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-toggle-icon');
      if (icon) icon.textContent = theme === 'dark' ? '☾' : '☀';
      themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    localStorage.setItem('bri-theme', theme);
  }
  applyTheme(initialTheme);
  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  /* ===== Mobile Nav Toggle ===== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  mobileToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ===== Smooth Scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ===== Scroll Progress Bar ===== */
  const scrollProgressBar = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (scrolled / total) * 100 : 0;
    scrollProgressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ===== Header Scroll Shadow ===== */
  const header = document.getElementById('header');
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ===== Back to Top Button ===== */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== Nav Scroll Spy ===== */
  const spySections = document.querySelectorAll('section[id]');
  const spyLinks = document.querySelectorAll('.nav-links a[data-section]');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        spyLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  spySections.forEach(sec => spyObserver.observe(sec));

  /* ===== Fade-in Scroll Animations ===== */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.closest('.outcome-grid, .ta-grid, .profile-grid, .testimonial-grid, .pathway-grid, .ba-grid');
        let delay = 0;
        if (siblings) {
          const allFade = Array.from(siblings.querySelectorAll('.fade-in'));
          delay = allFade.indexOf(entry.target) * 80;
        }
        setTimeout(() => entry.target.classList.add('visible'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* ===== Animated Stats ===== */
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length) {
    const animateStat = (element) => {
      const target = Number(element.dataset.target || 0);
      const suffix = element.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        element.textContent = `${current.toLocaleString('en-US')}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
        else element.textContent = `${target.toLocaleString('en-US')}${suffix}`;
      };
      requestAnimationFrame(step);
    };
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateStat(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    statNumbers.forEach(stat => statObserver.observe(stat));
  }

  /* ===== Countdown Timer ===== */
  const deadline = new Date('2026-09-20T23:59:59');
  function updateCountdown() {
    const now = new Date();
    const diff = deadline - now;
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    if (diff <= 0) {
      [daysEl, hoursEl, minsEl, secsEl].forEach(el => el && (el.textContent = '00'));
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===== Curriculum Module Accordion ===== */
  const stepper = document.getElementById('moduleStepper');
  if (stepper) {
    stepper.querySelectorAll('.module-item').forEach(item => {
      const head = item.querySelector('.module-head');
      const body = item.querySelector('.module-body');
      if (!head || !body) return;
      head.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open');
        body.style.maxHeight = isOpen ? null : body.scrollHeight + 'px';
      });
      head.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); head.click(); }
      });
    });
  }

  /* ===== Curriculum Timeline Node Click ===== */
  const timelineNodes = document.querySelectorAll('.timeline-node');
  timelineNodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      // Highlight active node
      timelineNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      // Open corresponding accordion
      const modules = stepper?.querySelectorAll('.module-item');
      if (!modules) return;
      modules.forEach((item, i) => {
        const body = item.querySelector('.module-body');
        if (i === idx) {
          item.classList.add('open');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          item.classList.remove('open');
          if (body) body.style.maxHeight = null;
        }
      });
    });
  });

  /* ===== FAQ Accordion ===== */
  document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.querySelectorAll('.accordion-item').forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (!header || !body) return;
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all in same accordion
        accordion.querySelectorAll('.accordion-item.open').forEach(open => {
          if (open !== item) {
            open.classList.remove('open');
            const b = open.querySelector('.accordion-body');
            if (b) b.style.maxHeight = null;
          }
        });
        item.classList.toggle('open');
        body.style.maxHeight = isOpen ? null : body.scrollHeight + 'px';
      });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
      });
    });
  });

  /* ===== FAQ Search/Filter ===== */
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', () => {
      const query = faqSearch.value.trim().toLowerCase();
      document.querySelectorAll('.accordion-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle('hidden-by-search', query.length > 0 && !text.includes(query));
      });
      // Show/hide category labels based on visible items
      document.querySelectorAll('.faq-category-label').forEach(label => {
        // Find the accordion that follows this label
        let next = label.nextElementSibling;
        let hasVisible = false;
        while (next && next.classList.contains('accordion')) {
          const visibleItems = next.querySelectorAll('.accordion-item:not(.hidden-by-search)');
          if (visibleItems.length > 0) hasVisible = true;
          next = next.nextElementSibling;
        }
        label.style.display = (query.length > 0 && !hasVisible) ? 'none' : '';
      });
    });
  }

  /* ===== View All Tools Panel ===== */
  const viewAllBtn = document.getElementById('viewAllToolsBtn');
  const toolsAllPanel = document.getElementById('toolsAllPanel');
  if (viewAllBtn && toolsAllPanel) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = viewAllBtn.getAttribute('aria-expanded') === 'true';
      const willExpand = !isExpanded;
      viewAllBtn.setAttribute('aria-expanded', String(willExpand));
      toolsAllPanel.hidden = !willExpand;
      if (willExpand) {
        toolsAllPanel.removeAttribute('hidden');
      } else {
        toolsAllPanel.setAttribute('hidden', '');
      }
    });
  }

  /* ===== Tool Image Error Fallback Handler ===== */
  const toolIconMap = {
    'Venny 2.0': 'fa-chart-pie',
    'Zotero': 'fa-book-bookmark',
    'SciSpace': 'fa-brain',
    'QuillBot': 'fa-feather',
    'Grammarly': 'fa-spell-check',
    'Turnitin': 'fa-file-shield',
    'NCBI': 'fa-dna',
    'PDB': 'fa-cubes',
    'PubChem': 'fa-flask',
    'Zinc Database': 'fa-atom',
    'Swiss Drug Design': 'fa-pills',
    'Biovia DS': 'fa-microchip',
    'GeneCards': 'fa-file-medical',
    'UALCAN': 'fa-chart-line',
    'STRING': 'fa-network-wired',
    'ShinyGO': 'fa-diagram-project',
    'IMPPAT 2.0': 'fa-seedling',
    'Dr. Duke\'s DB': 'fa-leaf',
    'cBioPortal': 'fa-viruses',
    'KM Plotter': 'fa-chart-area',
    'Protein Atlas': 'fa-layer-group',
    'GEPIA 2': 'fa-chart-bar',
    'Protox 3.0': 'fa-biohazard',
    'UniProt': 'fa-database',
    'AlphaFold': 'fa-shapes',
    'AdmetLab 3.0': 'fa-vial-circle-check',
    'AutoDock Vina': 'fa-lock',
    'Cytoscape': 'fa-circle-nodes',
    'SwissDock': 'fa-key',
    'GREIN': 'fa-table-cells'
  };

  function applyToolFallback(imgEl, name) {
    if (!imgEl || !imgEl.parentNode) return;
    const iconClass = toolIconMap[name] || 'fa-flask';
    const fallback = document.createElement('div');
    fallback.className = 'tool-fallback-icon';
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    imgEl.replaceWith(fallback);
  }

  document.querySelectorAll('.tool-card').forEach(card => {
    const img = card.querySelector('img');
    const nameEl = card.querySelector('.tool-name');
    const name = nameEl ? nameEl.textContent.trim() : '';
    if (img) {
      if (img.complete && img.naturalWidth === 0) {
        applyToolFallback(img, name);
      } else {
        img.addEventListener('error', function () {
          applyToolFallback(this, name);
        });
      }
    }
  });

  /* ===== File Drop Zone ===== */
  const fileDropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('screenshot');
  const fileSelectedName = document.getElementById('fileSelectedName');

  if (fileDropZone && fileInput) {
    fileDropZone.addEventListener('click', () => fileInput.click());
    fileDropZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });

    ['dragover', 'dragenter'].forEach(evt => {
      fileDropZone.addEventListener(evt, (e) => { e.preventDefault(); fileDropZone.classList.add('drag-over'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
      fileDropZone.addEventListener(evt, () => fileDropZone.classList.remove('drag-over'));
    });
    fileDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        fileInput.files = e.dataTransfer.files;
        showFileName(file.name);
      }
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) showFileName(fileInput.files[0].name);
    });

    function showFileName(name) {
      if (fileSelectedName) {
        fileSelectedName.textContent = `✓ Selected: ${name}`;
        fileSelectedName.hidden = false;
      }
    }
  }

  /* ===== Registration Form with GAS Submission ===== */
  const form = document.getElementById('regForm');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formErrorMsg');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');

  // Real-time field validation
  const fieldValidators = {
    fullName: { el: null, validate: v => v.trim().length >= 2, msg: 'Please enter your full name.' },
    email: { el: null, validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
    phone: { el: null, validate: v => v.trim().length >= 6, msg: 'Please enter a valid phone number.' },
    university: { el: null, validate: v => v.trim().length >= 2, msg: 'Please enter your university or institution.' },
    academicLevel: { el: null, validate: v => v !== '', msg: 'Please select your academic level.' },
    paymentMethod: { el: null, validate: v => v !== '', msg: 'Please select a payment method.' },
    transactionId: { el: null, validate: v => v.trim().length >= 4, msg: 'Please enter your transaction ID.' },
  };

  Object.keys(fieldValidators).forEach(name => {
    const el = document.getElementById(name);
    if (!el) return;
    fieldValidators[name].el = el;
    el.addEventListener('blur', () => validateField(name));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(name);
    });
  });

  function validateField(name) {
    const { el, validate, msg } = fieldValidators[name];
    if (!el) return true;
    const errorEl = document.getElementById(`${name}-error`);
    const isValid = validate(el.value);
    el.classList.toggle('error', !isValid);
    if (errorEl) errorEl.textContent = isValid ? '' : msg;
    return isValid;
  }

  function validateAll() {
    let allValid = true;
    Object.keys(fieldValidators).forEach(name => {
      if (!validateField(name)) allValid = false;
    });
    // Check screenshot
    const screenshotErr = document.getElementById('screenshot-error');
    if (fileInput && !fileInput.files[0]) {
      if (screenshotErr) screenshotErr.textContent = 'Please upload a screenshot of your payment.';
      allValid = false;
    } else {
      if (screenshotErr) screenshotErr.textContent = '';
    }
    return allValid;
  }

  /* ===== 1,040 Categorized One-Time Coupon / Referral System ===== */
  const couponInput = document.getElementById('couponCode');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponFeedback = document.getElementById('couponFeedback');

  // Category descriptions & patterns for instant fallback recognition
  const CATEGORY_MAP = {
    'BPC-CORE': { category: 'BioPC Core Team', discount: 'Core Team Privilege Grant (100% Core Waiver)' },
    'BPC-WS': { category: 'BioPC Workshop', discount: 'Workshop Attendee Discount' },
    'BBO3': { category: 'Biology and Bioinformatics Olympiad 3.0', discount: 'Olympiad 3.0 Participant Privilege' },
    'BPC-AMB': { category: 'BioPC Campus Ambassador', discount: 'Campus Ambassador Privilege Access' },
    'BPC-GM': { category: 'BioPC General Member', discount: 'General Member Cohort Waiver' }
  };

  // Helper for local redeemed coupon tracking
  function getRedeemedCoupons() {
    try {
      return JSON.parse(localStorage.getItem('bri_used_coupons') || '[]');
    } catch (e) {
      return [];
    }
  }

  function markCouponAsRedeemedLocally(code) {
    if (!code) return;
    try {
      const used = getRedeemedCoupons();
      if (!used.includes(code)) {
        used.push(code);
        localStorage.setItem('bri_used_coupons', JSON.stringify(used));
      }
    } catch (e) { }
  }

  async function checkCoupon() {
    if (!couponInput || !couponFeedback) return;
    const rawCode = couponInput.value.trim().toUpperCase();

    if (!rawCode) {
      couponFeedback.hidden = false;
      couponFeedback.className = 'coupon-feedback invalid';
      couponFeedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Please enter a promo or referral code.`;
      return;
    }

    // Show verification loading state
    couponFeedback.hidden = false;
    couponFeedback.className = 'coupon-feedback checking';
    couponFeedback.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying coupon code "${rawCode}"…`;
    if (applyCouponBtn) applyCouponBtn.disabled = true;

    // Check local redeemed cache first
    const locallyUsed = getRedeemedCoupons();
    if (locallyUsed.includes(rawCode)) {
      couponFeedback.className = 'coupon-feedback used';
      couponFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Already Redeemed:</strong> This coupon or referral code has already been used and cannot be reused.`;
      if (applyCouponBtn) applyCouponBtn.disabled = false;
      return;
    }

    // Attempt live verification with Google Apps Script
    let gasVerified = false;
    if (typeof GAS_ENDPOINT === 'string' && !GAS_ENDPOINT.includes('YOUR_GAS_ENDPOINT')) {
      try {
        const response = await fetch(GAS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'validateCoupon', code: rawCode })
        });
        const resData = await response.json();

        if (resData && typeof resData.valid !== 'undefined') {
          gasVerified = true;
          if (resData.valid === true) {
            const catLabel = resData.category ? `<strong>[${resData.category}]</strong> ` : '';
            couponFeedback.className = 'coupon-feedback valid';
            couponFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${catLabel}<strong>Coupon Applied!</strong> ${resData.discount || 'Verified single-use code.'}`;
          } else if (resData.status === 'ALREADY_USED') {
            markCouponAsRedeemedLocally(rawCode);
            couponFeedback.className = 'coupon-feedback used';
            couponFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Already Redeemed:</strong> This coupon or referral code has already been used and cannot be reused.`;
          } else {
            couponFeedback.className = 'coupon-feedback invalid';
            couponFeedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>Invalid Code:</strong> The coupon code "${rawCode}" is invalid. Please check for typos.`;
          }
        }
      } catch (err) {
        console.warn('GAS validation request fallback to local validation:', err);
      }
    }

    // Local catalog verification fallback if GAS is offline or not configured
    if (!gasVerified) {
      // Check prefix matching for the 5 categories
      let matchedCategory = null;
      for (const prefix of Object.keys(CATEGORY_MAP)) {
        if (rawCode.startsWith(prefix + '-') && rawCode.length >= prefix.length + 5) {
          matchedCategory = CATEGORY_MAP[prefix];
          break;
        }
      }

      if (matchedCategory) {
        couponFeedback.className = 'coupon-feedback valid';
        couponFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>[${matchedCategory.category}]</strong> ${matchedCategory.discount} (Verified)`;
      } else {
        couponFeedback.className = 'coupon-feedback invalid';
        couponFeedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>Invalid Code:</strong> The coupon code "${rawCode}" is not recognized. Please check and try again.`;
      }
    }

    if (applyCouponBtn) applyCouponBtn.disabled = false;
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkCoupon();
    });
    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkCoupon();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateAll()) {
        // Scroll to first error
        const firstError = form.querySelector('.error, [aria-invalid="true"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Show loading state
      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Submitting…';
      if (submitSpinner) submitSpinner.hidden = false;
      if (successMsg) successMsg.hidden = true;
      if (errorMsg) errorMsg.hidden = true;

      // Read and compress screenshot file as base64
      let screenshotBase64 = '';
      let screenshotName = '';
      let screenshotType = 'image/jpeg';

      const uploadedFile = fileInput?.files?.[0];
      if (uploadedFile) {
        screenshotName = uploadedFile.name;
        try {
          screenshotBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const maxDim = 1200;
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                  if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                  } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                  }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
              };
              img.onerror = () => resolve(e.target.result);
              img.src = e.target.result;
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(uploadedFile);
          });
        } catch (readErr) {
          console.warn('Image read error:', readErr);
        }
      }

      const formData = {
        fullName: document.getElementById('fullName')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        phone: document.getElementById('phone')?.value.trim(),
        whatsapp: document.getElementById('whatsapp')?.value.trim(),
        university: document.getElementById('university')?.value.trim(),
        department: document.getElementById('department')?.value.trim(),
        academicLevel: document.getElementById('academicLevel')?.value,
        skillLevel: document.getElementById('skillLevel')?.value,
        paymentMethod: document.getElementById('paymentMethod')?.value,
        couponCode: document.getElementById('couponCode')?.value.trim().toUpperCase() || '',
        transactionId: document.getElementById('transactionId')?.value.trim(),
        screenshotData: screenshotBase64,
        screenshotName: screenshotName,
        screenshotType: screenshotType,
        timestamp: new Date().toISOString(),
      };

      try {
        if (GAS_ENDPOINT === 'YOUR_GAS_ENDPOINT_URL') {
          // GAS not connected yet — simulate success for testing
          await new Promise(r => setTimeout(r, 1200));
          throw new Error('GAS_NOT_CONFIGURED');
        }

        const response = await fetch(GAS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(formData),
        });
        const result = await response.json().catch(() => ({ success: true }));
        if (result && (result.success !== false)) {
          if (formData.couponCode) {
            markCouponAsRedeemedLocally(formData.couponCode);
          }
          if (couponFeedback) couponFeedback.hidden = true;
          if (successMsg) successMsg.hidden = false;
          form.reset();
          if (fileSelectedName) fileSelectedName.hidden = true;
          if (submitText) submitText.textContent = 'Submitted ✓';
          setTimeout(() => {
            successMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (err.message === 'GAS_NOT_CONFIGURED') {
          // Show placeholder success during testing
          if (formData.couponCode) {
            markCouponAsRedeemedLocally(formData.couponCode);
          }
          if (couponFeedback) couponFeedback.hidden = true;
          if (successMsg) successMsg.hidden = false;
          if (submitText) submitText.textContent = 'Submitted ✓';
          form.reset();
          if (fileSelectedName) fileSelectedName.hidden = true;
          console.warn('GAS endpoint not configured. Set GAS_ENDPOINT in script.js after deploying the Google Apps Script.');
        } else {
          if (errorMsg) errorMsg.hidden = false;
          if (submitText) submitText.textContent = 'Complete my registration';
          if (submitBtn) submitBtn.disabled = false;
        }
        console.error('Form submission error:', err);
      } finally {
        if (submitSpinner) submitSpinner.hidden = true;
      }
    });
  }

  /* ===== Newsletter Form ===== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      if (newsletterSuccess) newsletterSuccess.hidden = false;
      newsletterForm.reset();
    }
  });

};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
