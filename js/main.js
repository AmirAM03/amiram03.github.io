// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle --- (Keep existing)
    // ...

    // --- Dynamic Hero Gradient ---
    const heroSection = document.getElementById('hero');
    const dynamicGradientBg = heroSection.querySelector('.dynamic-gradient-background');
    const heroGradients = [
        'var(--gradient-hero-1)', // Make sure these CSS variables are defined
        'var(--gradient-hero-2)',
        'var(--gradient-hero-3)',
        'var(--gradient-hero-4)',
        'var(--gradient-hero-5)',
        'var(--gradient-hero-6)'
    ];
    let currentGradientIndex = 0;

    function changeHeroGradient() {
        if (!dynamicGradientBg) return;
        currentGradientIndex = (currentGradientIndex + 1) % heroGradients.length;
        // We directly set the background style. The CSS transition will handle smoothness.
        dynamicGradientBg.style.background = heroGradients[currentGradientIndex];
        // If your gradients use angles that you want to animate, you could also change CSS variables
        // document.documentElement.style.setProperty('--hero-gradient-angle', `${Math.random() * 360}deg`);
    }

    if (dynamicGradientBg) {
        // Set initial gradient
        dynamicGradientBg.style.background = heroGradients[currentGradientIndex];
        // Change gradient every N seconds
        setInterval(changeHeroGradient, 7000); // Change every 7 seconds
    }


    // --- Smooth Scrolling & Active Nav Link --- (Mostly existing, check section IDs)
    const navLinks = document.querySelectorAll('header nav a, .scroll-link');
    const sections = document.querySelectorAll('section#hero, section.cv-section'); // Ensure hero is included for offset calc

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                let headerOffset = document.getElementById('main-header') ? document.getElementById('main-header').offsetHeight : 70;
                window.scrollTo({ top: targetSection.offsetTop - headerOffset, behavior: 'smooth'});

                // Update active class on nav links (will also be handled by scroll observer)
                // navLinks.forEach(nav => nav.classList.remove('active'));
                // if(!this.id || this.id !== "back-to-top") {
                //    this.classList.add('active');
                // }
                // if (targetId === 'hero') {
                //     document.querySelector('header nav a[href="#hero"]').classList.add('active');
                // }
            }
        });
    });

    function updateActiveNavLink() {
        let currentSectionId = 'hero'; // Default to hero
        let headerOffset = document.getElementById('main-header') ? document.getElementById('main-header').offsetHeight : 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset - 50; // 50px buffer
            // Check if section is at the top or has been scrolled past
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    // Initial active link set
    updateActiveNavLink();


    // --- Typing Effect for Hero Section --- (Keep existing)
    // ... The wordsToType array might need slight adjustment if your tagline changes
    const wordsToType = ["CyberSecurity Specialist", "Data Scientist", "AI Developer", "Software Architect", "Neuroscience Researcher"];
    // ...

    // --- Scroll Animations for Sections (Intersection Observer) --- (Keep existing)
    const allSections = document.querySelectorAll('.cv-section, #hero');
    // ...

    // --- Back to Top Button --- (Keep existing)
    const backToTopButton = document.getElementById('back-to-top');
    window.onscroll = () => {
        updateActiveNavLink(); // Call nav update on scroll
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            if (backToTopButton) { // Check if button exists
                 backToTopButton.style.opacity = '1';
                 backToTopButton.style.transform = 'translateY(0)';
            }
        } else {
            if (backToTopButton) {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.transform = 'translateY(20px)';
            }
        }
    };
    // ... (rest of backToTopButton logic)


    // --- Contact Form --- (Keep existing)
    // ...

    // --- Current Year for Footer --- (Keep existing)
    // ...

    // Initial call to set active nav link based on page load (e.g. if there's a hash)
    // This part can be simplified a bit as updateActiveNavLink already handles it.
    if (window.location.hash) {
        const initialTargetId = window.location.hash.substring(1);
        const initialTargetSection = document.getElementById(initialTargetId);
        let headerOffset = document.getElementById('main-header') ? document.getElementById('main-header').offsetHeight : 70;
        if (initialTargetSection) {
            setTimeout(() => {
                 window.scrollTo({ top: initialTargetSection.offsetTop - headerOffset, behavior: 'auto'}); // 'auto' for initial load
                 updateActiveNavLink(); // Re-check active link after scroll
            }, 100);
        }
    } else {
        updateActiveNavLink(); // Ensure correct link is active on load without hash
    }
});