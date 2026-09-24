/* ==========================================================================
   J M D THARUN - PORTFOLIO INTERACTIVITY SCRIPT
   Enhanced with Modern Trends: Animated KPI Counters, Scroll Depth Tracker,
   Interactive Project Filter, One-Click Email Copy, and Toast System.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. READING SCROLL PROGRESS BAR
    // ----------------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }
    }, { passive: true });

    // ----------------------------------------------------------------------
    // 2. THEME TOGGLE (DARK / LIGHT MODE)
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ----------------------------------------------------------------------
    // 3. MOBILE NAVIGATION MENU
    // ----------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    const closeMobileMenu = () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('open', isOpen);
            if (navOverlay) navOverlay.classList.toggle('active', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ----------------------------------------------------------------------
    // 4. STICKY NAVBAR & ACTIVE NAV LINK HIGHLIGHT
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

    // ----------------------------------------------------------------------
    // 5. ANIMATED KPI NUMBER COUNTERS
    // ----------------------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const animateCounters = () => {
        statNumbers.forEach(numEl => {
            const target = parseInt(numEl.getAttribute('data-target'), 10);
            const duration = 1600; // 1.6s
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                // Ease out quad
                const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));
                numEl.textContent = currentCount;

                if (frame >= totalFrames) {
                    numEl.textContent = target;
                    clearInterval(counter);
                }
            }, frameRate);
        });
    };

    const statsSection = document.querySelector('.stats-strip');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ----------------------------------------------------------------------
    // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------------
    // 7. ANIMATED SKILL PROGRESS BARS
    // ----------------------------------------------------------------------
    const skillBars = document.querySelectorAll('.progress-line span');

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.parentElement.getAttribute('data-progress');
                entry.target.style.width = targetWidth;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ----------------------------------------------------------------------
    // 8. INTERACTIVE PROJECT CATEGORY FILTERS
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.removeAttribute('data-hidden');
                    card.style.display = 'flex';
                } else {
                    card.setAttribute('data-hidden', 'true');
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 9. ONE-CLICK COPY EMAIL WITH TOAST NOTIFICATION
    // ----------------------------------------------------------------------
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    const showToast = (message) => {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    };

    const copyButtons = document.querySelectorAll('.copy-email-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'tharunmurugesan2000@gmail.com';
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    // Fallback
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }
                showToast(`Copied ${email} to clipboard!`);
            } catch (err) {
                showToast(`Email: ${email}`);
            }
        });
    });

    // ----------------------------------------------------------------------
    // 10. CONTACT FORM SUBMISSION
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your message has been prepared. I will connect with you shortly!`;
                
                showToast(`Thanks ${name}, message recorded!`);
                contactForm.reset();
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;

                setTimeout(() => {
                    formStatus.innerHTML = '';
                    formStatus.className = 'form-status';
                }, 6000);
            }, 1000);
        });
    }

    // ----------------------------------------------------------------------
    // 11. CERTIFICATE PREVIEW MODAL SYSTEM
    // ----------------------------------------------------------------------
    const certModal = document.getElementById('cert-modal');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalIssuer = document.getElementById('cert-modal-issuer');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalId = document.getElementById('cert-modal-id');
    const certModalPdfLink = document.getElementById('cert-modal-pdf');
    const certModalClose = document.getElementById('cert-modal-close');
    const certCopyIdBtn = document.getElementById('cert-copy-id-btn');

    const openCertModal = (data) => {
        if (!certModal) return;
        if (certModalTitle) certModalTitle.textContent = data.title || 'Certificate of Completion';
        if (certModalIssuer) certModalIssuer.innerHTML = `<i class="fa-solid fa-award"></i> ${data.issuer || 'Verified Credential'}`;
        if (certModalImg) {
            certModalImg.src = data.img || '';
            certModalImg.alt = data.title || 'Certificate Image';
        }
        if (certModalId) certModalId.textContent = data.id || 'N/A';
        if (certModalPdfLink) {
            certModalPdfLink.href = data.pdf || '#';
            if (data.pdf) {
                certModalPdfLink.style.display = 'inline-flex';
            } else {
                certModalPdfLink.style.display = 'none';
            }
        }
        certModal.classList.add('active');
        document.body.classList.add('modal-open');
    };

    const closeCertModal = () => {
        if (!certModal) return;
        certModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    };

    const certButtons = document.querySelectorAll('.cert-view-btn');
    certButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const data = {
                title: btn.getAttribute('data-cert-title'),
                issuer: btn.getAttribute('data-cert-issuer'),
                id: btn.getAttribute('data-cert-id'),
                date: btn.getAttribute('data-cert-date'),
                img: btn.getAttribute('data-cert-img'),
                pdf: btn.getAttribute('data-cert-pdf')
            };
            openCertModal(data);
        });
    });

    if (certModalClose) {
        certModalClose.addEventListener('click', closeCertModal);
    }

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });

    if (certCopyIdBtn && certModalId) {
        certCopyIdBtn.addEventListener('click', async () => {
            const idText = certModalId.textContent.trim();
            if (!idText || idText === 'N/A') return;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(idText);
                } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = idText;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }
                showToast(`Credential ID copied: ${idText}`);
            } catch (err) {
                showToast(`ID: ${idText}`);
            }
        });
    }
});
