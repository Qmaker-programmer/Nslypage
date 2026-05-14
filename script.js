/* ════════════════════════════════════════════════════════════════ */
/* NSLY VAULT — INTERACTIVE JAVASCRIPT                             */
/* ════════════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────────────
// SCROLL ANIMATIONS — Parallax & Reveal Effects
// ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const scrollSections = document.querySelectorAll('.scroll-section');
    const scrollProgress = document.querySelector('.scroll-progress');

    // Intersection Observer para animaciones al scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const textElements = section.querySelectorAll('.scroll-text, .scroll-image');
                
                textElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    scrollSections.forEach(section => observer.observe(section));

    // ──────────────────────────────────────────────────────────────
    // SCROLL PROGRESS BAR
    // ──────────────────────────────────────────────────────────────

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // Cambiar color del progress bar según la posición
        if (scrollPercent < 33) {
            scrollProgress.style.background = 'linear-gradient(90deg, #00FFAA 0%, #00CFFF 100%)';
        } else if (scrollPercent < 66) {
            scrollProgress.style.background = 'linear-gradient(90deg, #00CFFF 0%, #FF00AA 100%)';
        } else {
            scrollProgress.style.background = 'linear-gradient(90deg, #FF00AA 0%, #FFD700 100%)';
        }
    });

    // ──────────────────────────────────────────────────────────────
    // PARALLAX EFFECT EN HERO
    // ──────────────────────────────────────────────────────────────

    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.5}px) scale(${1 + scrollY / 10000})`;
        }
    });

    // ──────────────────────────────────────────────────────────────
    // BOTONES INTERACTIVOS CON RIPPLE EFFECT
    // ──────────────────────────────────────────────────────────────

    const buttons = document.querySelectorAll('.btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Agregar estilos al ripple dinámicamente
            if (!document.querySelector('style[data-ripple]')) {
                const style = document.createElement('style');
                style.setAttribute('data-ripple', 'true');
                style.textContent = `
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple-animation 0.6s ease-out;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // FEATURE BOXES INTERACTIVOS
    // ──────────────────────────────────────────────────────────────

    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach((box, index) => {
        box.addEventListener('mouseenter', () => {
            box.style.setProperty('--rotation', (index % 2 === 0 ? 5 : -5) + 'deg');
            box.style.transform = `rotateZ(var(--rotation)) scale(1.15)`;
        });

        box.addEventListener('mouseleave', () => {
            box.style.transform = 'rotateZ(0deg) scale(1)';
        });
    });

    // ──────────────────────────────────────────────────────────────
    // SECURITY LAYERS ANIMATED
    // ──────────────────────────────────────────────────────────────

    const securityLayers = document.querySelectorAll('.security-layer');
    securityLayers.forEach((layer, index) => {
        layer.addEventListener('mouseenter', () => {
            securityLayers.forEach((l, i) => {
                if (i !== index) {
                    l.style.opacity = '0.5';
                }
            });
            layer.style.opacity = '1';
        });

        layer.addEventListener('mouseleave', () => {
            securityLayers.forEach(l => {
                l.style.opacity = '1';
            });
        });
    });

    // ──────────────────────────────────────────────────────────────
    // KEYBOARD SHORTCUTS HOVER
    // ──────────────────────────────────────────────────────────────

    const shortcuts = document.querySelectorAll('.shortcut');
    shortcuts.forEach(shortcut => {
        const kbd = shortcut.querySelector('kbd');
        const span = shortcut.querySelector('span');

        shortcut.addEventListener('mouseenter', () => {
            kbd.style.animation = 'pulse-kbd 0.6s ease';
            span.style.color = '#00FFAA';
        });

        shortcut.addEventListener('mouseleave', () => {
            span.style.color = '';
        });
    });

    // Agregar animación de pulse
    if (!document.querySelector('style[data-kbd]')) {
        const style = document.createElement('style');
        style.setAttribute('data-kbd', 'true');
        style.textContent = `
            @keyframes pulse-kbd {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    // ──────────────────────────────────────────────────────────────
    // FOOTER LINKS GLOW
    // ──────────────────────────────────────────────────────────────

    const footerLinks = document.querySelectorAll('.footer-section a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.textShadow = '0 0 10px rgba(0, 255, 170, 0.8)';
            link.style.color = '#00FFAA';
        });

        link.addEventListener('mouseleave', () => {
            link.style.textShadow = 'none';
            link.style.color = '#00CFFF';
        });
    });

    // ──────────────────────────────────────────────────────────────
    // COUNTUP ANIMATION PARA NÚMEROS
    // ──────────────────────────────────────────────────────────────

    const countUpElements = document.querySelectorAll('[data-count]');
    countUpElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;

        element.addEventListener('mouseenter', () => {
            if (current === 0) {
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target;
                        clearInterval(counter);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 30);
            }
        });
    });

    // ──────────────────────────────────────────────────────────────
    // SMOOTH SCROLL ENHANCEMENT
    // ──────────────────────────────────────────────────────────────

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ──────────────────────────────────────────────────────────────
    // HEADER STICKY CON CAMBIO DE ESTILO
    // ──────────────────────────────────────────────────────────────

    const header = document.querySelector('.header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.boxShadow = '0 8px 32px rgba(138, 43, 226, 0.5)';
            header.style.background = 'rgba(10, 14, 39, 0.98)';
        } else {
            header.style.boxShadow = '0 8px 32px rgba(138, 43, 226, 0.3)';
            header.style.background = 'rgba(10, 14, 39, 0.95)';
        }

        lastScrollY = currentScrollY;
    });

    // ──────────────────────────────────────────────────────────────
    // TEXT REVEAL EFFECT AL PASAR EL MOUSE
    // ──────────────────────────────────────────────────────────────

    const revealTexts = document.querySelectorAll('.scroll-text h2');
    revealTexts.forEach(text => {
        const originalText = text.textContent;
        
        text.addEventListener('mouseenter', function() {
            this.style.animation = 'text-reveal 0.6s ease';
        });
    });

    // Agregar animación de reveal
    if (!document.querySelector('style[data-reveal]')) {
        const style = document.createElement('style');
        style.setAttribute('data-reveal', 'true');
        style.textContent = `
            @keyframes text-reveal {
                0% {
                    background-size: 0% 100%;
                }
                100% {
                    background-size: 100% 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ──────────────────────────────────────────────────────────────
    // MOUSE FOLLOWER SUBTLE
    // ──────────────────────────────────────────────────────────────

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            
            heroSection.style.setProperty('--mouse-x', x);
            heroSection.style.setProperty('--mouse-y', y);
        });
    }

    // ──────────────────────────────────────────────────────────────
    // LOG EN CONSOLA (Easter Egg)
    // ──────────────────────────────────────────────────────────────

    console.clear();
    console.log('%c🛡️ NSLY VAULT', 'font-size: 24px; color: #00FFAA; font-weight: bold;');
    console.log('%cPassword Manager TUI • GPL v2 • Open Source', 'font-size: 14px; color: #AAAAAA;');
    console.log('%c👨‍💻 Creado por Andresuno (Qmaker)', 'font-size: 12px; color: #00CFFF;');
    console.log('%c☕ Con MUCHÍSIMO TÈ', 'font-size: 14px; color: #FFD700;');
    console.log('%c\n📚 GitHub: https://github.com/Qmaker-programmer/Nsly', 'color: #00FF88;');
    console.log('%c⬇️ Descargas: https://github.com/Qmaker-programmer/Nsly/releases\n', 'color: #FF00AA;');

});

// ──────────────────────────────────────────────────────────────────
// DARK MODE PREFERENCE DETECTION
// ──────────────────────────────────────────────────────────────────

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.style.colorScheme = 'dark';
}

// ──────────────────────────────────────────────────────────────────
// PERFORMANCE: Lazy Loading para secciones
// ──────────────────────────────────────────────────────────────────

if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    });

    lazyElements.forEach(el => lazyObserver.observe(el));
}
