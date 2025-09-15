// Portfolio JavaScript - Interactive Features & Email Integration
// Updated for EmailJS v3.x and modern JavaScript practices

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    initEmailJS();
    
    // Initialize all other components
    initDoorAnimation();
    initNavbar();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initTypingEffect();
    initParallaxEffects();
});

// Initialize EmailJS
function initEmailJS() {
    // Replace with your actual EmailJS Public Key
    const publicKey = '2fXBQ1zNaJxZ42nyX';
    
    // Initialize EmailJS with your public key
    emailjs.init(publicKey);
}

// Door Opening Animation
function initDoorAnimation() {
    const doorContainer = document.getElementById('doorContainer');
    
    setTimeout(() => {
        doorContainer.classList.add('doors-open');
    }, 1000);
    
    setTimeout(() => {
        doorContainer.style.display = 'none';
    }, 3000);
}

// Navbar Functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .about-image, .about-text');
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const targetWidth = progressBar?.getAttribute('data-width');
                
                if (progressBar && targetWidth) {
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 500);
                }
                
                skillObserver.unobserve(entry.target);
            }
        });
    });

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
}

// Typing Effect for Welcome Text
function initTypingEffect() {
    const welcomeText = document.querySelector('.welcome-text h1');
    if (!welcomeText) return;

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

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentFullText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 2000);
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Contact Form with Email Integration
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
            // Send email using EmailJS
            const result = await sendEmail(data);
            
            if (result.success) {
                showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
                form.reset();
                
                // Add success animation
                submitBtn.classList.add('success');
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showFormStatus('error', 'Failed to send message. Please try again or contact me directly.');
        } finally {
            // Restore button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });

    // Form validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('focus', clearFieldError);
    });
}

// Modern EmailJS implementation (v3.x)
async function sendEmail(data) {
    // Replace these with your actual EmailJS credentials
    const serviceID = 'service_BO54MD';    // Your EmailJS Service ID
    const templateID = 'template_qv0fqqb'; // Your EmailJS Template ID
    
    try {
        // EmailJS v3.x syntax
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

// Alternative: Send email using EmailJS with template parameters
async function sendEmailWithTemplate(data) {
    const serviceID = 'service_BO54MD';
    const templateID = 'template_qv0fqqb';
    
    // Template parameters - these should match your EmailJS template variables
    const templateParams = {
        user_name: data.name,
        user_email: data.email,
        user_subject: data.subject,
        user_message: data.message,
        to_email: 'your-email@example.com' // Your email address
    };
    
    try {
        const response = await emailjs.send(serviceID, templateID, templateParams);
        return { success: true, response };
    } catch (error) {
        console.error('EmailJS Error:', error);
        return { success: false, error: error.text || error.message || 'Unknown error' };
    }
}

// Validate form data
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

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Alternative: Send email using Formspree (simpler setup)
async function sendEmailFormspree(data) {
    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Network response was not ok');
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function showFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;

    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validation rules
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
    
    // Create or update error message
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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) rotateY(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateY(0)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn, .btn-submit').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
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

// Lazy loading for images
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
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Add some CSS for animations and effects
const additionalStyles = `
<style>
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
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy.loaded {
    opacity: 1;
}

.form-status {
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    display: none;
}

.form-status.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.form-status.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Additional mobile optimizations */
@media (max-width: 768px) {
    .floating-shapes {
        display: none; /* Hide floating shapes on mobile for better performance */
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical images
    const criticalImages = ['image.jpg', 'skill.webp'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Console message for developers
console.log(`
🚀 Portfolio Website Loaded Successfully!
👨‍💻 Developed by Maheen
📧 Contact: maheen@example.com
🌟 GitHub: github.com/maheen
EmailJS Integration: ✅ Ready
`);

/* 
EmailJS Setup Instructions (Updated for v3.x):

1. Go to https://www.emailjs.com/
2. Create a free account
3. Go to Email Services and add your email service (Gmail, Outlook, etc.)
4. Go to Email Templates and create a new template
5. In your template, use these variable names:
   - {{to_name}} - Your name
   - {{from_name}} - Sender's name
   - {{from_email}} - Sender's email
   - {{subject}} - Email subject
   - {{message}} - Email message
   - {{reply_to}} - Reply-to email

6. Go to Account > General and copy your Public Key
7. Replace the values in the code:
   - publicKey: Your Public Key
   - serviceID: Your Service ID
   - templateID: Your Template ID

8. Add EmailJS script to your HTML:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

Formspree Alternative (Simpler):
1. Go to https://formspree.io/
2. Create a free account
3. Create a new form
4. Get your form endpoint
5. Replace 'YOUR_FORM_ID' in sendEmailFormspree function
6. Use sendEmailFormspree instead of sendEmail in the form handler
*/