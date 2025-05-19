// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#main-nav a');
    const sections = document.querySelectorAll('.cv-section');
    const yearSpan = document.getElementById('current-year');

    // Set current year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Function to show a section and load its graph
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                // Dynamically load graph for this section if not already loaded
                // The graph-loader.js will handle the actual loading
                if (typeof loadGraphForSection === 'function') {
                    loadGraphForSection(sectionId);
                }
            } else {
                section.classList.remove('active');
            }
        });

        // Update active link in nav
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active-nav-link');
            } else {
                link.classList.remove('active-nav-link');
            }
        });
    }

    // Event listeners for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor jump
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
            // Optional: Update URL hash
            // window.location.hash = sectionId;
        });
    });

    // Show the first section by default or based on URL hash
    let initialSectionId = 'cybersecurity'; // Default
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        if (document.getElementById(hashId)) {
            initialSectionId = hashId;
        }
    }
    showSection(initialSectionId);

});