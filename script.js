// ===== GLOBAL VARIABLES =====
let currentTheme = 'light';
let isMusicPlaying = false;
let canvasParticles = [];
let canvasCtx;
let canvasAnimationId;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeMusic();
    initializeCanvas();
    initializeEventListeners();
    initializeAnimations();
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(savedTheme);
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    if (theme === 'dark') {
        body.classList.add('dark');
        if (themeToggle) {
            themeToggle.classList.replace('fa-sun','fa-moon');
        }
    } else {
        body.classList.remove('dark');
        if (themeToggle) {
            themeToggle.classList.replace('fa-moon','fa-sun');
        }
    }

    updateCanvasTheme(theme);
}

// ===== MUSIC PLAYER =====
function initializeMusic() {
    const music = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');

    if (!music || !musicToggle) return;

    music.volume = 0.6;
    music.play().catch(() => {
        musicToggle.classList.replace("fa-volume-up", "fa-volume-mute");
    });

    musicToggle.addEventListener('click', function() {
        if (music.paused) {
            music.play().then(() => {
                music.muted = false;
                musicToggle.classList.replace("fa-volume-mute", "fa-volume-up");
                isMusicPlaying = true;
            }).catch(console.log);
        } else {
            music.muted = !music.muted;
            musicToggle.classList.toggle("fa-volume-up");
            musicToggle.classList.toggle("fa-volume-mute");
            isMusicPlaying = !music.muted;
        }
    });
}

// ===== CANVAS BACKGROUND ANIMATION =====
function initializeCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    canvasCtx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    }

    function createParticles() {
        canvasParticles = [];
        const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
        for (let i = 0; i < particleCount; i++) {
            canvasParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: currentTheme === 'dark' ? 
                    `rgba(180,200,255,${Math.random()*0.3})` :
                    `rgba(255,245,200,${Math.random()*0.6+0.3})` // light mode alpha boost
            });
        }
    }

    function animateParticles() {
        canvasCtx.clearRect(0,0,canvas.width,canvas.height);

        // Gradient background
        const gradient = canvasCtx.createLinearGradient(0,0,canvas.width,canvas.height);
        if(currentTheme==='dark'){
            gradient.addColorStop(0,'#1a2030');
            gradient.addColorStop(1,'#3b3f58');
        } else {
            gradient.addColorStop(0,'#a0d8f1'); // slightly stronger sky blue
            gradient.addColorStop(1,'#fbb1b1'); // slightly deeper peach-pink
        }
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(0,0,canvas.width,canvas.height);

        canvasParticles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if(p.x>canvas.width) p.x=0;
            if(p.x<0) p.x=canvas.width;
            if(p.y>canvas.height) p.y=0;
            if(p.y<0) p.y=canvas.height;

            canvasCtx.beginPath();
            canvasCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
            canvasCtx.fillStyle = p.color;
            canvasCtx.fill();

            canvasParticles.forEach(other=>{
                const dx = p.x-other.x;
                const dy = p.y-other.y;
                const dist = Math.sqrt(dx*dx+dy*dy);
                if(dist<100){
                    canvasCtx.beginPath();
                    canvasCtx.strokeStyle = currentTheme==='dark' ? 
                        `rgba(180,200,255,${0.2*(1-dist/100)})` :
                        `rgba(255,245,200,${0.3*(1-dist/100)+0.2})`; // light mode line more visible
                    canvasCtx.lineWidth=0.5;
                    canvasCtx.moveTo(p.x,p.y);
                    canvasCtx.lineTo(other.x,other.y);
                    canvasCtx.stroke();
                }
            });
        });

        canvasAnimationId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
}

function updateCanvasTheme(theme){
    if(!canvasParticles.length) return;
    canvasParticles.forEach(p=>{
        p.color = theme==='dark' ? 
            `rgba(180,200,255,${Math.random()*0.3})` :
            `rgba(255,245,200,${Math.random()*0.6+0.3})`;
    });
}

// ===== Remaining code (Events, Modals, Music, Form, Progress, Animations, etc.) =====
// ... সব আগের মতো থাকবে, change করার দরকার নেই, শুধু canvas/particles light mode fixed হয়েছে


// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    const starIcon = document.getElementById('starIcon');
    if (starIcon) starIcon.addEventListener('click', () => showModal('about.html', 'About Me'));

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const title = this.nextElementSibling?.textContent || 'Page';
            showModal(target, title);
        });
    });

    const frogContainer = document.getElementById('frog-container');
    const frog = document.getElementById('frog');
    if(frogContainer && frog){
        frogContainer.addEventListener('click', () => {
            if(!frog.classList.contains('dance')){
                frog.classList.add('dance');
                setTimeout(()=>frog.classList.remove('dance'),2000);
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if(contactForm) contactForm.addEventListener('submit', e=>{
        e.preventDefault();
        handleFormSubmission();
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if(filterButtons.length && projectCards.length){
        filterButtons.forEach(btn=>{
            btn.addEventListener('click', function(){
                const filter = this.getAttribute('data-filter');
                filterButtons.forEach(b=>b.classList.remove('active'));
                this.classList.add('active');
                projectCards.forEach(card=>{
                    const cat = card.getAttribute('data-category');
                    if(filter==='all' || cat===filter){
                        card.style.display='block';
                        setTimeout(()=>{card.style.opacity='1';card.style.transform='translateY(0)';},50);
                    } else {
                        card.style.opacity='0';
                        card.style.transform='translateY(20px)';
                        setTimeout(()=>card.style.display='none',300);
                    }
                });
            });
        });
    }

    initializeProgressBars();
}

// ===== MODAL =====
function showModal(url,title){
    const modal=new bootstrap.Modal(document.getElementById('pageModal'));
    const iframe=document.getElementById('modalIframe');
    const modalTitle=document.querySelector('.modal-title');
    if(modalTitle) modalTitle.textContent=title;

    iframe.onload=()=>{
        try{
            const iframeDoc=iframe.contentDocument||iframe.contentWindow.document;
            if(currentTheme==='dark') iframeDoc.body.classList.add('dark');
        } catch(e){console.log(e);}
    };

    iframe.src=url;
    modal.show();
}

// ===== EMAILJS =====
(function(){ emailjs.init("YOUR_PUBLIC_KEY"); })();
document.getElementById("contactForm")?.addEventListener("submit", function(e){ e.preventDefault(); handleFormSubmission(); });

function handleFormSubmission(){
    const name=document.getElementById('name')?.value;
    const email=document.getElementById('email')?.value;
    const subject=document.getElementById('subject')?.value;
    const message=document.getElementById('message')?.value;

    if(!name || !email || !message) return showNotification('Please fill in all required fields','error');
    if(!isValidEmail(email)) return showNotification('Enter valid email','error');

    const templateParams={from_name:name,from_email:email,subject:subject,message:message};

    emailjs.send("service_7izi0ai","template_l3tryyc",templateParams)
    .then(()=>{ showNotification('Message sent successfully!','success'); document.getElementById('contactForm')?.reset(); },
          ()=>{ showNotification('Failed to send message. Try again!','error'); });
}

function isValidEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function showNotification(msg,type){
    const notification=document.createElement('div');
    notification.className=`notification ${type}`;
    notification.innerHTML=`<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i><span>${msg}</span>`;
    document.body.appendChild(notification);
    setTimeout(()=>notification.style.transform='translateX(0)',100);
    setTimeout(()=>{ notification.style.transform='translateX(100%)'; setTimeout(()=>notification.remove(),300); },3000);
}

// ===== PROGRESS BARS =====
function initializeProgressBars(){
    const bars=document.querySelectorAll('.progress-bar');
    if(!bars.length) return;
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                animateProgressBar(entry.target,parseInt(entry.target.getAttribute('data-target')));
                observer.unobserve(entry.target);
            }
        });
    },{threshold:0.5});
    bars.forEach(bar=>observer.observe(bar));
}

function animateProgressBar(bar,target){
    let current=0,duration=2000,increment=target/(duration/16);
    const timer=setInterval(()=>{
        current+=increment;
        if(current>=target){ current=target; clearInterval(timer); }
        bar.style.width=current+'%';
        bar.textContent=Math.round(current)+'%';
    },16);
}

// ===== ANIMATIONS =====
function initializeAnimations(){
    const elements=document.querySelectorAll('.sami1234,.project-card,.link-item');
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
            }
        });
    },{threshold:0.1});
    elements.forEach(el=>{
        el.style.opacity='0';
        el.style.transform='translateY(30px)';
        el.style.transition='opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    const mainTitle=document.querySelector('.main-title');
    if(mainTitle) typewriterEffect(mainTitle);
}

function typewriterEffect(el){
    const text=el.textContent; el.textContent='';
    let i=0;
    const timer=setInterval(()=>{
        if(i<text.length){ el.textContent+=text.charAt(i); i++; } else clearInterval(timer);
    },100);
}

// ===== UTILITY =====
function debounce(func,wait){let timeout; return function(...args){ const later=()=>{ clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout=setTimeout(later,wait); }; }

// ===== PAGE TRANSITIONS =====
function navigateTo(url){ document.body.style.opacity='0'; setTimeout(()=>window.location.href=url,300); }
window.addEventListener('load',()=>{ document.body.style.transition='opacity 0.3s ease'; document.body.style.opacity='1'; });

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown',e=>{
    if(e.ctrlKey && e.key==='t'){ e.preventDefault(); toggleTheme(); }
    if(e.ctrlKey && e.key==='m'){ e.preventDefault(); document.getElementById('musicToggle')?.click(); }
    if(e.key==='Escape'){ bootstrap.Modal.getInstance(document.getElementById('pageModal'))?.hide(); }
});

// ===== TOUCH SUPPORT =====
let touchStartX=0,touchStartY=0;
document.addEventListener('touchstart',e=>{ touchStartX=e.touches[0].clientX; touchStartY=e.touches[0].clientY; });
document.addEventListener('touchend',e=>{
    const diffX=e.changedTouches[0].clientX-touchStartX;
    const diffY=e.changedTouches[0].clientY-touchStartY;
    if(Math.abs(diffX)>50 && Math.abs(diffY)<50 && diffX>0 && window.history.length>1) window.history.back();
});

// ===== PERFORMANCE =====
window.addEventListener('scroll',debounce(()=>{},100));
document.addEventListener('visibilitychange',()=>{
    const music=document.getElementById('backgroundMusic');
    if(document.hidden){ if(music && !music.paused) music.muted=true; } 
    else { if(music && isMusicPlaying) music.muted=false; }
});

// ===== ERROR HANDLING =====
window.addEventListener('error',e=>console.error('JS Error:',e.error));
window.addEventListener('unhandledrejection',e=>console.error('Unhandled Promise Rejection:',e.reason));

// ===== SERVICE WORKER =====
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').then(reg=>console.log('SW registered:',reg)).catch(err=>console.log('SW failed:',err)));

// ===== SYNC THEME ACROSS PAGES =====
function syncThemeAcrossPages(){
    const mainTheme=document.body.classList.contains('dark')?'dark':'light';
    document.querySelectorAll('iframe').forEach(iframe=>{
        try{ const iframeDoc=iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.body.classList.toggle('dark', mainTheme==='dark');
        }catch(e){}
    });
}
