/* ════════════════════════════════════════════════════════════════ */
/* NSLY VAULT — scripts.js v2                                      */
/* ════════════════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────────────────
// 1. PARTICLES BACKGROUND
// ──────────────────────────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = Math.min(90, Math.floor(window.innerWidth * window.innerHeight / 12000));
    const particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 1.4 + 0.3,
        a:  Math.random() * 0.45 + 0.08
    }));

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Connections
        for (let i = 0; i < particles.length - 1; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(138,43,226,${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Dots
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0)  p.x = W;
            if (p.x > W)  p.x = 0;
            if (p.y < 0)  p.y = H;
            if (p.y > H)  p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(138,43,226,${p.a})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
})();

// ──────────────────────────────────────────────────────────────────
// 2. HERO TERMINAL — TYPEWRITER
// ──────────────────────────────────────────────────────────────────
(function initTerminal() {
    const twEl  = document.getElementById('typewriter');
    const outEl = document.getElementById('terminal-output');
    const curEl = document.getElementById('cursor');
    if (!twEl || !outEl) return;

    // Secuencias que se van rotando
    const sequences = [
        {
            cmd: 'go run src/main.go',
            lines: [
                { text: '',                                        cls: '',         delay: 200  },
                { text: '🛡️  NSLY VAULT v1.0 — ÁREA RESTRINGIDA', cls: 't-green',  delay: 300  },
                { text: '',                                        cls: '',         delay: 150  },
                { text: 'Contraseña maestra: ••••••••',           cls: 't-purple', delay: 700  },
                { text: '✓ Bóveda desbloqueada.',                 cls: 't-green',  delay: 500  },
                { text: '  Bienvenido, andresuno 👋',             cls: 't-accent', delay: 300  },
            ]
        },
        {
            cmd: 'make build-all',
            lines: [
                { text: '',                                        cls: '',        delay: 200  },
                { text: '🚀 Iniciando compilación...',            cls: 't-green', delay: 250  },
                { text: '🐧 nsly-linux-amd64     ✓',             cls: 't-green', delay: 320  },
                { text: '🐧 nsly-linux-arm64     ✓',             cls: 't-green', delay: 320  },
                { text: '🪟 nsly-windows-amd64   ✓',             cls: 't-green', delay: 320  },
                { text: '🍏 nsly-darwin-arm64    ✓',             cls: 't-green', delay: 320  },
                { text: '✨ 6 binarios listos!',                  cls: 't-accent',delay: 400  },
            ]
        },
        {
            cmd: 'make run',
            lines: [
                { text: '',                                        cls: '',         delay: 200 },
                { text: '🔍 Búsqueda: github',                   cls: 't-purple', delay: 400 },
                { text: '',                                        cls: '',         delay: 100 },
                { text: '  1  github.com     andresuno',          cls: 't-green',  delay: 280 },
                { text: '  2  github.com     qmaker-work',        cls: 't-muted',  delay: 280 },
                { text: '',                                        cls: '',         delay: 200 },
                { text: 'C → copiado al clipboard 📋',           cls: 't-accent', delay: 500 },
            ]
        }
    ];

    let seqIdx = 0;

    function typeText(text, cb) {
        let i = 0;
        twEl.textContent = '';
        if (curEl) curEl.style.display = 'inline';

        const iv = setInterval(() => {
            if (i < text.length) {
                twEl.textContent += text[i++];
            } else {
                clearInterval(iv);
                if (cb) cb();
            }
        }, 55);
    }

    function showLines(lines, idx) {
        if (idx >= lines.length) {
            // Pausa larga, luego siguiente secuencia
            setTimeout(() => {
                outEl.innerHTML = '';
                twEl.textContent = '';
                seqIdx = (seqIdx + 1) % sequences.length;
                runSequence();
            }, 3200);
            return;
        }

        const line = lines[idx];
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = `t-line ${line.cls}`;
            div.textContent = line.text || '\u00a0';
            outEl.appendChild(div);
            // Auto-scroll dentro del terminal
            outEl.scrollTop = outEl.scrollHeight;
            showLines(lines, idx + 1);
        }, line.delay);
    }

    function runSequence() {
        const seq = sequences[seqIdx];
        // Pequeño lag antes de "escribir"
        setTimeout(() => {
            typeText(seq.cmd, () => {
                showLines(seq.lines, 0);
            });
        }, 800);
    }

    runSequence();
})();

// ──────────────────────────────────────────────────────────────────
// 3. SCROLL REVEAL — INTERSECTION OBSERVER
// ──────────────────────────────────────────────────────────────────
(function initScrollReveal() {
    const els = document.querySelectorAll('.scroll-text, .scroll-image');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback para browsers viejos: mostrar todo
        els.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // No hacer unobserve: queda visible para siempre
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    els.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────────────────────────────
// 4. SCROLL PROGRESS BAR
// ──────────────────────────────────────────────────────────────────
(function initProgressBar() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
        const scrolled = window.scrollY;
        const total    = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();

// ──────────────────────────────────────────────────────────────────
// 5. HEADER — SCROLL EFFECT
// ──────────────────────────────────────────────────────────────────
(function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
})();

// ──────────────────────────────────────────────────────────────────
// 6. RIPPLE EN BOTONES
// ──────────────────────────────────────────────────────────────────
(function initRipple() {
    // Inyectar keyframe una sola vez
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-anim {
            to { transform: scale(4.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.btn, .cta-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);
            const span   = document.createElement('span');

            span.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size / 2}px;
                top:${e.clientY - rect.top  - size / 2}px;
                border-radius:50%;
                background:rgba(255,255,255,0.2);
                transform:scale(0);
                animation:ripple-anim 0.55s ease-out forwards;
                pointer-events:none;
                z-index:20;
            `;

            // Asegurar que el botón tenga position relative
            const pos = getComputedStyle(this).position;
            if (pos === 'static') this.style.position = 'relative';
            this.style.overflow = 'hidden';

            this.appendChild(span);
            setTimeout(() => span.remove(), 600);
        });
    });
})();

// ──────────────────────────────────────────────────────────────────
// 7. SECURITY LAYERS — HOVER DIMMING
// ──────────────────────────────────────────────────────────────────
(function initSecurityHover() {
    const layers = document.querySelectorAll('.security-layer');
    if (!layers.length) return;

    layers.forEach((layer, i) => {
        layer.addEventListener('mouseenter', () => {
            layers.forEach((l, j) => {
                l.style.opacity = j === i ? '1' : '0.35';
            });
        });
        layer.addEventListener('mouseleave', () => {
            layers.forEach(l => { l.style.opacity = '1'; });
        });
    });
})();

// ──────────────────────────────────────────────────────────────────
// 8. PLATFORM CARDS — WIGGLE ON HOVER
// ──────────────────────────────────────────────────────────────────
(function initPlatformCards() {
    document.querySelectorAll('.platform-card').forEach((card, i) => {
        const dir = i % 2 === 0 ? 3 : -3;
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translateY(-4px) rotate(${dir}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

// ──────────────────────────────────────────────────────────────────
// 9. METHOD BADGES — TOGGLE ACTIVE
// ──────────────────────────────────────────────────────────────────
(function initMethodBadges() {
    const badges = document.querySelectorAll('.method-badge');
    if (!badges.length) return;

    badges.forEach(badge => {
        badge.addEventListener('click', () => {
            badges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
        });
    });
})();

// ──────────────────────────────────────────────────────────────────
// 10. COMPARISON TABLE — HIGHLIGHT ROW ON HOVER
// ──────────────────────────────────────────────────────────────────
(function initTableHover() {
    document.querySelectorAll('.comparison-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(138,43,226,0.1)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = '';
        });
    });
})();

// ──────────────────────────────────────────────────────────────────
// 11. ROADMAP ITEMS — STAGGER ANIMATION ON REVEAL
// ──────────────────────────────────────────────────────────────────
(function initRoadmapStagger() {
    const card = document.querySelector('.roadmap-card');
    if (!card || !('IntersectionObserver' in window)) return;

    const items = card.querySelectorAll('.roadmap-item, .dep-item');
    items.forEach(item => {
        item.style.opacity   = '0';
        item.style.transform = 'translateX(10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.style.opacity   = '1';
                    item.style.transform = 'none';
                }, i * 60);
            });
            obs.disconnect();
        }
    }, { threshold: 0.3 });

    obs.observe(card);
})();

// ──────────────────────────────────────────────────────────────────
// 12. VAULT FILES — TYPING EFFECT ON REVEAL
// ──────────────────────────────────────────────────────────────────
(function initVaultFiles() {
    const files = document.querySelectorAll('.vault-file');
    if (!files.length || !('IntersectionObserver' in window)) return;

    files.forEach(f => {
        f.style.opacity   = '0';
        f.style.transform = 'translateX(-8px)';
        f.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });

    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            files.forEach((f, i) => {
                setTimeout(() => {
                    f.style.opacity   = '1';
                    f.style.transform = 'none';
                }, 120 + i * 100);
            });
            obs.disconnect();
        }
    }, { threshold: 0.4 });

    obs.observe(files[0].closest('.scroll-text') || files[0]);
})();

// ──────────────────────────────────────────────────────────────────
// 13. SMOOTH ANCHOR SCROLL (por si se añaden links internos)
// ──────────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ──────────────────────────────────────────────────────────────────
// 14. EASTER EGG EN CONSOLA 🥚
// ──────────────────────────────────────────────────────────────────
(function easterEgg() {
    const s = (txt, css) => console.log(`%c${txt}`, css);

    console.clear();
    s('🛡️  NSLY VAULT', 'font-size:30px; color:#00FFAA; font-weight:bold; font-family:monospace;');
    s('Password Manager TUI • GPL v2 • Open Source', 'font-size:12px; color:#7a7a99; font-family:monospace;');
    s('─────────────────────────────────────────────', 'color:#222; font-family:monospace;');
    s('👨‍💻  Creado por Andresuno (Qmaker)', 'font-size:13px; color:#00CFFF; font-family:monospace;');
    s('☕  Con MUCHÍSIMO TÈ', 'font-size:13px; color:#FFD700; font-family:monospace;');
    s('─────────────────────────────────────────────', 'color:#222; font-family:monospace;');
    s('📦  App:     https://github.com/Qmaker-programmer/Nsly', 'color:#00FF88; font-family:monospace; font-size:12px;');
    s('🌐  Landing: https://github.com/Qmaker-programmer/Nslypage', 'color:#00FF88; font-family:monospace; font-size:12px;');
    s('⬇️   Builds:  https://github.com/Qmaker-programmer/Nsly/releases', 'color:#FF00AA; font-family:monospace; font-size:12px;');
    s('─────────────────────────────────────────────', 'color:#222; font-family:monospace;');
    s('🔐  bcrypt cost=14 + AES-256-GCM + scrypt N=32768', 'font-size:11px; color:#8A2BE2; font-family:monospace;');

    // Konami code por las dudas 🎮
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    document.addEventListener('keydown', e => {
        if (e.key === konami[pos]) {
            pos++;
            if (pos === konami.length) {
                pos = 0;
                document.body.style.animation = 'none';
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position:fixed; inset:0; z-index:99999;
                    background:rgba(138,43,226,0.3);
                    display:flex; align-items:center; justify-content:center;
                    font-family:'JetBrains Mono',monospace;
                    font-size:2rem; color:#00FFAA;
                    animation: fade-out-konami 1.5s ease forwards;
                    pointer-events:none;
                `;
                flash.textContent = '🛡️  NSLY MODE ACTIVATED  🛡️';

                const ks = document.createElement('style');
                ks.textContent = `@keyframes fade-out-konami { 0%{opacity:1} 80%{opacity:1} 100%{opacity:0} }`;
                document.head.appendChild(ks);
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 1600);

                console.log('%c🎮 KONAMI CODE! ¡Sabía que eras curioso 👀', 'font-size:16px; color:#FFD700; font-family:monospace;');
            }
        } else {
            pos = 0;
        }
    });
})();
