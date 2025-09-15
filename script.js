// Portfolio JavaScript - Enhanced Mobile Responsive Features
// Updated for EmailJS v3.x and modern JavaScript practices with mobile optimizations

document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile for performance optimizations
    const isMobile = checkMobileDevice();
    
    // Initialize EmailJS
    initEmailJS();
    
    // Initialize all components
    initDoorAnimation();
    initNavbar();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initTypingEffect();
    
    // Load performance-heavy features only on desktop
    if (!isMobile) {
        initParallaxEffects();
    }
    
    // Mobile-specific initializations
    if (isMobile) {
        initMobileOptimizations();
    }
});

// Check if device is mobile
function checkMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
}

// Mobile-specific optimizations
function initMobileOptimizations() {
    // Disable hover effects on mobile
    document.body.classList.add('mobile-device');
    
    // Optimize touch scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', preventZoom);
        input.addEventListener('blur', allowZoom);
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', handleOrientationChange);
}

function preventZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
}

function allowZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }
}

function handleOrientationChange() {
    // Hide address bar on mobile after orientation change
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 500);
}

// Initialize EmailJS
function initEmailJS() {
    const publicKey = '2fXBQ1zNaJxZ42nyX';
    
    try {
        emailjs.init(publicKey);
        console.log('EmailJS initialized successfully');
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }
}

// Enhanced Door Animation with mobile considerations
function initDoorAnimation() {
    const doorContainer = document.getElementById('doorContainer');
    if (!doorContainer) return;
    
    // Reduce animation time on mobile for better UX
    const isMobile = checkMobileDevice();
    const animationDelay = isMobile ? 500 : 1000;
    const hideDelay = isMobile ? 2000 : 3000;
    
    setTimeout(() => {
        doorContainer.classList.add('doors-open');
    }, animationDelay);
    
    setTimeout(() => {
        doorContainer.style.display = 'none';
    }, hideDelay);
}

// Enhanced Navbar with improved mobile functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;

    // Navbar scroll effect with throttling for better performance
    let ticking = false;
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Enhanced mobile menu toggle
    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger?.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Enhanced navigation for mobile
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            closeMobileMenu();
            
            // Smooth scroll with mobile offset
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(targetId);
            }
        });
    });

    // Active link highlighting with improved mobile detection
    let activeTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(activeTimeout);
        activeTimeout = setTimeout(updateActiveLink, 50);
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset + 100; // Adjust for mobile
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger?.classList.toggle('active');
    navMenu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Prevent body scroll when menu is open
    if (navMenu?.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
}

// Enhanced smooth scrolling for mobile
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    
    const isMobile = checkMobileDevice();
    const offsetTop = target.offsetTop - (isMobile ? 70 : 80);
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Enhanced Scroll Animations with mobile optimization
function initScrollAnimations() {
    const isMobile = checkMobileDevice();
    
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add animation classes with mobile-optimized delays
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .about-image, .about-text');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        // Reduce animation delays on mobile
        const delay = isMobile ? index * 0.05 : index * 0.1;
        el.style.transitionDelay = `${delay}s`;
        observer.observe(el);
    });
}

// Skill Bars Animation with mobile optimization
function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const targetWidth = progressBar?.getAttribute('data-width');
                
                if (progressBar && targetWidth) {
                    // Faster animation on mobile
                    const delay = checkMobileDevice() ? 200 : 500;
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, delay);
                }
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
}

// Enhanced Contact Form with mobile improvements
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form data
        if (!validateFormData(data)) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            const result = await sendEmail(data);
            
            if (result.success) {
                showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
                form.reset();
                
                // Add success animation
                submitBtn.classList.add('success');
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                }, 2000);
                
                // Scroll to success message on mobile
                if (checkMobileDevice()) {
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showFormStatus('error', 'Failed to send message. Please try again or contact me directly.');
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });

    // Enhanced form validation for mobile
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('focus', clearFieldError);
        
        // Mobile-specific improvements
        if (checkMobileDevice()) {
            input.addEventListener('touchstart', () => {
                input.focus();
            });
        }
    });
}

// EmailJS integration (same as before but with better error handling)
async function sendEmail(data) {
    const serviceID = 'service_BO54MD';
    const templateID = 'template_qv0fqqb';
    
    try {
        const response = await emailjs.send(serviceID, templateID, {
            to_name: 'Maheen',
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            reply_to: data.email
        });
        
        return { success: true, response };
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        return { success: false, error: error.text || error.message || 'Unknown error' };
    }
}

