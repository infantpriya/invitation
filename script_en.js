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
            createBurst(window.innerWidth / 2, window.innerHeight / 2, 40);

            setTimeout(() => {
                gateway.classList.add('hidden');
                mainContent.classList.add('visible');
                initFireflies();
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
                
                if (entry.target.classList.contains('quote') && !isTypingStarted) {
                    isTypingStarted = true;
                    typeWriterEffect(typewriterQuote, () => {
                        quoteSource.classList.add('visible');
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-delayed, .box-panel').forEach(el => observer.observe(el));

    function typeWriterEffect(element, callback) {
        if(!element) return;
        const textToType = element.getAttribute('data-text');
        element.innerHTML = '';
        let i = 0;
        const speed = 40;
        
        function typeWriter() {
            if (i < textToType.length) {
                element.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                element.classList.add('typing-done');
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

        const bgMoveX = (mouseX - xCenter) / 50;
        const bgMoveY = (mouseY - yCenter) / 50;
        if(parallaxBg) parallaxBg.style.transform = `translate(${-bgMoveX}px, ${-bgMoveY}px) scale(1.05)`;

        tiltElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) return;

            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;
            
            const rotateY = ((mouseX - elCenterX) / (rect.width / 2)) * 4; 
            const rotateX = -((mouseY - elCenterY) / (rect.height / 2)) * 4;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            const shineX = ((mouseX - rect.left) / rect.width) * 100;
            const shineY = ((mouseY - rect.top) / rect.height) * 100;
            el.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.4) 100%)`;
        });
    });

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

            const dx = mouseX - f.x;
            const dy = mouseY - f.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 200) { 
                f.vx += (dx / dist) * 0.05;
                f.vy += (dy / dist) * 0.05;
            }

            const speed = Math.sqrt(f.vx*f.vx + f.vy*f.vy);
            if (speed > 2) {
                f.vx = (f.vx / speed) * 2;
                f.vy = (f.vy / speed) * 2;
            }

            f.x += f.vx; f.y += f.vy;

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

    if (btnAccept) {
        btnAccept.addEventListener('click', (e) => {
            createBurst(e.clientX, e.clientY, 20);
            if(rsvpContainer) rsvpContainer.style.display = 'none';
            if(responseMsg) {
                responseMsg.innerHTML = "Thank you! We look forward to your presence. ✨";
                responseMsg.style.color = "#8b0000";
            }
            if(rsvpResponse) rsvpResponse.classList.remove('hidden');
        });
    }

    if (btnDecline) {
        btnDecline.addEventListener('click', () => {
            if(rsvpContainer) rsvpContainer.style.display = 'none';
            if(responseMsg) {
                responseMsg.innerHTML = "We will miss you. Thank you for your prayers. 🙏";
                responseMsg.style.color = "#5c4e40";
            }
            if(rsvpResponse) rsvpResponse.classList.remove('hidden');
        });
    }

    const calBtn = document.getElementById('addToCalBtn');
    if(calBtn) {
        calBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const event = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260503T053000Z
DTEND:20260503T093000Z
SUMMARY:First Holy Communion - C. Cecil Antony Heartson
LOCATION:Vailankanni Arockia Annai Church, Coimbatore
DESCRIPTION:Reception Venue: Zone Connect, 39, Kalapatti Main Road
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
                
                setTimeout(() => {
                    sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0)`;
                    sparkle.style.opacity = '0';
                }, 10);

                setTimeout(() => sparkle.remove(), 800);
            }, i * 10);
        }
    }

    /* --- 6. 🤖 Interactive AI Event Assistant (English) --- */
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

    function processChat(userText) {
        addChatMessage(userText, 'user');
        aiInputText.value = '';
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const response = generateAIResponse(userText.toLowerCase());
            addChatMessage(response, 'bot');
        }, 1000 + Math.random() * 800);
    }

    function addChatMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.innerHTML = text;
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

    function generateAIResponse(input) {
        if (input.includes('when') || input.includes('time') || input.includes('date')) {
            return "The First Holy Communion will be held on <strong>Sunday, 3rd May 2026</strong>. <br>The event starts at <strong>11:00 AM</strong>.";
        }
        if (input.includes('church') || input.includes('where') || input.includes('venue') || input.includes('location')) {
            if (input.includes('reception') || input.includes('party')) {
                return "The reception venue is: <strong>Zone Connect</strong>.<br>Address: 39, Kalapatti Main Road, Coimbatore – 641048.<br><a href='https://maps.google.com/?q=Zone+Connect+39+Kalapatti+Main+Road+Coimbatore' target='_blank' style='color:#8b0000; font-weight:bold;'>View Map 📍</a>";
            }
            return "The holy event takes place at: <strong>Vailankanni Arockia Annai Church</strong>.<br>Rathinam Nagar, Cheran Ma Nagar, Coimbatore - 641048.";
        }
        if (input.includes('reception') || input.includes('food') || input.includes('party')) {
            return "The reception venue is: <strong>Zone Connect</strong>.<br>Address: 39, Kalapatti Main Road, Coimbatore – 641048.<br><a href='https://maps.google.com/?q=Zone+Connect+39+Kalapatti+Main+Road+Coimbatore' target='_blank' style='color:#8b0000; font-weight:bold;'>View Map 📍</a>";
        }
        if (input.includes('who') || input.includes('parents') || input.includes('boy') || input.includes('son')) {
            return "Our beloved son <strong>C. Cecil Antony Heartson</strong> is receiving his First Holy Communion! Parents are C. Valerian Gracias Cyril and R. Infant Mychiline Priya.";
        }
        if (input.includes('hello') || input.includes('hi')) {
            return "Hello! Feel free to ask me for any details regarding the event.";
        }
        if (input.includes('thank')) {
            return "Thank you very much! We look forward to seeing you at the event. ✨";
        }
        
        return "Sorry, I didn't quite catch that! You can ask me about the <strong>church location</strong>, <strong>event time</strong>, or <strong>reception details</strong>.";
    }
});
