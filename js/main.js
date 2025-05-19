// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }

    themeToggleBtn.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });

    // --- Smooth Scrolling & Active Nav Link ---
    const navLinks = document.querySelectorAll('header nav a, .scroll-link');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // For smooth scroll (browser native)
                // window.scrollTo({ top: targetSection.offsetTop - 70, behavior: 'smooth' });

                // For section transitions (if not using native scroll)
                sections.forEach(sec => sec.classList.remove('active-section'));
                targetSection.classList.add('active-section');
                // Scroll to top of target section. Adjust offset for fixed header.
                window.scrollTo({ top: targetSection.offsetTop - document.getElementById('main-header').offsetHeight, behavior: 'smooth'});

                // Update active class on nav links
                navLinks.forEach(nav => nav.classList.remove('active'));
                if(!this.id || this.id !== "back-to-top") { // Don't mark "back to top" as active nav item
                   this.classList.add('active');
                }
                 // Special case for hero section link if it's not directly targeted by scroll
                if (targetId === 'hero') {
                    document.querySelector('header nav a[href="#hero"]').classList.add('active');
                }
            }
        });
    });

    // Update active nav link on scroll
    function updateActiveNavLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - (document.getElementById('main-header').offsetHeight + 50)) { // Adjusted offset
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
        // Ensure home is active when at the very top
        if (pageYOffset < sections[0].offsetTop - (document.getElementById('main-header').offsetHeight + 50) && currentSectionId === sections[0].id) {
             document.querySelector('header nav a[href="#hero"]').classList.add('active');
        }
    }


    // --- Typing Effect for Hero Section ---
    const typedTextSpan = document.getElementById('typed-text');
    const wordsToType = ["CyberSecurity Enthusiast", "Neuroscience Explorer", "Software Developer", "AI Innovator"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = wordsToType[wordIndex];
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 1500); // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsToType.length;
            setTimeout(type, 500); // Pause before typing next word
            return;
        }

        const typeSpeed = isDeleting ? 75 : 150;
        setTimeout(type, typeSpeed);
    }
    if (typedTextSpan) setTimeout(type, 500);


    // --- Scroll Animations for Sections (Intersection Observer) ---
    const allSections = document.querySelectorAll('.cv-section, #hero'); // Include hero too
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Optional: unobserve after first animation
            } else {
                // Optional: remove 'visible' to re-animate on scroll up/down
                // entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.15 }); // Trigger when 15% of the section is visible

    allSections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    window.onscroll = () => {
        updateActiveNavLink(); // Call nav update on scroll
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            if (backToTopButton) backToTopButton.style.opacity = '1';
            if (backToTopButton) backToTopButton.style.transform = 'translateY(0)';
        } else {
            if (backToTopButton) backToTopButton.style.opacity = '0';
            if (backToTopButton) backToTopButton.style.transform = 'translateY(20px)';
        }
    };
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Contact Form (Basic Handler - for show, actual sending needs backend/service) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // For now, just log or show an alert.
            // For actual email sending, you'd use a service like Netlify Forms, Formspree, or a backend.
            alert('Thank you for your message! (This is a demo - form not connected)');
            this.reset();
        });
    }

    // --- Current Year for Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Initial call to set active nav link based on page load (e.g. if there's a hash)
    updateActiveNavLink();
    if (window.location.hash) {
        const initialTargetId = window.location.hash.substring(1);
        const initialTargetSection = document.getElementById(initialTargetId);
        if (initialTargetSection) {
            setTimeout(() => { // Timeout to ensure layout is complete
                 window.scrollTo({ top: initialTargetSection.offsetTop - document.getElementById('main-header').offsetHeight, behavior: 'smooth'});
            }, 100);
        }
    } else {
         // Ensure hero is active if no hash
        document.querySelector('header nav a[href="#hero"]').classList.add('active');
    }

});