// Enhanced Typing Effect with mobile optimization
function initTypingEffect() {
    const welcomeText = document.querySelector('.welcome-text h1');
    if (!welcomeText) return;

    const isMobile = checkMobileDevice();
    const text1 = "Welcome to My";
    const text2 = "Digital Portfolio";
    let currentText = "";
    let isDeleting = false;
    let textIndex = 0;
    let charIndex = 0;
    const texts = [text1, text2];

    function typeEffect() {
        const currentFullText = texts[textIndex];
        
        if (isDeleting) {
            currentText = currentFullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentFullText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (textIndex === 0) {
            welcomeText.innerHTML = `<span class="text-gradient">${currentText}</span><br><span class="text-white">Digital Portfolio</span>`;
        } else {
            welcomeText.innerHTML = `<span class="text-gradient">Welcome to My</span><br><span class="text-white">${currentText}</span>`;
        }

        // Faster typing on mobile
        let typeSpeed = isDeleting ? (isMobile ? 30 : 50) : (isMobile ? 60 : 100);

        if (!isDeleting && charIndex === currentFullText.length) {
            typeSpeed = isMobile ? 1500 : 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start typing effect earlier on mobile
    const startDelay = isMobile ? 1500 : 2000;
    setTimeout(typeEffect, startDelay);
}

// Parallax Effects (disabled on mobile for performance)
function initParallaxEffects() {
    if (checkMobileDevice()) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3; // Reduced intensity
            const transform = `translateY(${scrolled * speed}px)`;
            shape.style.transform = transform;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Form validation functions (same as before)
function validateFormData(data) {
    const errors = [];
    
    if (!data.name?.trim()) {
        errors.push('Name is required');
    }
    
    if (!data.email?.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject?.trim()) {
        errors.push('Subject is required');
    }
    
    if (!data.message?.trim()) {
        errors.push('Message is required');
    }
    
    if (errors.length > 0) {
        showFormStatus('error', errors.join(', '));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;

    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';

    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    field.classList.remove('error');
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        if (!isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorMsg = field.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        field.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Enhanced smooth scrolling for all anchor links
document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        smoothScrollTo(targetId);
    }
});

// Enhanced project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    // Only add hover effects on non-touch devices
    if (!checkMobileDevice()) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0)';
        });
    }
    
    // Add touch feedback for mobile
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// Enhanced ripple effect for better mobile interaction
document.querySelectorAll('.btn, .btn-submit').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (e.clientX || e.touches[0]?.clientX || rect.width / 2) - rect.left - size / 2;
        const y = (e.clientY || e.touches[0]?.clientY || rect.height / 2) - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Enhanced lazy loading with mobile optimization
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: checkMobileDevice() ? '50px' : '100px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Performance monitoring and optimization
function initPerformanceOptimizations() {
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle responsive changes
            const isMobile = checkMobileDevice();
            document.body.classList.toggle('mobile-device', isMobile);
        }, 250);
    });
    
    // Preload critical resources
    window.addEventListener('load', () => {
        const criticalImages = ['image.jpg', 'skill.webp', 'about.png'];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });
    
    // Service Worker registration for offline support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('SW registered'))
                .catch(() => console.log('SW registration failed'));
        });
    }
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Add enhanced CSS for mobile responsiveness
const mobileOptimizedStyles = `
<style>
/* Mobile-first responsive styles */
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.mobile-device .project-card:hover {
    transform: none !important;
}

.mobile-device .floating-shapes {
    display: none;
}

.form-group.error input,
.form-group.error textarea {
    border-bottom-color: var(--danger-color);
}

.error-message {
    color: var(--danger-color);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: block;
}

.btn-submit.success {
    background: var(--gradient-success) !important;
}

.menu-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
}

/* Enhanced mobile navigation */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 70px;
        right: -100%;
        width: 100%;
        height: calc(100vh - 70px);
        background: rgba(15, 15, 35, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 2rem;
        gap: 2rem;
        transition: right 0.3s ease;
        z-index: 999;
        overflow-y: auto;
    }
    
    .nav-menu.active {
        right: 0;
    }
    
    .nav-link {
        font-size: 1.2rem;
        padding: 1rem 2rem;
        width: 90%;
        text-align: center;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .nav-link:hover {
        background: rgba(99, 102, 241, 0.1);
    }
    
    .hamburger {
        display: flex;
        z-index: 1001;
    }
    
    /* Optimize touch interactions */
    .btn, .project-card, .skill-card, .contact-item {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }
    
    /* Improve form on mobile */
    .form-group input,
    .form-group textarea {
        font-size: 16px; /* Prevent zoom on iOS */
        -webkit-appearance: none;
        border-radius: 0;
    }
    
    /* Better mobile typography */
    .welcome-text h1 {
        line-height: 1.2;
        margin-bottom: 1rem;
    }
    
    .welcome-text p {
        line-height: 1.5;
    }
    
    /* Optimize animations for mobile */
    .skill-progress,
    .project-card,
    .contact-item {
        will-change: transform;
    }
}

/* Landscape phone optimization */
@media (max-height: 500px) and (orientation: landscape) {
    .nav-menu {
        padding-top: 1rem;
        gap: 1rem;
    }
    
    .nav-link {
        padding: 0.5rem 2rem;
        font-size: 1rem;
    }
}

/* High-resolution displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .skill-progress::after {
        width: 10px;
    }
}

/* Focus management for accessibility */
.nav-link:focus,
.btn:focus,
.form-group input:focus,
.form-group textarea:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Loading states */
.lazy {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.lazy.loaded {
    opacity: 1;
}

/* Form status responsive */
.form-status {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
    display: none;
    word-wrap: break-word;
}

.form-status.success {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success-color);
    border: 1px solid var(--success-color);
}

.form-status.error {
    background: rgba(239, 68, 68, 0.2);
    color: var(--danger-color);
    border: 1px solid var(--danger-color);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', mobileOptimizedStyles);

// Console message
console.log(`
🚀 Mobile-Responsive Portfolio Loaded!
📱 Mobile Optimizations: ✅ Active
👨‍💻 Developer: Maheen
📧 EmailJS Integration: ✅ Ready
🎯 Touch-Friendly Interface: ✅ Enabled
`);

/* 
Mobile Responsiveness Improvements Added:

1. ✅ Mobile Device Detection
2. ✅ Touch-Optimized Navigation
3. ✅ Performance Optimizations for Mobile
4. ✅ Enhanced Form Interactions
5. ✅ Improved Touch Feedback
6. ✅ Optimized Animations
7. ✅ Better Typography Scaling
8. ✅ Orientation Change Handling
9. ✅ Zoom Prevention on Input Focus
10. ✅ Enhanced Accessibility Features

Mobile-Specific Features:
- Hamburger menu with smooth slide animation
- Touch-friendly button sizes
- Optimized scroll performance
- Reduced animation complexity on mobile
- Better form validation feedback
- Landscape orientation support
*/