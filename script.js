document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Gateway Opening Interaction --- */
    const openBtn = document.getElementById('openBtn');
    const gateway = document.getElementById('gateway');
    const mainContent = document.getElementById('mainContent');
    const firefliesContainer = document.getElementById('fireflies-container');

    let isOpened = false;

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            isOpened = true;
            gateway.classList.add('open');
            createBurst(window.innerWidth / 2, window.innerHeight / 2, 30); // Big burst

            setTimeout(() => {
                gateway.classList.add('hidden');
                mainContent.classList.add('visible');
                initFireflies(); // Start fireflies only after open
            }, 1000);
        });
    }

    /* --- 2. Advanced Interactive Scroll & Typewriter --- */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const typewriterQuote = document.getElementById('typewriter-quote');
    const quoteSource = document.querySelector('.quote-source');
    
    let isTypingStarted = false;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger Typewriter when quote section becomes visible
                if (entry.target.classList.contains('quote') && !isTypingStarted) {
                    isTypingStarted = true;
                    typeWriterEffect(typewriterQuote, () => {
                        quoteSource.classList.add('visible'); // Show source after typing
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-delayed, .box-panel').forEach(el => observer.observe(el));

    function typeWriterEffect(element, callback) {
        const textToType = element.getAttribute('data-text');
        element.innerHTML = ''; // clear it
        let i = 0;
        const speed = 40; // ms per char
        
        function typeWriter() {
            if (i < textToType.length) {
                element.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                element.classList.add('typing-done'); // removes cursor
                if(callback) callback();
            }
        }
        typeWriter();
    }


    /* --- 3. Parallax Background & 3D Mouse Tilt --- */
    const parallaxBg = document.getElementById('parallax-bg');
    const tiltElements = document.querySelectorAll('.tilt-element .glass-panel');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        if (!isOpened || window.innerWidth < 768) return; 

        mouseX = e.clientX;
        mouseY = e.clientY;

        const xCenter = window.innerWidth / 2;
        const yCenter = window.innerHeight / 2;

        // 1. Move Background Parallax (Moves opposite to mouse)
        const bgMoveX = (mouseX - xCenter) / 40;
        const bgMoveY = (mouseY - yCenter) / 40;
        parallaxBg.style.transform = `translate(${-bgMoveX}px, ${-bgMoveY}px) scale(1.05)`;

        // 2. Tilt Glass Panels
        tiltElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Check if element is in viewport
            if (rect.top > window.innerHeight || rect.bottom < 0) return;

            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;
            
            const rotateY = ((mouseX - elCenterX) / (rect.width / 2)) * 3; // Max 3 deg
            const rotateX = -((mouseY - elCenterY) / (rect.height / 2)) * 3;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Interactive Shine
            const shineX = ((mouseX - rect.left) / rect.width) * 100;
            const shineY = ((mouseY - rect.top) / rect.height) * 100;
            el.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 100%)`;
        });
    });

    // Reset tilts on mouse leave
    document.addEventListener('mouseleave', () => {
        parallaxBg.style.transform = `translate(0, 0) scale(1.05)`;
        tiltElements.forEach(el => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            el.style.background = `rgba(255, 255, 255, 0.4)`;
        });
    });


    /* --- 4. Interactive Fireflies (Boids) --- */
    const fireflies = [];
    const numFireflies = window.innerWidth > 768 ? 25 : 10;

    function initFireflies() {
        for (let i = 0; i < numFireflies; i++) {
            const f = document.createElement('div');
            f.className = 'firefly';
            
            // Random start position
            let fx = Math.random() * window.innerWidth;
            let fy = Math.random() * window.innerHeight;
            
            f.style.left = `${fx}px`;
            f.style.top = `${fy}px`;
            
            // Random size variation
            const scale = Math.random() * 0.8 + 0.4;
            f.style.transform = `scale(${scale})`;
            
            // Random animation delay
            f.style.animationDelay = `${Math.random() * 5}s`;
            
            firefliesContainer.appendChild(f);
            fireflies.push({
                el: f,
                x: fx,
                y: fy,
                vx: (Math.random() - 0.5) * 1, // Velocity
                vy: (Math.random() - 0.5) * 1,
                targetX: fx,
                targetY: fy
            });
        }
        requestAnimationFrame(updateFireflies);
    }

    function updateFireflies() {
        fireflies.forEach(f => {
            // Random wandering
            if (Math.random() < 0.05) {
                f.vx += (Math.random() - 0.5) * 0.5;
                f.vy += (Math.random() - 0.5) * 0.5;
            }

            // Scatter from mouse if close
            const dx = mouseX - f.x;
            const dy = mouseY - f.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 150) { // If mouse is within 150px
                f.vx -= (dx / dist) * 1.5; // push away
                f.vy -= (dy / dist) * 1.5;
            }

            // Speed limit
            const speed = Math.sqrt(f.vx*f.vx + f.vy*f.vy);
            if (speed > 3) {
                f.vx = (f.vx / speed) * 3;
                f.vy = (f.vy / speed) * 3;
            }

            // Apply friction
            f.vx *= 0.98;
            f.vy *= 0.98;

            // Update position
            f.x += f.vx;
            f.y += f.vy;

            // Bounce off walls gently
            if (f.x < 0 || f.x > window.innerWidth) f.vx *= -1;
            if (f.y < 0 || f.y > window.innerHeight) f.vy *= -1;

            f.el.style.left = `${f.x}px`;
            f.el.style.top = `${f.y}px`;
        });
        requestAnimationFrame(updateFireflies);
    }

    /* --- 5. Interactive RSVP & Calendar --- */
    const btnAccept = document.getElementById('btnAccept');
    const btnDecline = document.getElementById('btnDecline');
    const rsvpContainer = document.getElementById('rsvpContainer');
    const rsvpResponse = document.getElementById('rsvpResponse');
    const responseMsg = document.getElementById('responseMsg');

    if (btnAccept && btnDecline) {
        btnAccept.addEventListener('click', (e) => {
            createBurst(e.clientX, e.clientY, 15);
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

    // Add to Calendar Generator (downloads a basic .ics file dynamically)
    document.getElementById('addToCalBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const event = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260503T110000
DTEND:20260503T150000
SUMMARY:First Holy Communion - C. Cecil Antony Heartson
LOCATION:Vailankanni Arockia Annai Church, Coimbatore
DESCRIPTION:Reception to follow at Zone Connect, 39, Kalapatti Main Road, Coimbatore
END:VEVENT
END:VCALENDAR`;
        
        const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Communion_Invitation.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    /* Utilities */
    function createBurst(x, y, count = 10) {
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                const size = Math.random() * 15 + 5;
                const offsetX = (Math.random() - 0.5) * 60;
                const offsetY = (Math.random() - 0.5) * 60;

                sparkle.style.width = `${size}px`;
                sparkle.style.height = `${size}px`;
                sparkle.style.left = `${x + offsetX}px`;
                sparkle.style.top = `${y + offsetY}px`;

                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 20);
        }
    }
});
