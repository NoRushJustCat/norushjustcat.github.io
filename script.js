/* ==========================================================================
   script.js — Portfolio « NoRushJustChat »
   Toutes les interactions du site sont regroupées ici.
   Aucun framework externe n’est nécessaire.
   Langue du code : français.
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // 0. LANGUES (lang.js expose window.PortfolioI18n)
  // ------------------------------------------------------------------
  function currentLang() {
    return (window.PortfolioI18n && window.PortfolioI18n.lang) || 'en';
  }

  function t(cle) {
    return window.PortfolioI18n ? window.PortfolioI18n.t(cle) : cle;
  }

  // ------------------------------------------------------------------
  // 1. DONNÉES DES PROJETS (fichiers .json séparés)
  //
  // → Ajouter un projet : copier assets/projects/_template.json vers un
  //   nouveau fichier (ex. 05-mon-projet.json), remplir les champs, puis
  //   ajouter son nom dans assets/projects/_index.json.
  // → Supprimer un projet : retirer sa ligne dans _index.json (et le fichier).
  // → Les fichiers qui commencent par « _ » (template, index) sont ignorés.
  //
  // PROJETS_DE_SECOURS : copie des mêmes projets, intégrée au site.
  // Elle s'affiche uniquement si les .json ne peuvent pas être lus, c'est-à-
  // dire en double-clic sur index.html (file://) où Chrome bloque les
  // requêtes vers des fichiers locaux. Un serveur local (./demarrer.sh)
  // ou l'hébergement en ligne suffit à activer les .json.
  // ------------------------------------------------------------------
  const PROJECTS_DIR = 'assets/projects/';
  const PROJECTS_INDEX = '_index.json';

  const PROJETS_DE_SECOURS = [
    {
      id: 'roblox-1',
      category: 'roblox',
      title: 'Simulateur de Vol & Instruments',
      description: 'Cockpit virtuel fonctionnel avec HUD temps réel, lecture des instruments de vol et physique de sustentation.',
      tags: ['Luau', 'POO', 'Physique', 'HUD'],
      image: 'assets/images/project-roblox-1.svg',
      link: '#',
      linkText: 'Ouvrir le projet',
      badge: 'ROBLOX STUDIO',
      en: {
        title: 'Flight Simulator & Instruments',
        description: 'Functional virtual cockpit with a real-time HUD, flight instrument readouts and lift physics.',
        tags: ['Luau', 'OOP', 'Physics', 'HUD'],
        image: 'assets/images/project-roblox-1-en.svg',
        linkText: 'Open project'
      }
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
      badge: 'ROBLOX STUDIO',
      en: {
        title: 'Airport Traffic & Markings',
        description: 'Ground taxiing management, aircraft guidance to gates and dynamic runway lighting.',
        tags: ['Luau', 'Pathfinding', 'Lighting', 'UI'],
        image: 'assets/images/project-roblox-2-en.svg',
        linkText: 'Open project'
      }
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
      badge: 'ROBLOX STUDIO',
      en: {
        title: 'AI System & Modular Quests',
        description: 'State machines for NPCs, modular architecture and client-server synchronisation.',
        tags: ['Luau', 'AI', 'State Machine', 'Datastore'],
        image: 'assets/images/project-roblox-3-en.svg',
        linkText: 'Open project'
      }
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
      badge: 'AVIATION • WEB',
      en: {
        title: 'Aircraft Accident Investigator',
        description: 'Web tool for analysing flight data: telemetry, event timeline and trajectory visualisation.',
        tags: ['HTML5', 'Canvas', 'JavaScript', 'Mapping'],
        image: 'assets/images/project-aviation-web-en.svg',
        linkText: 'View tool'
      }
    }
  ];

  // Clés i18n des onglets de filtre (toute autre catégorie est déduite seule)
  const CLES_CATEGORIES = {
    roblox: 'category.roblox',
    aviation: 'category.aviation',
    web: 'category.web',
    divers: 'category.divers'
  };

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
  let ringX = 0;
  let ringY = 0;
  let ringAnimating = false;
  let cursorShown = false;

  // Légère traînée de l’anneau seulement (0 = collé, 1 = figé).
  const RING_EASE = 0.4;
  const RING_SNAP = 0.5;

  function initCursor() {
    if (!cursor || !cursorDot || !cursorRing) return;
    if (isPointerFine && !reducedMotion) {
      // Masque le curseur natif (le curseur custom prend le relais)
      document.body.classList.add('cursor-active');
      cursor.style.display = 'block';
      document.addEventListener('mousemove', onMouseMove);
      // Masque le curseur quand la souris quitte la fenêtre
      window.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) hideCursor();
      });
      setupCursorHover();
    }
  }

  function onMouseMove(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;

    // Le point est collé à la souris : appliqué dans l’événement,
    // aucune interpolation → aucune latence perçue.
    cursorDot.style.transform =
      'translate3d(' + cursorX + 'px, ' + cursorY + 'px, 0) translate(-50%, -50%)';

    if (!cursorShown) {
      cursorShown = true;
      cursor.style.opacity = '1';
    }

    if (!ringAnimating) {
      ringAnimating = true;
      window.requestAnimationFrame(animateRing);
    }
  }

  function hideCursor() {
    if (!cursorShown) return;
    cursorShown = false;
    cursor.style.opacity = '0';
  }

  function animateRing() {
    const dx = cursorX - ringX;
    const dy = cursorY - ringY;

    // Traînée très légère, qui s’arrête dès que l’anneau est arrivé
    // (pas de boucle rAF permanente).
    if (Math.abs(dx) < RING_SNAP && Math.abs(dy) < RING_SNAP) {
      ringX = cursorX;
      ringY = cursorY;
      ringAnimating = false;
    } else {
      ringX += dx * RING_EASE;
      ringY += dy * RING_EASE;
    }

    cursorRing.style.transform =
      'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) translate(-50%, -50%)';

    if (ringAnimating) window.requestAnimationFrame(animateRing);
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
  let flightTicking = false;

  function initFlightTracker() {
    if (!flightFill || !flightPlane || reducedMotion) return;

    window.addEventListener('scroll', () => {
      if (!flightTicking) {
        window.requestAnimationFrame(updateFlight);
        flightTicking = true;
      }
    });

    updateFlight();
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

    flightTicking = false;
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
  // 11. GRILLE DES PROJETS (fichiers .json → injection DOM + onglets)
  // ------------------------------------------------------------------

  // Un texte JSON est réinjecté dans le HTML : on échappe les caractères
  // risqués pour éviter qu’un « < » ou une accolade casse l’affichage.
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = (text === null || text === undefined) ? '' : String(text);
    return div.innerHTML;
  }

  // Idem pour les attributs (les guillemets doivent être protégés aussi).
  function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Complète/valide un projet lu dans un JSON : champs absents, mauvais
  // types, etc. Renvoie null si le projet est inexploitable.
  function normaliserProjet(brut, source) {
    if (!brut || typeof brut !== 'object' || Array.isArray(brut)) {
      console.warn('[projets] ' + source + ' : pas un objet JSON, projet ignoré.');
      return null;
    }

    const titre = typeof brut.title === 'string' ? brut.title.trim() : '';
    if (!titre) {
      console.warn('[projets] ' + source + ' : champ « title » manquant, projet ignoré.');
      return null;
    }

    // Traductions anglaises facultatives : {"en": {"title": "...", ...}}
    const traduction = (brut.en && typeof brut.en === 'object' && !Array.isArray(brut.en)) ? brut.en : null;

    return {
      id: (typeof brut.id === 'string' && brut.id.trim())
        ? brut.id.trim()
        : titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      category: (typeof brut.category === 'string' && brut.category.trim())
        ? brut.category.trim().toLowerCase()
        : 'divers',
      title: titre,
      description: (typeof brut.description === 'string') ? brut.description : '',
      tags: Array.isArray(brut.tags)
        ? brut.tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
        : [],
      image: (typeof brut.image === 'string') ? brut.image.trim() : '',
      link: (typeof brut.link === 'string' && brut.link.trim()) ? brut.link.trim() : '#',
      linkText: (typeof brut.linkText === 'string' && brut.linkText.trim())
        ? brut.linkText.trim()
        : '',
      badge: (typeof brut.badge === 'string') ? brut.badge.trim() : '',
      en: traduction ? {
        title: (typeof traduction.title === 'string' && traduction.title.trim())
          ? traduction.title.trim()
          : '',
        description: (typeof traduction.description === 'string') ? traduction.description : '',
        tags: Array.isArray(traduction.tags)
          ? traduction.tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
          : [],
        image: (typeof traduction.image === 'string') ? traduction.image.trim() : '',
        linkText: (typeof traduction.linkText === 'string' && traduction.linkText.trim())
          ? traduction.linkText.trim()
          : ''
      } : null
    };
  }

  // Champ d'un projet dans la langue active (repli sur la version française).
  function champProjet(projet, champ) {
    if (currentLang() === 'en' && projet.en) {
      const valeur = projet.en[champ];
      if (Array.isArray(valeur)) {
        if (valeur.length) return valeur;
      } else if (valeur) {
        return valeur;
      }
    }
    return projet[champ];
  }

  // Lecture de assets/projects/ : l’index liste les fichiers, puis chaque
  // fichier est lu et normalisé. Rejette si tout est inaccessible.
  async function chargerProjets() {
    const reponseIndex = await fetch(PROJECTS_DIR + PROJECTS_INDEX, { cache: 'no-store' });
    if (!reponseIndex.ok) {
      throw new Error(PROJECTS_INDEX + ' introuvable (HTTP ' + reponseIndex.status + ')');
    }

    const index = await reponseIndex.json();
    let fichiers = Array.isArray(index) ? index : (index && index.fichiers);
    if (!Array.isArray(fichiers)) {
      throw new Error('_index.json invalide : tableau « fichiers » attendu.');
    }

    // Les fichiers commençant par « _ » ne sont pas des projets
    // (_index.json, _template.json).
    fichiers = fichiers.filter(f =>
      typeof f === 'string' && f.trim() && f.trim().charAt(0) !== '_');

    // Un fichier cassé n’empêche pas les autres d’être affichés.
    const lus = await Promise.all(fichiers.map(async (fichier) => {
      try {
        const reponse = await fetch(PROJECTS_DIR + fichier, { cache: 'no-store' });
        if (!reponse.ok) throw new Error('HTTP ' + reponse.status);
        return normaliserProjet(await reponse.json(), fichier);
      } catch (erreur) {
        console.warn('[projets] ' + fichier + ' illisible : ' + erreur.message);
        return null;
      }
    }));

    const projets = lus.filter(Boolean);
    if (!projets.length) throw new Error('aucun projet valide dans ' + PROJECTS_DIR);
    return projets;
  }

  // Libellé d’un onglet : table i18n, sinon catégorie déduite.
  function libelleCategorie(categorie) {
    if (CLES_CATEGORIES[categorie]) return t(CLES_CATEGORIES[categorie]);
    return categorie.charAt(0).toUpperCase() + categorie.slice(1);
  }

  function initProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    let projets = PROJETS_DE_SECOURS;
    let activeFilter = 'all';

    function renderProjects(filter) {
      activeFilter = filter;
      container.innerHTML = '';

      const filtered = filter === 'all'
        ? projets
        : projets.filter(p => p.category === filter);

      filtered.forEach(project => {
        const titre = champProjet(project, 'title');
        const description = champProjet(project, 'description');
        const tags = champProjet(project, 'tags') || [];
        const lienTexte = champProjet(project, 'linkText') || t('projects.viewProject');
        const image = champProjet(project, 'image');

        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-reveal', '');

        // L’image et le badge sont facultatifs dans le JSON
        if (!image) card.classList.add('no-media');

        const media = image
          ? `<div class="project-media" aria-hidden="true">
               <img src="${escapeAttr(image)}" alt="${escapeAttr(titre)}" loading="lazy" width="800" height="450">
               ${project.badge ? `<span class="project-badge">${escapeHtml(project.badge)}</span>` : ''}
             </div>`
          : '';

        card.innerHTML = `
          ${media}
          <div class="project-info">
            <h3>${escapeHtml(titre)}</h3>
            <p>${escapeHtml(description)}</p>
            <div class="project-tags">
              ${tags.map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join('')}
            </div>
            <div class="project-footer">
              <a href="${escapeAttr(project.link)}" class="project-link" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(lienTexte)} <span>→</span>
              </a>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    }

    // Les onglets de filtre sont générés à partir des catégories réelles :
    // un nouveau projet apporte automatiquement son onglet.
    function renderOnglets() {
      const zone = document.getElementById('filter-controls');
      if (!zone) return;

      const categories = [];
      projets.forEach(p => {
        if (categories.indexOf(p.category) === -1) categories.push(p.category);
      });

      const onglets = [{ cle: 'all', libelle: t('projects.all') }]
        .concat(categories.map(cle => ({ cle: cle, libelle: libelleCategorie(cle) })));

      zone.innerHTML = '';

      onglets.forEach((onglet) => {
        const actif = onglet.cle === activeFilter;
        const bouton = document.createElement('button');
        bouton.type = 'button';
        bouton.className = 'filter-tab' + (actif ? ' active' : '');
        bouton.setAttribute('data-filter', onglet.cle);
        bouton.setAttribute('role', 'tab');
        bouton.setAttribute('aria-selected', actif ? 'true' : 'false');
        bouton.textContent = onglet.libelle;

        bouton.addEventListener('click', () => {
          zone.querySelectorAll('.filter-tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          bouton.classList.add('active');
          bouton.setAttribute('aria-selected', 'true');
          renderProjects(onglet.cle);
        });

        zone.appendChild(bouton);
      });
    }

    // Repli si les .json ne sont pas lisibles. Le message dépend de la
    // cause : double-clic local (file://, le navigateur bloque la lecture
    // des fichiers) ou fichiers manquants côté serveur (hébergement).
    function afficherAvisProjets(erreur) {
      const avis = document.getElementById('projects-notice');
      if (avis) {
        if (location.protocol === 'file:') {
          avis.innerHTML = t('projects.noticeFile');
        } else {
          avis.innerHTML = t('projects.noticeServer');
        }
        avis.hidden = false;
      }

      console.info('[projets] Projets JSON indisponibles (' + erreur.message + ').');
      if (location.protocol === 'file:') {
        console.info('[projets] Double-clic : le navigateur interdit de lire les fichiers locaux. Lance ./demarrer.sh puis ouvre http://localhost:8000');
      }
    }

    chargerProjets()
      .then(liste => {
        projets = liste;
      })
      .catch(erreur => {
        afficherAvisProjets(erreur);
      })
      .then(() => {
        // Affichage : projets JSON si disponibles, sinon projets de secours
        renderOnglets();
        renderProjects(activeFilter);
      });

    // Changement de langue : on régénère onglets, cartes et avis éventuel.
    document.addEventListener('languagechange', () => {
      renderOnglets();
      renderProjects(activeFilter);

      const avis = document.getElementById('projects-notice');
      if (avis && !avis.hidden) {
        avis.innerHTML = (location.protocol === 'file:')
          ? t('projects.noticeFile')
          : t('projects.noticeServer');
      }
    });
  }

  // ------------------------------------------------------------------
  // 12. CHRONOLOGIE HORIZONTALE (section épinglée)
  // Le scroll vertical pilote un défilement horizontal : la section
  // se fige à l’écran pendant que la chronologie glisse vers la droite.
  // Sans mouvement réduit, un simple défilement horizontal natif fait foi.
  // ------------------------------------------------------------------
  function initHorizontalTimeline() {
    const pin = document.getElementById('timeline-pin');
    const sticky = document.getElementById('timeline-sticky');
    const track = document.getElementById('timeline-track');
    const progressLine = document.getElementById('timeline-progress');
    const hint = document.getElementById('timeline-hint');
    if (!pin || !sticky || !track) return;

    const HEADER_OFFSET = 64;
    let maxShift = 0;

    function setProgress(value) {
      const p = Math.min(Math.max(value, 0), 1);
      if (progressLine) progressLine.style.transform = 'scaleX(' + p + ')';
      if (hint) hint.classList.toggle('is-hidden', p > 0.02);
    }

    // Repli : la chronologie se défile horizontalement à la main.
    if (reducedMotion) {
      sticky.addEventListener('scroll', () => {
        const range = sticky.scrollWidth - sticky.clientWidth;
        setProgress(range > 0 ? sticky.scrollLeft / range : 0);
      }, { passive: true });
      return;
    }

    function layout() {
      pin.classList.add('is-pinned');
      sticky.scrollLeft = 0; /* le scroll-snap du repli peut décaler le conteneur */
      track.style.transform = 'translate3d(0, 0, 0)';
      maxShift = Math.max(0, track.offsetWidth - sticky.clientWidth);
      pin.style.height = (sticky.offsetHeight + maxShift) + 'px';
      update();
    }

    function update() {
      if (sticky.scrollLeft !== 0) sticky.scrollLeft = 0;
      if (maxShift <= 0) {
        track.style.transform = 'none';
        setProgress(0);
        return;
      }
      const rect = pin.getBoundingClientRect();
      const raw = (HEADER_OFFSET - rect.top) / maxShift;
      const progress = Math.min(Math.max(raw, 0), 1);
      track.style.transform = 'translate3d(' + (-progress * maxShift) + 'px, 0, 0)';
      setProgress(progress);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);

    // Le changement de langue modifie la largeur du texte : on recalcule
    // la course horizontale et la hauteur de la section épinglée.
    document.addEventListener('languagechange', () => {
      window.requestAnimationFrame(() => {
        layout();
        window.setTimeout(layout, 150);
      });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(layout);
    }

    layout();
  }

  // ------------------------------------------------------------------
  // 13. ANNÉE AUTOMATIQUE (badge hero + pied de page)
  // ------------------------------------------------------------------
  function initYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = String(year);
    });
  }

  // ------------------------------------------------------------------
  // 14. CONFIGURATION OPTIONNELLE (config.json, à la racine)
  //
  //   placeholderVisible : true|false → la mention « placeholders »
  //                        s'affiche au-dessus des projets ou est retirée.
  //   imageFond          : chemin ou URL d'une image → devient le fond du
  //                        site (voile sombre appliqué), le canvas d'étoiles
  //                        est alors retiré. "" ou champ absent = fond actuel.
  //
  // Si config.json ne peut pas être lu (double-clic file://, fichier
  // absent ou invalide), les valeurs par défaut s'appliquent : mention
  // affichée et fond étoiles conservé, sans message bloquant.
  // ------------------------------------------------------------------
  let imageFondActive = false;

  function chargerConfig() {
    return fetch('config.json', { cache: 'no-store' })
      .then(reponse => {
        if (!reponse.ok) return null;
        return reponse.json();
      })
      .then(config => {
        return (config && typeof config === 'object' && !Array.isArray(config)) ? config : null;
      })
      .catch(erreur => {
        console.info('[config] config.json non lu (' + erreur.message + ') → valeurs par défaut.');
        return null;
      });
  }

  function appliquerConfig(config) {
    if (!config) return;

    // Mention « placeholders » retirée si demandé
    if (config.placeholderVisible === false) {
      const mention = document.querySelector('.projects-placeholder');
      if (mention) mention.remove();
    }

    // Fond image : remplace le canvas d'étoiles quand il est renseigné
    const cheminImage = (typeof config.imageFond === 'string') ? config.imageFond.trim() : '';
    const fond = document.getElementById('fond-image');
    if (!fond || !cheminImage) return;

    // Image + voile sombre (deux couches de background) pour garder
    // le texte lisible quelle que soit la photo.
    fond.style.backgroundImage =
      'linear-gradient(rgba(6, 11, 20, 0.55), rgba(6, 11, 20, 0.55)), url("'
      + cheminImage.replace(/"/g, '%22') + '")';
    fond.hidden = false;
    imageFondActive = true;

    // Le canvas n'a plus de rôle : arrêt du dessin et masquage
    if (canvas) canvas.style.display = 'none';
    ctx = null;
  }

  // ------------------------------------------------------------------
  // 15. INITIALISATION DU HERO (après le loader)
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
    initProjects();

    // Reprend le canvas si l’onglet revient au premier plan
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      resumeCanvas();
    });
  }

  // ------------------------------------------------------------------
  // 16. DÉMARRAGE
  // ------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    initYear();
    initHorizontalTimeline();
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

    // config.json peut retirer la mention « placeholders » et remplacer
    // le fond animé par une image : appliqué dès qu'il est lu, valeurs
    // par défaut sinon (double-clic, fichier absent…).
    chargerConfig().then(appliquerConfig);

    startLoader();
  });

})();
