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
            createBurst(window.innerWidth / 2, window.innerHeight / 2, 40); // Big golden burst

            setTimeout(() => {
                gateway.classList.add('hidden');
                mainContent.classList.add('visible');
                initFireflies(); // Start angelic particles only after open
            }, 1200);
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
        if(!element) return;
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
        setTimeout(typeWriter, 500);
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

        // 1. Move Background Parallax
        const bgMoveX = (mouseX - xCenter) / 50;
        const bgMoveY = (mouseY - yCenter) / 50;
        if(parallaxBg) parallaxBg.style.transform = `translate(${-bgMoveX}px, ${-bgMoveY}px) scale(1.05)`;

        // 2. Tilt Glass Panels based on mouse position relative to element
        tiltElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) return;

            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;
            
            const rotateY = ((mouseX - elCenterX) / (rect.width / 2)) * 4; 
            const rotateX = -((mouseY - elCenterY) / (rect.height / 2)) * 4;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Interactive Shine
            const shineX = ((mouseX - rect.left) / rect.width) * 100;
            const shineY = ((mouseY - rect.top) / rect.height) * 100;
            el.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.4) 100%)`;
        });
    });

    // Reset tilts on mouse leave
    document.addEventListener('mouseleave', () => {
        if(parallaxBg) parallaxBg.style.transform = `translate(0, 0) scale(1.05)`;
        tiltElements.forEach(el => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            el.style.background = `rgba(255, 255, 255, 0.6)`;
        });
    });


    /* --- 4. Celestial Particle Engine --- */
    const fireflies = [];
    const numFireflies = window.innerWidth > 768 ? 30 : 15;

    function initFireflies() {
        if(!firefliesContainer) return;
        for (let i = 0; i < numFireflies; i++) {
            const f = document.createElement('div');
            f.className = 'firefly';
            
            let fx = Math.random() * window.innerWidth;
            let fy = Math.random() * window.innerHeight;
            
            f.style.left = `${fx}px`;
            f.style.top = `${fy}px`;
            
            const scale = Math.random() * 0.8 + 0.4;
            f.style.transform = `scale(${scale})`;
            f.style.animationDelay = `${Math.random() * 5}s`;
            
            firefliesContainer.appendChild(f);
            fireflies.push({
                el: f, x: fx, y: fy,
                vx: (Math.random() - 0.5) * 1, vy: (Math.random() - 0.5) * 1
            });
        }
        requestAnimationFrame(updateFireflies);
    }

    function updateFireflies() {
        fireflies.forEach(f => {
            if (Math.random() < 0.05) {
                f.vx += (Math.random() - 0.5) * 0.6;
                f.vy += (Math.random() - 0.5) * 0.6;
            }

            // Scatter from mouse or attract towards it
            const dx = mouseX - f.x;
            const dy = mouseY - f.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 200) { 
                f.vx += (dx / dist) * 0.05; // Gentle pull towards mouse (magic cursor effect)
                f.vy += (dy / dist) * 0.05;
            }

            // Speed limit
            const speed = Math.sqrt(f.vx*f.vx + f.vy*f.vy);
            if (speed > 2) {
                f.vx = (f.vx / speed) * 2;
                f.vy = (f.vy / speed) * 2;
            }

            f.x += f.vx; f.y += f.vy;

            // Screen bounds wrapping
            if (f.x < -20) f.x = window.innerWidth + 20;
            if (f.x > window.innerWidth + 20) f.x = -20;
            if (f.y < -20) f.y = window.innerHeight + 20;
            if (f.y > window.innerHeight + 20) f.y = -20;

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
            createBurst(e.clientX, e.clientY, 20);
            rsvpContainer.style.display = 'none';
            responseMsg.innerHTML = "Thank you! We eagerly anticipate your presence. ✨";
            responseMsg.style.color = "#8b0000";
            rsvpResponse.classList.remove('hidden');
        });

        btnDecline.addEventListener('click', () => {
            rsvpContainer.style.display = 'none';
            responseMsg.innerHTML = "We will miss you! Thank you for your continued prayers and blessings. 🙏";
            responseMsg.style.color = "#5c4e40";
            rsvpResponse.classList.remove('hidden');
        });
    }

    const calBtn = document.getElementById('addToCalBtn');
    if(calBtn) {
        calBtn.addEventListener('click', (e) => {
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
            link.setAttribute('download', 'Communion_Cecil.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    function createBurst(x, y, count = 10) {
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'absolute';
                sparkle.style.backgroundColor = i % 2 === 0 ? '#FFDF00' : '#ffffff';
                sparkle.style.boxShadow = '0 0 10px #DAA520';
                sparkle.style.borderRadius = '50%';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '10000';
                
                const size = Math.random() * 8 + 3;
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;

                sparkle.style.width = `${size}px`;
                sparkle.style.height = `${size}px`;
                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;
                sparkle.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                document.body.appendChild(sparkle);
                
                // Animate outwards
                setTimeout(() => {
                    sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0)`;
                    sparkle.style.opacity = '0';
                }, 10);

                setTimeout(() => sparkle.remove(), 800);
            }, i * 10);
        }
    }


    /* --- 6. 🤖 Interactive AI Event Assistant --- */
    const botTrigger = document.getElementById('ai-bot-trigger');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('closeAiChat');
    const aiChatBody = document.getElementById('aiChatBody');
    const aiInputText = document.getElementById('aiInputText');
    const aiSendBtn = document.getElementById('aiSendBtn');

    if (botTrigger && chatWindow) {
        botTrigger.addEventListener('click', () => {
            chatWindow.classList.remove('hidden');
            botTrigger.style.transform = 'scale(0)';
            setTimeout(()=> botTrigger.style.display = 'none', 300);
            aiInputText.focus();
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            botTrigger.style.display = 'flex';
            setTimeout(()=> botTrigger.style.transform = 'scale(1)', 10);
        });

        // Expose global function for chip clicks
        window.askAI = function(question) {
            processChat(question);
        };

        aiSendBtn.addEventListener('click', () => {
            if(aiInputText.value.trim() !== '') {
                processChat(aiInputText.value.trim());
            }
        });

        aiInputText.addEventListener('keypress', (e) => {
            if(e.key === 'Enter' && aiInputText.value.trim() !== '') {
                processChat(aiInputText.value.trim());
            }
        });
    }

    // Simplistic Rule-Based "AI" Logic
    function processChat(userText) {
        // Add User Message
        addChatMessage(userText, 'user');
        aiInputText.value = '';

        // Simulate thinking delay
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const response = generateAIResponse(userText.toLowerCase());
            addChatMessage(response, 'bot');
        }, 1000 + Math.random() * 800); // 1-1.8s delay
    }

    function addChatMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.innerHTML = text; // Allow simple HTML in responses
        aiChatBody.appendChild(msgDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg bot typing-indicator`;
        msgDiv.id = 'typingIndicator';
        msgDiv.textContent = '...';
        aiChatBody.appendChild(msgDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('typingIndicator');
        if(ind) ind.remove();
    }

    // The Brain of the Event Assistant
    function generateAIResponse(input) {
        if (input.includes('when') || input.includes('time') || input.includes('date') || input.includes('day')) {
            return "The First Holy Communion is on <strong>Sunday, 3rd May 2026</strong>. <br>The service begins exactly at <strong>11:00 AM</strong>.";
        }
        if (input.includes('where') || input.includes('church') || input.includes('location') || input.includes('mass')) {
            if (input.includes('reception') || input.includes('party')) {
                return "The reception will be held at <strong>Zone Connect</strong>.<br>Address: 39, Kalapatti Main Road, Coimbatore - 641 014.<br><a href='https://maps.google.com/?q=Zone+Connect+39+Kalapatti+Main+Road+Coimbatore' target='_blank' style='color:#8b0000; font-weight:bold;'>Open Map 📍</a>";
            }
            return "The Holy Mass will take place at <strong>Vailankanni Arockia Annai Church</strong>.<br>Located at: Rathinam Nagar, Cheran Managar, Coimbatore - 641048.";
        }
        if (input.includes('who') || input.includes('parents') || input.includes('child') || input.includes('boy')) {
            return "We are celebrating <strong>C. Cecil Antony Heartson</strong> receiving his First Holy Communion! His proud parents are C. Valerian Gracias Cyril & R. Infant Mychiline Priya.";
        }
        if (input.includes('god') || input.includes('godparents') || input.includes('sponsor')) {
            return "Cecil's wonderful Godparents are <strong>D.A.A.P Chandran</strong> and <strong>I. Josephine Maria Assunta</strong>.";
        }
        if (input.includes('gift') || input.includes('bring') || input.includes('dress') || input.includes('wear')) {
            return "Your presence and your heartfelt prayers are the greatest gifts of all! We just want to share this blessed day with you.";
        }
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return "Hello there! I'm here to help you with any details regarding Cecil's Communion. Ask me about the time, location, or anything else you need!";
        }
        if (input.includes('thank') || input.includes('thanks')) {
            return "You're very welcome! Let me know if you need any other details. ✨";
        }
        
        // Default Fallback
        return "I'm not quite sure about that! But I can tell you about the <strong>Time</strong>, <strong>Location</strong>, our <strong>Reception</strong>, or the <strong>Family</strong>. What would you like to know?";
    }
});
