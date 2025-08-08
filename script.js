document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector('.projects-container');
    const cards = document.querySelectorAll('.project-card');
    
    function updateActiveCard() {
        const containerRect = projectsContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + (containerRect.width / 2);
        
        let closestCard = null;
        let closestDistance = Infinity;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + (cardRect.width / 2);
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
            }
        });
        
        // Remove active class from all cards
        cards.forEach(card => card.classList.remove('active'));
        // Add active class to closest card
        if (closestCard) {
            closestCard.classList.add('active');
        }
    }

    // Update on scroll
    projectsContainer.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveCard);
    });

    // Update on touch events for smoother mobile experience
    projectsContainer.addEventListener('touchmove', () => {
        requestAnimationFrame(updateActiveCard);
    });

    // Initial state
    requestAnimationFrame(updateActiveCard);
});
