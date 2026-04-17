document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Gateway Opening Interaction --- */
    const openBtn = document.getElementById('openBtn');
    const gateway = document.getElementById('gateway');
    const mainContent = document.getElementById('mainContent');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Add open class to trigger CSS 3D door rotation
            gateway.classList.add('open');
            
            // Create a burst of gold particles
            createBurst(window.innerWidth / 2, window.innerHeight / 2);

            // After door animation, hide gateway and reveal content
            setTimeout(() => {
                gateway.classList.add('hidden');
                mainContent.classList.add('visible');
            }, 1000);
        });
    }

    /* --- 2. Scroll Animations (Fade-in) --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    /* --- 3. Interactive 3D Tilt Effect --- */
    // Inspired by VanillaTilt
    const tiltElements = document.querySelectorAll('.tilt-element .glass-panel');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if(window.innerWidth < 768) return; // Disable on mobile for performance

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // Calculate rotation amount
            // center is 0, edges are max +/- rotation (-5 to +5 deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4; // inverted y
            const rotateY = ((x - centerX) / centerX) * 4;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Subtle lighting effect based on cursor
            const shineX = (x / rect.width) * 100;
            const shineY = (y / rect.height) * 100;
            el.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 60%)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            el.style.background = `rgba(255, 255, 255, 0.4)`; // reset to default CSS
        });
    });

    /* --- 4. Interactive RSVP Form --- */
    const btnAccept = document.getElementById('btnAccept');
    const btnDecline = document.getElementById('btnDecline');
    const rsvpContainer = document.getElementById('rsvpContainer');
    const rsvpResponse = document.getElementById('rsvpResponse');
    const responseMsg = document.getElementById('responseMsg');

    if (btnAccept && btnDecline) {
        btnAccept.addEventListener('click', (e) => {
            createBurst(e.clientX, e.clientY);
            rsvpContainer.style.display = 'none';
            responseMsg.innerHTML = "We are overjoyed! Looking forward to seeing you there.";
            responseMsg.style.color = "#8B6508";
            rsvpResponse.classList.remove('hidden');
        });

        btnDecline.addEventListener('click', () => {
            rsvpContainer.style.display = 'none';
            responseMsg.innerHTML = "We will miss you, but sincerely thank you for your prayers and blessings.";
            responseMsg.style.color = "#5c4e40";
            rsvpResponse.classList.remove('hidden');
        });
    }

    /* --- 5. Interactive Magic Cursor Sparkles --- */
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
        // Limit sparkle creation rate
        const now = Date.now();
        if (now - lastTime < 50) return;
        lastTime = now;

        // Only show sparkles if gateway is open and on desktop
        if (gateway.classList.contains('hidden') && window.innerWidth > 768) {
            // 20% chance to create a sparkle on mouse move for subtle effect
            if (Math.random() > 0.8) {
                createSparkle(e.clientX, e.clientY);
            }
        }
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Randomize size and offset
        const size = Math.random() * 15 + 5;
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x + offsetX}px`;
        sparkle.style.top = `${y + offsetY}px`;

        document.body.appendChild(sparkle);

        // Remove after animation (1s)
        setTimeout(() => {
            if(sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
        }, 1000);
    }

    function createBurst(x, y) {
        for(let i=0; i<15; i++) {
            setTimeout(() => {
                createSparkle(x, y);
            }, i * 30);
        }
    }
});
