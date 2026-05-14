/* ════════════════════════════════════════════════════════════════ */
/* NSLY VAULT — INTERACTIVE JAVASCRIPT v2                          */
/* ════════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────────────
// PARTICLES BACKGROUND
// ──────────────────────────────────────────────────────────────────

(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = Math.min(80, Math.floor(W * H / 15000));
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(138, 43, 226, ${p.alpha})`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(138, 43, 226, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
})();

// ──────────────────────────────────────────────────────────────────
// TYPEWRITER EFFECT EN TERMINAL DEL HERO
// ──────────────────────────────────────────────────────────────────

(function initTypewriter() {
    const typeEl = document.getElementById('typewriter');
    const outputEl = document.getElementById('terminal-output');
    if (!typeEl || !outputEl) return;

    const commands = [
        {
            cmd: 'go run src/main.go',
            delay: 1000,
            output: [
                { text: '🛡️  NSLY VAULT — ÁREA RESTRINGIDA', cls: 't-green', delay: 300 },
                { text: '', cls: '', delay: 400 },
                { text: 'Contraseña maestra: ••••••••', cls: 't-purple', delay: 500 },
                { text: '✓ Bóveda desbloqueada. Bienvenido.', cls: 't-accent', delay: 700 },
            ]
        }
    ];

    let cmdIndex = 0;

    function typeCommand(cmd, callback) {
        let i = 0;
        typeEl.textContent = '';
        const interval = setInterval(() => {
            if (i < cmd.length) {
                typeEl.textContent += cmd[i++];
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 60);
    }

    function showOutput(lines, idx = 0) {
        if (idx >= lines.length) {
            // Reset after a pause
            setTimeout(() => {
                outputEl.innerHTML = '';
                typeEl.textContent = '';
                showCommand();
            }, 4000);
            return;
        }

        const line = lines[idx];
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = `t-line ${line.cls}`;
            div.textContent = line.text || '\u00a0';
            outputEl.appendChild(div);
            showOutput(lines, idx + 1);
        }, line.delay);
    }

    function showCommand() {
        const cmd = commands[cmdIndex % commands.length];
        setTimeout(() => {
            typeCommand(cmd.cmd, () => {
                showOutput(cmd.output);
            });
        }, cmd.delay);
        cmdIndex++;
    }

    showCommand();
})();

// ──────────────────────────────────────────────────────────────────
// SCROLL ANIMATIONS — INTERSECTION OBSERVER (FIXED)
// ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    const scrollElements = document.querySelectorAll('.scroll-text, .scroll-image');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Don't unobserve so it stays visible
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        scrollElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        scrollElements.forEach(el => el.classList.add('visible'));
    }

    // ──────────────────────────────────────────────────────────────
    // SCROLL PROGRESS BAR
    // ──────────────────────────────────────────────────────────────

    const progressBar = document.getElementById('scroll-progress');

    const updateProgress = () => {
        if (!progressBar) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });

    // ──────────────────────────────────────────────────────────────
    // HEADER SCROLL EFFECT
    // ──────────────────────────────────────────────────────────────

    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // ──────────────────────────────────────────────────────────────
    // RIPPLE EFFECT EN BOTONES
    // ──────────────────────────────────────────────────────────────

    document.querySelectorAll('.btn, .cta-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                border-radius:50%;
                background:rgba(255,255,255,0.25);
                transform:scale(0);
                animation:ripple-anim 0.6s ease-out forwards;
                pointer-events:none;
                z-index:10;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }`;
    document.head.appendChild(rippleStyle);

    // ──────────────────────────────────────────────────────────────
    // FEATURE BOXES INTERACTION
    // ──────────────────────────────────────────────────────────────

    document.querySelectorAll('.feature-box').forEach((box, i) => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = `translateY(-4px) rotate(${i % 2 === 0 ? 3 : -3}deg)`;
        });
        box.addEventListener('mouseleave', () => {
            box.style.transform = '';
        });
    });

    // ──────────────────────────────────────────────────────────────
    // SECURITY LAYERS INTERACTION
    // ──────────────────────────────────────────────────────────────

    const secLayers = document.querySelectorAll('.security-layer');
    secLayers.forEach((layer, i) => {
        layer.addEventListener('mouseenter', () => {
            secLayers.forEach((l, j) => { l.style.opacity = j === i ? '1' : '0.4'; });
        });
        layer.addEventListener('mouseleave', () => {
            secLayers.forEach(l => { l.style.opacity = '1'; });
        });
    });

    // ──────────────────────────────────────────────────────────────
    // KEYBOARD SHORTCUTS INTERACTION
    // ──────────────────────────────────────────────────────────────

    document.querySelectorAll('.shortcut').forEach(shortcut => {
        const kbd = shortcut.querySelector('kbd');
        const span = shortcut.querySelector('span');

        shortcut.addEventListener('mouseenter', () => {
            if (kbd) kbd.style.transform = 'translateY(-2px)';
            if (span) span.style.color = '#00FFAA';
        });
        shortcut.addEventListener('mouseleave', () => {
            if (kbd) kbd.style.transform = '';
            if (span) span.style.color = '';
        });
    });

    // ──────────────────────────────────────────────────────────────
    // EASTER EGG EN CONSOLA
    // ──────────────────────────────────────────────────────────────

    console.clear();
    console.log('%c🛡️ NSLY VAULT', 'font-size:28px; color:#00FFAA; font-weight:bold; font-family:monospace;');
    console.log('%cPassword Manager TUI • GPL v2 • Open Source', 'font-size:13px; color:#888;');
    console.log('%c─────────────────────────────────', 'color:#333');
    console.log('%c👨‍💻 Creado por Andresuno (Qmaker)', 'font-size:12px; color:#00CFFF;');
    console.log('%c☕ Con MUCHÍSIMO TÈ', 'font-size:13px; color:#FFD700;');
    console.log('%c📦 https://github.com/Qmaker-programmer/Nsly', 'color:#00FF88;');
    console.log('%c⬇️  https://github.com/Qmaker-programmer/Nsly/releases', 'color:#FF00AA;');

});
