document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    setTimeout(() => {
        document.querySelector('.loading-spinner').classList.add('hidden');
    }, 1000);

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

    // Modal functionality
    const authModal = document.getElementById('authModal');
    const patientPortal = document.getElementById('patientPortal');
    const loginBtn = document.getElementById('loginBtn');
    const closeButtons = document.querySelectorAll('.close-btn');
    const logoutBtn = document.querySelector('.logout-btn');

    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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

    // Form submissions
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
                
                // Simulate form submission
                console.log(`Submitting ${formType} form with `, Object.fromEntries(formData));
                
                // Show success message
                showMessage(`Thank you! Your ${formType} has been submitted successfully.`, 'success');
                
                // Reset form
                this.reset();
                
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
    const interactiveElements = document.querySelectorAll('button, .service-card, .doctor-card, .portal-card, .download-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });

    console.log('Soorab Clinic website initialized successfully!');
});