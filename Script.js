document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Loading animation with staggered text
    const loadingText = document.querySelector('.loading-text');
    const letters = loadingText.querySelectorAll('span');
    let currentIndex = 0;

    function animateLetters() {
        if (currentIndex < letters.length) {
            letters[currentIndex].style.animation = 'fadeInUp 0.5s ease forwards';
            currentIndex++;
            setTimeout(animateLetters, 100);
        } else {
            // Hide loading after animation completes
            setTimeout(() => {
                document.querySelector('.loading-spinner').classList.add('hidden');
            }, 1500);
        }
    }

    // Start letter animation after a brief delay
    setTimeout(animateLetters, 500);

    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Header scroll effect
    const header = document.querySelector('.top-nav');
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (mobileNav) mobileNav.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            if (mobileNav) mobileNav.classList.remove('scrolled');
        }
    });

    // Enhanced mobile bottom navigation with section-based animations and improved responsiveness
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.mobile-nav-item');
    let isScrolling = false;

    function updateActiveNavItem() {
        if (isScrolling) return; // Prevent updates during programmatic scrolling

        const scrollY = window.scrollY + 100; // Offset for better detection
        let currentSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            navItems.forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href');
                if (href && href.includes(currentSection)) {
                    item.classList.add('active');
                }
            });
        }
    }

    // Enhanced mobile-specific optimizations with better performance
    function optimizeForMobile() {
        const isMobile = window.innerWidth <= 1024;
        const isSmallMobile = window.innerWidth <= 480;

        // Adjust animations based on device capability
        if (isMobile) {
            document.documentElement.style.setProperty('--transition', 'all 0.25s ease');

            // Reduce complex animations on mobile for better performance
            if (isSmallMobile) {
                const animatedElements = document.querySelectorAll('.floating-element, .morphing-shape, .particle');
                animatedElements.forEach(el => {
                    el.style.animation = 'none';
                    el.style.display = 'none'; // Hide to improve performance
                });
            }
        }

        // Enhanced touch targets with better accessibility
        const touchTargets = document.querySelectorAll('button, a, .mobile-nav-item, .cta-primary, .cta-secondary');
        touchTargets.forEach(target => {
            const styles = window.getComputedStyle(target);
            const minWidth = parseInt(styles.minWidth) || parseInt(styles.width) || 0;
            const minHeight = parseInt(styles.minHeight) || parseInt(styles.height) || 0;

            if (minWidth < 44 || minHeight < 44) {
                target.style.minWidth = '44px';
                target.style.minHeight = '44px';
            }

            // Add touch feedback
            target.addEventListener('touchstart', () => {
                target.style.transform = 'scale(0.98)';
            });

            target.addEventListener('touchend', () => {
                setTimeout(() => {
                    target.style.transform = '';
                }, 150);
            });
        });

        // Adjust viewport for better mobile experience
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport && isMobile) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
        }
    }

    // Enhanced smooth scroll to sections with better offset calculation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                isScrolling = true;

                // Calculate dynamic offset based on screen size
                const isMobile = window.innerWidth <= 1024;
                const headerOffset = isMobile ? 70 : 80;
                const offsetTop = targetSection.offsetTop - headerOffset;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });

    // Update active navigation on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavItem, 50);
    });
    updateActiveNavItem(); // Initial call

    // Enhanced progress indicator for bottom navigation
    function updateProgressIndicator() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

        const progressIndicator = document.querySelector('.progress-indicator');
        if (progressIndicator) {
            progressIndicator.style.width = scrollPercent + '%';
        }
    }

    // Update progress indicator on scroll with throttling
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateProgressIndicator);
    });
    updateProgressIndicator(); // Initial call

    // Add swipe gesture support for mobile navigation
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Detect horizontal swipe (more significant than vertical)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const currentActive = document.querySelector('.mobile-nav-item.active');
            if (currentActive) {
                const allItems = Array.from(navItems);
                const currentIndex = allItems.indexOf(currentActive);

                if (diffX > 0 && currentIndex < allItems.length - 1) {
                    // Swipe left - next item
                    allItems[currentIndex + 1].click();
                } else if (diffX < 0 && currentIndex > 0) {
                    // Swipe right - previous item
                    allItems[currentIndex - 1].click();
                }
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    });

    // Enhanced mobile menu toggle with improved slide-in animation
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navActions = document.querySelector('.nav-actions');

    mobileMenuBtn.addEventListener('click', () => {
        const isActive = mainNav.classList.contains('active');

        if (isActive) {
            // Close menu with enhanced animation
            mainNav.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';

            // Reset nav links animation
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach((link, index) => {
                link.style.animationDelay = '0s';
                link.classList.remove('slide-in-left');
            });
        } else {
            // Open menu with staggered animation
            mainNav.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';

            // Animate nav links with stagger
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach((link, index) => {
                link.classList.add('slide-in-left');
                link.style.animationDelay = `${index * 0.1}s`;
            });
        }
    });

    // Close mobile menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';

        // Reset nav links animation
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach((link, index) => {
            link.style.animationDelay = '0s';
            link.classList.remove('slide-in-left');
        });
    });



    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (window.innerWidth < 992) {
                    mainNav.style.display = 'none';
                    navActions.style.display = 'none';
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        currentSlide = index;
        testimonials[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Initialize slider
    showSlide(0);

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);

    // FAQ toggle functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isExpanded = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isExpanded) {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                faqItem.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Modal functionality with error handling
    const authModal = document.getElementById('authModal');
    const patientPortal = document.getElementById('patientPortal');
    const loginBtn = document.getElementById('loginBtn');
    const closeButtons = document.querySelectorAll('.close-btn');
    const logoutBtn = document.querySelector('.logout-btn');

    function openModal(modal) {
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Trap focus within modal
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }

            if (e.key === 'Escape') {
                closeModal(modal);
            }
        });
    }

    function closeModal(modal) {
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Return focus to trigger element
        if (loginBtn && document.activeElement === document.body) {
            loginBtn.focus();
        }
    }

    // Google OAuth callback
    window.handleCredentialResponse = (response) => {
        console.log('Google auth response:', response);
        
        // In a real implementation, you would validate the token with your backend
        // For demo purposes, we'll simulate a successful login
        const mockUser = {
            given_name: 'John',
            family_name: 'Doe',
            email: 'john.doe@example.com'
        };
        
        document.getElementById('userName').textContent = mockUser.given_name;
        document.getElementById('portalUserName').textContent = mockUser.given_name;
        
        closeModal(authModal);
        openModal(patientPortal);
    };

    // Login button click handler
    loginBtn.addEventListener('click', () => {
        if (document.getElementById('userName').textContent === 'Login') {
            openModal(authModal);
        } else {
            openModal(patientPortal);
        }
    });

    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            document.getElementById('userName').textContent = 'Login';
            document.getElementById('portalUserName').textContent = 'Patient';
            closeModal(patientPortal);
        });
    }

    // Form submissions (removed duplicate declaration)

    function showMessage(message, type = 'success') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(messageEl);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    // CTA buttons
    const appointmentButtons = document.querySelectorAll('.appointment-btn, #heroAppointmentBtn, #bookAppointmentBtn');
    
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const appointmentSection = document.getElementById('appointment');
            if (appointmentSection) {
                appointmentSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Number counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(number => {
        const target = parseInt(number.dataset.count);
        let count = 0;
        const increment = Math.ceil(target / 50);
        
        const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(counter);
            }
            number.textContent = count.toLocaleString();
        }, 30);
    });

    // Dynamic year
    const currentYear = new Date().getFullYear();
    document.querySelector('.current-year').textContent = currentYear;

    // Enhanced hover effects
    const interactiveElements = document.querySelectorAll('button, .service-card, .doctor-card, .portal-card, .download-card, .blog-card, .tip-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });

    // Magnetic button effect
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // Interactive background effect
    const interactiveBg = document.querySelector('.interactive-bg');
    if (interactiveBg) {
        interactiveBg.addEventListener('mousemove', (e) => {
            const rect = interactiveBg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            interactiveBg.style.setProperty('--mouse-x', x + '%');
            interactiveBg.style.setProperty('--mouse-y', y + '%');
        });
    }

    // Advanced scroll animations with parallax
    const parallaxElements = document.querySelectorAll('.parallax-element');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const rate = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * rate}px)`;
        });
    });

    // Enhanced tooltip functionality
    const tooltips = document.querySelectorAll('.tooltip-advanced');
    tooltips.forEach(tooltip => {
        tooltip.setAttribute('tabindex', '0');

        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
        tooltip.addEventListener('focus', showTooltip);
        tooltip.addEventListener('blur', hideTooltip);
    });

    function showTooltip(e) {
        // Tooltip is shown via CSS :hover and :focus
    }

    function hideTooltip(e) {
        // Tooltip is hidden via CSS
    }

    // Skeleton loading for dynamic content
    function showSkeleton(element) {
        element.classList.add('skeleton');
        setTimeout(() => {
            element.classList.remove('skeleton');
        }, 2000);
    }

    // Enhanced form validation with visual feedback
    const enhancedForms = document.querySelectorAll('form');
    enhancedForms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });

            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.parentElement.classList.add('has-content');
                } else {
                    input.parentElement.classList.remove('has-content');
                }
            });
        });
    });

    // Advanced card animations
    const cards3d = document.querySelectorAll('.card-3d');
    cards3d.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });

    // Gradient text animation
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.style.backgroundSize = '200% 200%';
        text.style.animation = 'gradient-shift 3s ease infinite';
    });

    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });

    // Morphing shapes animation
    const morphingShapes = document.querySelectorAll('.morphing-shape');
    morphingShapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });

    // Advanced scroll reveal with intersection observer
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Health Tips Carousel
    const tipsCarousel = document.querySelector('.tips-carousel');
    const tipCards = document.querySelectorAll('.tip-card');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    let currentTipIndex = 0;
    let autoPlayInterval;

    function updateCarousel() {
        tipCards.forEach((card, index) => {
            card.style.display = index === currentTipIndex ? 'block' : 'none';
        });

        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTipIndex);
        });
    }

    function nextTip() {
        currentTipIndex = (currentTipIndex + 1) % tipCards.length;
        updateCarousel();
    }

    function prevTip() {
        currentTipIndex = (currentTipIndex - 1 + tipCards.length) % tipCards.length;
        updateCarousel();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextTip, 4000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    if (carouselNext && carouselPrev) {
        carouselNext.addEventListener('click', () => {
            nextTip();
            stopAutoPlay();
            startAutoPlay();
        });

        carouselPrev.addEventListener('click', () => {
            prevTip();
            stopAutoPlay();
            startAutoPlay();
        });

        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTipIndex = index;
                updateCarousel();
                stopAutoPlay();
                startAutoPlay();
            });
        });

        // Initialize carousel
        updateCarousel();
        startAutoPlay();
    }

    // Emergency Contact Widget
    const emergencyToggle = document.getElementById('emergencyToggle');
    const emergencyPanel = document.getElementById('emergencyPanel');
    const emergencyCallBtn = document.getElementById('emergencyCallBtn');

    if (emergencyToggle && emergencyPanel) {
        emergencyToggle.addEventListener('click', () => {
            emergencyPanel.classList.toggle('show');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!emergencyToggle.contains(e.target) && !emergencyPanel.contains(e.target)) {
                emergencyPanel.classList.remove('show');
            }
        });

        // Emergency call button
        if (emergencyCallBtn) {
            emergencyCallBtn.addEventListener('click', () => {
                window.location.href = 'tel:911';
            });
        }
    }

    // Virtual Consultation Modal
    const virtualConsultBtn = document.getElementById('virtualConsultBtn');
    const virtualModal = document.getElementById('virtualModal');
    const videoConsultBtn = document.getElementById('videoConsultBtn');
    const phoneConsultBtn = document.getElementById('phoneConsultBtn');

    if (virtualConsultBtn && virtualModal) {
        virtualConsultBtn.addEventListener('click', () => {
            openModal(virtualModal);
        });

        if (videoConsultBtn) {
            videoConsultBtn.addEventListener('click', () => {
                // In a real implementation, this would integrate with video calling service
                showMessage('Video consultation feature coming soon! Please call our office to schedule.', 'info');
                closeModal(virtualModal);
            });
        }

        if (phoneConsultBtn) {
            phoneConsultBtn.addEventListener('click', () => {
                window.location.href = 'tel:(123)456-7890';
                closeModal(virtualModal);
            });
        }
    }

    // Enhanced Form Validations
    function validateField(field, rules) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (rules.phone && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Name validation
        if (rules.name && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
        }

        // Update field styling and error message
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');

        if (!isValid) {
            field.style.borderColor = 'var(--danger-color)';
            if (!existingError) {
                const errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                errorEl.textContent = errorMessage;
                formGroup.appendChild(errorEl);
            }
        } else {
            field.style.borderColor = 'var(--success-color)';
            if (existingError) {
                existingError.remove();
            }
        }

        return isValid;
    }

    // Add validation to form fields
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        const rules = {};

        if (field.hasAttribute('required')) {
            rules.required = true;
        }

        if (field.type === 'email') {
            rules.email = true;
        }

        if (field.type === 'tel') {
            rules.phone = true;
        }

        if (field.name === 'name' || field.id === 'name') {
            rules.name = true;
        }

        if (Object.keys(rules).length > 0) {
            field.addEventListener('blur', () => validateField(field, rules));
            field.addEventListener('input', () => {
                if (field.style.borderColor === 'rgb(239, 68, 68)') {
                    validateField(field, rules);
                }
            });
        }
    });

    // Enhanced form submission with validation
    const forms = {
        appointment: document.getElementById('appointmentForm'),
        contact: document.getElementById('contactForm'),
        newsletter: document.getElementById('newsletterForm')
    };

    Object.values(forms).forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formType = this.id.replace('Form', '');
                const formData = new FormData(this);

                // Validate all required fields
                const requiredFields = this.querySelectorAll('[required]');
                let isFormValid = true;

                requiredFields.forEach(field => {
                    const rules = { required: true };
                    if (field.type === 'email') rules.email = true;
                    if (field.type === 'tel') rules.phone = true;
                    if (field.name === 'name' || field.id === 'name') rules.name = true;

                    if (!validateField(field, rules)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    showMessage('Please fill in all required fields correctly.', 'error');
                    return;
                }

                // Simulate form submission
                console.log(`Submitting ${formType} form with `, Object.fromEntries(formData));

                // Show success message
                showMessage(`Thank you! Your ${formType} has been submitted successfully.`, 'success');

                // Reset form
                this.reset();

                // Clear any error messages
                this.querySelectorAll('.error-message').forEach(error => error.remove());

                // Close modal if it's the appointment form
                if (formType === 'appointment') {
                    setTimeout(() => {
                        document.querySelectorAll('.modal').forEach(modal => {
                            closeModal(modal);
                        });
                    }, 2000);
                }
            });
        }
    });

    // Ripple effect for buttons
    const buttons = document.querySelectorAll('button, .cta-primary, .cta-secondary, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhanced scroll animations with stagger (using existing observer)
    document.querySelectorAll('.animate-on-scroll').forEach((element, index) => {
        observer.observe(element);
    });

    console.log('Soorab Clinic website initialized successfully with enhanced features!');
});