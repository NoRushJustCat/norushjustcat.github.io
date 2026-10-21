/* ==========================================================================
   script.js — Portfolio « NoRushJustChat »
   Toutes les interactions du site sont regroupées ici.
   Aucun framework externe n’est nécessaire.
   Langue du code : français.
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // 1. DONNÉES DES PROJETS
  // Modifier ce tableau pour ajouter/supprimer un projet facilement.
  // ------------------------------------------------------------------
  const PROJECTS = [
    {
      id: 'roblox-1',
      category: 'roblox',
      title: 'Simulateur de Vol & Instruments',
      description: 'Cockpit virtuel fonctionnel avec HUD temps réel, lecture des instruments de vol et physique de sustentation.',
      tags: ['Luau', 'POO', 'Physique', 'HUD'],
      image: 'assets/images/project-roblox-1.svg',
      link: '#',
      linkText: 'Ouvrir le projet',
      badge: 'ROBLOX STUDIO'
    },
    {
      id: 'roblox-2',
      category: 'roblox',
      title: 'Trafic & Balisage Aéroportuaire',
      description: 'Gestion du roulage au sol, guidage des avions vers les portes et éclairage dynamique de piste.',
      tags: ['Luau', 'Pathfinding', 'Éclairage', 'UI'],
      image: 'assets/images/project-roblox-2.svg',
      link: '#',
      linkText: 'Ouvrir le projet',
      badge: 'ROBLOX STUDIO'
    },
    {
      id: 'roblox-3',
      category: 'roblox',
      title: 'Système d’IA & Quêtes Modulaires',
      description: 'Machines à états pour PNJ, architecture modulaire et synchronisation client-serveur.',
      tags: ['Luau', 'IA', 'State Machine', 'Datastore'],
      image: 'assets/images/project-roblox-3.svg',
      link: '#',
      linkText: 'Ouvrir le projet',
      badge: 'ROBLOX STUDIO'
    },
    {
      id: 'aviation-1',
      category: 'aviation',
      title: 'Enquêteur d’Accident Aérien',
      description: 'Outil web d’analyse de données de vol : télémétrie, chronologie des événements et visualisation de trajectoire.',
      tags: ['HTML5', 'Canvas', 'JavaScript', 'Cartographie'],
      image: 'assets/images/project-aviation-web.svg',
      link: '#',
      linkText: 'Voir l’outil',
      badge: 'AVIATION • WEB'
    }
  ];

  // ------------------------------------------------------------------
  // 2. ÉCRAN DE CHARGEMENT (LOADER)
  // ------------------------------------------------------------------
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderPct = document.getElementById('loader-pct');

  let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startLoader() {
    let current = 0;
    const target = 100;
    const duration = 900;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // courbe douce d’accélération/décélération
      const ease = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(ease * target);

      if (loaderFill) loaderFill.style.width = current + '%';
      if (loaderPct) loaderPct.textContent = current + '%';

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        finishLoader();
      }
    }

    requestAnimationFrame(animate);
  }

  function finishLoader() {
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.remove();
      }, 700);
    }
    initHero();
  }

  // ------------------------------------------------------------------
  // 3. ARRIÈRE-PLAN CANVAS (étoiles + balises radar discrètes)
  // ------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  let ctx;
  let stars = [];
  let radarPulse = 0;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 120);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        delta: (Math.random() - 0.5) * 0.002
      });
    }
  }

  function drawCanvas(now) {
    if (!canvas || !ctx || reducedMotion) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Étoiles scintillantes
    stars.forEach(star => {
      star.alpha += star.delta;
      if (star.alpha <= 0.15 || star.alpha >= 0.9) star.delta *= -1;

      ctx.fillStyle = 'rgba(69, 214, 232, ' + star.alpha + ')';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Balise radar centrale très discrète
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.18;
    const alpha = 0.06 + Math.sin(radarPulse) * 0.04;

    ctx.strokeStyle = 'rgba(69, 214, 232, ' + alpha + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    radarPulse += 0.0015;

    if (!document.hidden) {
      requestAnimationFrame(drawCanvas);
    }
  }

  function pauseCanvas() {
    // nothing needed; drawCanvas checks document.hidden itself
  }

  function resumeCanvas() {
    if (!document.hidden && !reducedMotion) {
      requestAnimationFrame(drawCanvas);
    }
  }

  // ------------------------------------------------------------------
  // 4. CURSEUR PERSONNALISÉ (pointeurs fins uniquement)
  // ------------------------------------------------------------------
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;

  function initCursor() {
    if (!cursor || !cursorDot || !cursorRing) return;
    if (isPointerFine && !reducedMotion) {
      cursor.style.display = 'block';
      document.addEventListener('mousemove', onMouseMove);
      setupCursorHover();
      animateCursor();
    }
  }

  function onMouseMove(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
  }

  function animateCursor() {
    // interpolation douce (lerp)
    dotX += (cursorX - dotX) * 0.18;
    dotY += (cursorY - dotY) * 0.18;

    cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    cursorRing.style.transform = `translate(${dotX - 16}px, ${dotY - 16}px)`;

    requestAnimationFrame(animateCursor);
  }

  function setupCursorHover() {
    const hoverables = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorRing.classList.remove('hovered');
      });
    });
  }

  // ------------------------------------------------------------------
  // 5. SUIVI DE VOL (avion qui descend avec le scroll)
  // ------------------------------------------------------------------
  const flightFill = document.getElementById('flight-fill');
  const flightPlane = document.getElementById('flight-plane');

  function initFlightTracker() {
    if (!flightFill || !flightPlane || reducedMotion) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFlight);
        ticking = true;
      }
    });
  }

  function updateFlight() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    const bounded = Math.min(Math.max(pct, 0), 100);

    flightFill.style.height = bounded + '%';
    flightPlane.style.top = bounded + '%';

    // inclinaison légère selon la direction du scroll
    if (window.lastScrollY !== undefined) {
      const delta = window.scrollY - window.lastScrollY;
      const rotate = Math.min(Math.max(delta * 0.5, -10), 10);
      flightPlane.style.transform = `translateX(-50%) rotate(${rotate}deg)`;
    }
    window.lastScrollY = window.scrollY;

    ticking = false;
  }

  // ------------------------------------------------------------------
  // 6. APPARITION AU SCROLL (IntersectionObserver)
  // ------------------------------------------------------------------
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      observer.observe(el);
    });
  }

  // ------------------------------------------------------------------
  // 7. COMPTEURS ANIMÉS (télémétrie hero)
  // ------------------------------------------------------------------
  function animateCounters() {
    const counters = document.querySelectorAll('.telemetry-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1200;
        const start = performance.now();

        function count(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(ease * target);
          el.textContent = value + suffix;

          if (progress < 1) {
            requestAnimationFrame(count);
          }
        }

        requestAnimationFrame(count);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
  }

  // ------------------------------------------------------------------
  // 8. BARRES DE COMPÉTENCES (remplissage au scroll)
  // ------------------------------------------------------------------
  function initSkillBars() {
    const bars = document.querySelectorAll('.meter-bar[data-score]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const score = bar.getAttribute('data-score');
        bar.style.width = score + '%';
        observer.unobserve(bar);
      });
    }, { threshold: 0.3 });

    bars.forEach(b => observer.observe(b));
  }

  // ------------------------------------------------------------------
  // 9. EFFET TILT 3D SUR LES CARTES PROJETS
  // ------------------------------------------------------------------
  function initTiltCards() {
    if (reducedMotion || !isPointerFine) return;

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', handleTiltMove);
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });

    let ticking = false;
    function handleTiltMove(e) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
          ticking = false;
        });
        ticking = true;
      }
    }
  }

  // ------------------------------------------------------------------
  // 10. NAVIGATION STICKY + SECTION ACTIVE + SMOOTH SCROLL
  // ------------------------------------------------------------------
  function initNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    let lastScroll = 0;

    // Masque/affiche l’en-tête au scroll
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 60) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScroll = currentScroll;
    });

    // Surligne la section active
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.25 });

    sections.forEach(section => observer.observe(section));

    // Menu mobile toggle
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (navToggle && primaryNav) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !expanded);
        primaryNav.classList.toggle('nav-open');
      });

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.setAttribute('aria-expanded', 'false');
          primaryNav.classList.remove('nav-open');
        });
      });
    }

    // Smooth scroll natif pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // 11. BOUTON COPIER E-MAIL + FORMULAIRE
  // ------------------------------------------------------------------
  function initContact() {
    const copyBtn = document.getElementById('copy-email-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    const emailText = document.getElementById('target-email');

    if (copyBtn && emailText) {
      copyBtn.addEventListener('click', () => {
        const text = emailText.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          const original = copyBtnText.textContent;
          copyBtnText.textContent = 'Copié !';
          setTimeout(() => {
            copyBtnText.textContent = original;
          }, 1500);
        });
      });
    }

    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!feedback) return;

        feedback.textContent = 'Transmission en cours…';
        feedback.style.color = 'var(--accent-cyan)';

        // Simule l’envoi (remplacer par l’action réelle Formspree plus tard)
        setTimeout(() => {
          feedback.textContent = 'Message envoyé avec succès.';
          feedback.style.color = 'var(--accent-green)';
          form.reset();
        }, 1200);
      });
    }
  }

  // ------------------------------------------------------------------
  // 12. GRILLE DES PROJETS (injection DOM + filtre)
  // ------------------------------------------------------------------
  function initProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    function renderProjects(filter) {
      container.innerHTML = '';

      const filtered = filter === 'all'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === filter);

      filtered.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-reveal', '');

        card.innerHTML = `
          <div class="project-media" aria-hidden="true">
            <img src="${project.image}" alt="${project.title}" loading="lazy" width="800" height="450">
            <span class="project-badge">${project.badge}</span>
          </div>
          <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
              ${project.tags.map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join('')}
            </div>
            <div class="project-footer">
              <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">
                ${project.linkText} <span>→</span>
              </a>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    }

    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        renderProjects(tab.getAttribute('data-filter'));
      });
    });

    renderProjects('all');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ------------------------------------------------------------------
  // 13. INITIALISATION DU HERO (après le loader)
  // ------------------------------------------------------------------
  function initHero() {
    // Toutes les animations d’entrée sont gérées par CSS + IntersectionObserver
    // On déclenche simplement le reste de l’application
    initApp();
  }

  function initApp() {
    initCursor();
    initFlightTracker();
    initReveal();
    animateCounters();
    initSkillBars();
    initTiltCards();
    initNavigation();
    initContact();
    initProjects();

    // Reprend le canvas si l’onglet revient au premier plan
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      resumeCanvas();
    });
  }

  // ------------------------------------------------------------------
  // 14. DÉMARRAGE
  // ------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    initStars();

    if (canvas) {
      ctx = canvas.getContext('2d');
      if (!reducedMotion) {
        requestAnimationFrame(drawCanvas);
      }
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
    });

    startLoader();
  });

})();
