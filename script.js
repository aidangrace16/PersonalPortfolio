document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top when page loads or reloads
    window.scrollTo(0, 0);
    
    // Also use setTimeout to ensure it works after all content loads
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);

    // Track if typing animation has already run to prevent duplicates
    let typingAnimationRunning = false;

    // Typing animation for hero paragraph
    function startTypingAnimation() {
        // Prevent multiple animations from running at the same time
        if (typingAnimationRunning) return;
        
        // Find the first paragraph in the hero section
        const heroParagraph = document.querySelector('#hero .section-inner p:first-of-type');
        
        if (!heroParagraph) return; // Exit if paragraph not found
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Show full text immediately for accessibility
            heroParagraph.style.opacity = '1';
            return;
        }
        
        // Check if paragraph contains nested HTML elements
        if (heroParagraph.children.length > 0) {
            // If it has nested elements, just fade it in to avoid breaking markup
            heroParagraph.style.opacity = '0';
            heroParagraph.style.transition = 'opacity 1s ease-in';
            setTimeout(() => {
                heroParagraph.style.opacity = '1';
            }, 500);
            return;
        }
        
        // Mark animation as running
        typingAnimationRunning = true;
        
        // Clean up any existing classes from previous runs
        heroParagraph.classList.remove('hero-typing', 'typing-complete');
        
        // Get the full text content (store the original text)
        const fullText = heroParagraph.textContent || 'Hello! This is where you can learn more about me!';
        
        // Add typing class and clear text initially
        heroParagraph.classList.add('hero-typing');
        heroParagraph.textContent = '';
        heroParagraph.style.opacity = '1';
        
        let currentIndex = 0;
        const typingSpeed = 70; // Speed in milliseconds per character
        let typingTimeout; // Store timeout reference for cleanup
        
        // Function to type one character at a time
        function typeCharacter() {
            if (currentIndex < fullText.length) {
                // Add the next character
                heroParagraph.textContent = fullText.substring(0, currentIndex + 1);
                currentIndex++;
                
                // Continue typing after a delay
                typingTimeout = setTimeout(typeCharacter, typingSpeed);
            } else {
                // Typing is complete - stop cursor blinking
                heroParagraph.classList.add('typing-complete');
                typingAnimationRunning = false; // Allow future animations
            }
        }
        
        // Start typing after a small delay
        setTimeout(typeCharacter, 1000);
    }

    // Start typing animation on page load
    startTypingAnimation();

    // Existing project cards scroll functionality
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
    if (projectsContainer) {
        projectsContainer.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveCard);
        });

        // Update on touch events for smoother mobile experience
        projectsContainer.addEventListener('touchmove', () => {
            requestAnimationFrame(updateActiveCard);
        });

        // Initial state
        requestAnimationFrame(updateActiveCard);
    }

    // New scroll animation functionality for sections
    const sections = document.querySelectorAll('section');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Element is considered in view when 20% of it is visible
        return (
            rect.top <= windowHeight * 0.8 &&
            rect.bottom >= windowHeight * 0.2
        );
    }
    
    // Function to animate sections when they come into view
    function animateSections() {
        sections.forEach(section => {
            if (isInViewport(section)) {
                // Add animation class to trigger CSS animation
                section.classList.add('animate-in');
            }
        });
    }
    
    // Run animation check on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(animateSections);
    });
    
    // Run animation check on page load
    animateSections();
    
    // Add smooth scrolling behavior for navigation links
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Bio paragraph fade-in animation
    function setupBioAnimation() {
        // Find the bio section
        const bioSection = document.querySelector('#bio');
        if (!bioSection) return;
        
        // Find the paragraph inside the bio section
        const bioParagraph = bioSection.querySelector('.section-inner p');
        if (!bioParagraph) return;
        
        // Split the paragraph content by <br><br> to create separate paragraphs
        const paragraphText = bioParagraph.innerHTML;
        const paragraphParts = paragraphText.split('<br><br>');
        
        // Clear the original paragraph
        bioParagraph.innerHTML = '';
        
        // Create separate paragraph elements for each part
        const paragraphElements = [];
        paragraphParts.forEach((part, index) => {
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = part.trim();
            newParagraph.classList.add('bio-paragraph');
            bioParagraph.appendChild(newParagraph);
            paragraphElements.push(newParagraph);
            
            // Add a line break after each paragraph except the last one
            if (index < paragraphParts.length - 1) {
                const lineBreak = document.createElement('br');
                bioParagraph.appendChild(lineBreak);
            }
        });
        
        // Track if animation has already run
        let bioAnimationTriggered = false;
        
        // Function to check if bio section is in viewport
        function isBioInView() {
            const rect = bioSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Trigger when 30% of the section is visible
            return rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.3;
        }
        
        // Function to start the fade-in animation
        function startBioFadeIn() {
            if (bioAnimationTriggered) return;
            bioAnimationTriggered = true;
            
            // Fade in each paragraph with a delay
            paragraphElements.forEach((paragraph, index) => {
                setTimeout(() => {
                    paragraph.classList.add('fade-in');
                }, index * 600); // 600ms delay between each paragraph
            });
        }
        
        // Check on scroll
        function checkBioScroll() {
            if (isBioInView()) {
                startBioFadeIn();
            }
        }
        
        // Add scroll listener for bio animation
        window.addEventListener('scroll', () => {
            requestAnimationFrame(checkBioScroll);
        });
        
        // Check immediately in case section is already in view
        checkBioScroll();
    }
    
    // Setup bio animation after typing animation is ready
    setTimeout(setupBioAnimation, 500);
});

// Additional backup: force scroll to top before page unloads (for browser back button)
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Simplified page show handler - just scroll to top, don't restart animation
window.addEventListener('pageshow', () => {
    window.scrollTo(0, 0);
});
