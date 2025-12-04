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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navActions = document.querySelector('.nav-actions');

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
        navActions.style.display = navActions.style.display === 'flex' ? 'none' : 'flex';
        mobileMenuBtn.innerHTML = mainNav.style.display === 'flex' ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
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