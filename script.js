document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector('.projects-container');
    const cards = document.querySelectorAll('.project-card');

    // Create intersection observer to detect centered cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all cards
                cards.forEach(card => card.classList.remove('active'));
                // Add active class to centered card
                entry.target.classList.add('active');
            }
        });
    }, {
        root: projectsContainer,
        threshold: 0.8, // Card needs to be 80% visible
        rootMargin: '-10% 0px -10% 0px' // Creates a narrower detection zone in the center
    });

    // Observe all cards
    cards.forEach(card => observer.observe(card));

    // Optional: Add initial active class to first card
    if (cards.length) {
        cards[0].classList.add('active');
    }
});
