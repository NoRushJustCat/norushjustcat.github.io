/* ==========================================================================
   lang.js — Gestion bilingue FR / EN du portfolio « NoRushJustChat »

   Principe :
   - Le HTML est écrit en anglais (langue par défaut).
   - Chaque texte traduisible porte un attribut data-i18n="cle".
   - Ce fichier mémorise le contenu d'origine (anglais), puis applique la
     traduction française quand on bascule en FR.
   - Le choix est conservé dans localStorage.

   Attributs pris en charge :
     data-i18n="cle"                 → remplace le texte de l'élément
     data-i18n-html="cle"            → remplace le HTML interne
     data-i18n-aria-label="cle"      → remplace l'attribut aria-label
     data-i18n-placeholder="cle"     → remplace l'attribut placeholder
     data-i18n-title="cle"           → remplace l'attribut title
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'norushjustchat-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['fr', 'en'];

  // Clés utilisées dynamiquement par script.js : les deux langues sont
  // nécessaires ici (le HTML ne peut pas servir de secours).
  const DYNAMIC = {
    en: {
      'lang.label': 'Language',
      'lang.french': 'French',
      'lang.english': 'English',
      'category.roblox': 'Roblox Studio',
      'category.aviation': 'Aviation Web',
      'category.web': 'Web',
      'category.divers': 'Misc',
      'projects.all': 'All projects',
      'projects.viewProject': 'View project',
      'projects.noticeFile': 'The original projects are shown: when you open index.html by double-clicking, '
        + 'Firefox and Chrome block local .json files. '
        + 'To see your projects: run <code>./demarrer.sh</code> then open <code>http://localhost:8000</code>.',
      'projects.noticeServer': 'The project files cannot be found on the server. '
        + 'Check that the .json files in <code>assets/projects/</code> are committed and pushed.'
    },
    fr: {
      'lang.label': 'Langue',
      'lang.french': 'Français',
      'lang.english': 'Anglais',
      'category.roblox': 'Roblox Studio',
      'category.aviation': 'Aviation Web',
      'category.web': 'Web',
      'category.divers': 'Divers',
      'projects.all': 'Tous les projets',
      'projects.viewProject': 'Voir le projet',
      'projects.noticeFile': 'Les projets d\'origine sont affichés : en double-cliquant sur index.html, '
        + 'Firefox et Chrome interdisent de lire des fichiers .json locaux. '
        + 'Pour voir tes projets : lance <code>./demarrer.sh</code> puis ouvre <code>http://localhost:8000</code>.',
      'projects.noticeServer': 'Les fichiers de projets sont introuvables sur le serveur. '
        + 'Vérifie que les .json de <code>assets/projects/</code> sont bien commités et poussés.'
    }
  };

  // Traductions françaises du contenu statique (anglais = HTML d'origine).
  const FR = {
    'meta.title': 'NoRushJustChat — Portfolio Aviation & Roblox Studio',
    'meta.description': "Portfolio de NoRushJustChat : lycéen passionné d'aéronautique, titulaire du BIA mention Très Bien, et développeur de jeux sur Roblox Studio en Luau.",
    'meta.ogTitle': 'NoRushJustChat — Portfolio Aviation & Roblox Studio',
    'meta.ogDescription': 'Projets Roblox Studio, parcours aéronautique, BIA mention Très Bien et réalisations techniques.',
    'meta.twitterTitle': 'NoRushJustChat — Portfolio',
    'meta.twitterDescription': "Lycéen passionné d'aviation et développeur Roblox Studio.",
    'meta.ogImage': 'assets/images/project-roblox-1.svg',

    'loader.status': 'INITIALISATION COCKPIT',

    'brand.home': 'Retour en haut de page',
    'nav.openMenu': 'Ouvrir le menu',
    'nav.main': 'Navigation principale',
    'nav.about': 'À propos',
    'nav.journey': 'Parcours',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.interests': "Centres d'intérêt",
    'nav.contact': 'Contact',

    'hero.badge': 'SYSTÈMES PRÊTS • PROMOTION',
    'hero.subtitle': "Passionné d'aviation • Développeur Roblox Studio",
    'hero.text': "Lycéen curieux et méthodique. Titulaire du Brevet d'Initiation Aéronautique mention Très Bien, je m'intéresse à la mécanique de vol et je développe des jeux complets en Luau sur Roblox Studio.",
    'hero.ctaProjects': 'Voir mes projets',
    'hero.ctaJourney': 'Découvrir mon parcours',

    'hero.stat1Tag': 'Excellence',
    'hero.stat1Desc': 'Mentions Très Bien (BIA et Brevet)',
    'hero.stat2Tag': 'Atelier',
    'hero.stat2Desc': 'Stage (Air France Industries)',
    'hero.stat3Tag': 'Technique',
    'hero.stat3Desc': 'Projets présentés (Luau et Web)',
    'hero.stat4Tag': 'Implication',
    'hero.stat4Desc': "Régularité et envie d'apprendre",

    'hero.scrollAria': 'Défiler vers la section À propos',
    'hero.scrollLabel': 'DÉFILER',

    'about.pretitle': 'PRÉSENTATION',
    'about.title': 'Profil & Démarche',
    'about.lead': 'Une approche orientée vers la technique, la compréhension des machines et la rigueur.',
    'about.cardTitle': 'Lycéen, bricoleur et créateur de jeux',
    'about.p1': "Je m'investis pleinement dans mes études avec de solides retours de mes enseignants sur mon sérieux et ma méthode. L'aéronautique m'attire particulièrement : j'aime savoir comment un avion vole, comment les réacteurs fonctionnent et comment les équipes au sol garantissent la sécurité de chaque départ.",
    'about.p2': "En dehors des cours, je passe mon temps sur deux activités complémentaires : le bricolage mécanique pratique et la programmation en Luau sur Roblox Studio. Le code me permet de tester mes idées de systèmes de jeu, d'interfaces et de physique en direct.",
    'about.p3': "Mon objectif est de continuer à apprendre pour m'orienter vers les métiers techniques et d'ingénierie du secteur aéronautique.",
    'about.chip1': 'BIA validé mention Très Bien',
    'about.chip2': 'Dextérité manuelle et mécanique',
    'about.chip3': 'Développement Roblox Studio (Luau)',
    'about.chip4': "Rigueur et rapidité d'exécution",

    'timeline.pretitle': 'CHRONOLOGIE',
    'timeline.title': 'Parcours & Expériences',
    'timeline.lead': 'Formations, immersions professionnelles et étapes marquantes. Continuez à défiler vers le bas : la chronologie se déroule alors vers la droite.',
    'timeline.hint': 'Défilez vers la droite',

    'timeline.bia.type': 'Diplôme aéronautique',
    'timeline.bia.period': 'Examen officiel',
    'timeline.bia.heading': "Brevet d'Initiation Aéronautique (BIA)",
    'timeline.bia.result': 'Mention Très Bien',
    'timeline.bia.summary': "Étude approfondie de cinq domaines clés : aérodynamique et mécanique du vol, connaissance des aéronefs, météorologie, navigation et histoire de l'aviation.",
    'timeline.bia.tag1': 'Mécanique du vol',
    'timeline.bia.tag2': 'Météorologie',
    'timeline.bia.tag3': 'Navigation',
    'timeline.bia.tag4': 'Réglementation',

    'timeline.afi.type': 'Stage en entreprise',
    'timeline.afi.period': 'Classe de 2de',
    'timeline.afi.result': 'Découverte de la maintenance aéronautique',
    'timeline.afi.summary': "Observation des équipes techniques en atelier et en hangar : protocoles d'entretien des turboréacteurs, vérifications de navigabilité, outillage spécifique et logistique de pièces de rechange.",
    'timeline.afi.tag1': 'Maintenance MRO',
    'timeline.afi.tag2': "Moteurs d'avions",
    'timeline.afi.tag3': 'Sécurité des vols',
    'timeline.afi.tag4': 'Travail en équipe',

    'timeline.flights.type': 'Vol réel',
    'timeline.flights.period': 'Aéroclub',
    'timeline.flights.heading': "Baptêmes de l'Air & Vols de Découverte",
    'timeline.flights.result': 'Premières prises de commandes',
    'timeline.flights.summary': "Plusieurs vols avec instructeur aux commandes d'un avion léger : visite prévol complète, roulage au sol, maintien d'altitude, virages coordonnés et surveillance des instruments de bord.",
    'timeline.flights.tag1': 'Visite prévol',
    'timeline.flights.tag2': 'Pilotage de base',
    'timeline.flights.tag3': 'Lecture instruments',
    'timeline.flights.tag4': 'Communication radio',

    'timeline.brevet.type': 'Diplôme national',
    'timeline.brevet.period': 'Collège',
    'timeline.brevet.heading': 'Diplôme National du Brevet & ASSR 1',
    'timeline.brevet.result': 'Mention Très Bien',
    'timeline.brevet.summary': 'Validation du brevet des collèges avec la plus haute mention, confirmant un travail méthodique et continu dans toutes les matières.',
    'timeline.brevet.tag1': 'Mention Très Bien',
    'timeline.brevet.tag2': 'ASSR 1',
    'timeline.brevet.tag3': 'Régularité',

    'projects.pretitle': 'RÉALISATIONS',
    'projects.title': 'Projets Développés',
    'projects.lead': "Créations sur Roblox Studio (scripts Luau) et outil web d'investigation aéronautique.",
    'projects.placeholder': "Ces projets sont des placeholders : ce ne sont pas de vrais projets.",
    'projects.filterAria': 'Filtrer les projets',

    'skills.pretitle': 'SAVOIR-FAIRE',
    'skills.title': 'Compétences Techniques & Savoir-Être',
    'skills.lead': 'Des bases techniques concrètes combinées à une forte capacité d’adaptation.',
    'skills.techTitle': 'Compétences Techniques',
    'skills.softTitle': 'Savoir-Être & Comportement',

    'skills.m1Name': 'Roblox Studio & Scripting Luau',
    'skills.m1Notes': 'Modélisation de logique de jeu, architecture client-serveur, interfaces Tween et physique',
    'skills.m2Name': 'Aisance Mécanique & Bricolage',
    'skills.m2Notes': "Utilisation des outils d'atelier, diagnostic d'organes mécaniques, assemblage et montage",
    'skills.m3Name': 'Bases Informatiques & Logique Système',
    'skills.m3Notes': 'Environnement Linux et Windows, notions de Git, structure de données, HTML/CSS de base',
    'skills.m4Name': 'Théorie Aéronautique (BIA)',
    'skills.m4Notes': 'Principes de sustentation, météorologie de vol, instruments gyroscopiques et altimétriques',

    'skills.q1Title': "Curiosité et volonté d'apprendre",
    'skills.q1Text': "Je cherche toujours à comprendre le fonctionnement interne des systèmes pour progresser rapidement.",
    'skills.q2Title': 'Sérieux et rigueur',
    'skills.q2Text': "Habitude d'un travail soigné, vérifié étape par étape selon les consignes reçues.",
    'skills.q3Title': 'Dynamisme et réactivité',
    'skills.q3Text': "Toujours prêt à agir et à chercher des solutions directes en cas de problème ou d'imprévu.",
    'skills.q4Title': "Rapidité d'exécution",
    'skills.q4Text': 'Assimilation directe des consignes pour livrer un travail propre sans perdre de temps.',

    'passions.pretitle': 'OUVERTURE',
    'passions.title': "Langues & Centres d'Intérêt",
    'passions.lead': "Centres d'intérêt personnels et compétences linguistiques.",
    'passions.languagesTitle': 'Langues pratiquées',
    'passions.interestsTitle': "Centres d'intérêt",

    'languages.frenchName': 'Français',
    'languages.frenchRank': 'Langue maternelle',
    'languages.englishName': 'Anglais',
    'languages.englishRank': 'Niveau scolaire (lecture fluide de documentation technique)',
    'languages.spanishName': 'Espagnol',
    'languages.spanishRank': 'Niveau scolaire',

    'hobbies.h1Title': 'Aviation & Ingénierie',
    'hobbies.h1Desc': "Avions de ligne, moteurs à réaction, aérodynamique et reconstitution d'incidents.",
    'hobbies.h2Title': 'Mécanique & Bricolage',
    'hobbies.h2Desc': "Fonctionnement des moteurs, démontage, réparation d'outils et travail du métal/bois.",
    'hobbies.h3Title': 'Création Roblox Studio',
    'hobbies.h3Desc': "Conception de game design, scripts Luau, création de mécaniques et d'interfaces.",
    'hobbies.h4Title': 'Informatique pratique',
    'hobbies.h4Desc': 'Configuration système, programmation, curiosité pour les technologies numériques.',

    'contact.pretitle': 'COMMUNICATION',
    'contact.title': 'Prendre Contact',
    'contact.lead': "Pour échanger sur un projet, une formation ou une opportunité technique.",
    'contact.profilesLabel': 'PROFILS & LIENS',

    'footer.taglineHtml': '© <span data-year>2026</span> NoRushJustChat',
    'footer.backToTop': 'Haut de page',
    'footer.backToTopAria': 'Remonter en haut de page'
  };

  let currentLang = DEFAULT_LANG;
  const originals = new Map();

  function record(el) {
    if (!originals.has(el)) originals.set(el, {});
    return originals.get(el);
  }

  function cacheOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      record(el).text = el.textContent;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      record(el).html = el.innerHTML;
    });

    document.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        const match = /^data-i18n-([a-z-]+)$/.exec(attr.name);
        if (!match || match[1] === 'html') return;
        record(el).attrs = record(el).attrs || {};
        record(el).attrs[match[1]] = el.getAttribute(match[1]) || '';
      });
    });
  }

  function lookup(key, lang) {
    if (lang === 'fr' && Object.prototype.hasOwnProperty.call(FR, key)) {
      return FR[key];
    }
    const table = DYNAMIC[lang];
    if (table && Object.prototype.hasOwnProperty.call(table, key)) {
      return table[key];
    }
    return null;
  }

  // Texte pour le JavaScript (projets, filtres…).
  function t(key) {
    const value = lookup(key, currentLang);
    if (value !== null) return value;
    const fallback = DYNAMIC.en[key];
    if (fallback !== undefined) return fallback;
    return key;
  }

  function applyElement(el, lang) {
    const rec = originals.get(el) || {};

    if (el.hasAttribute('data-i18n')) {
      const key = el.getAttribute('data-i18n');
      const value = lookup(key, lang);
      if (value !== null) {
        el.textContent = value;
      } else if (rec.text !== undefined) {
        el.textContent = rec.text;
      }
    }

    if (el.hasAttribute('data-i18n-html')) {
      const key = el.getAttribute('data-i18n-html');
      const value = lookup(key, lang);
      if (value !== null) {
        el.innerHTML = value;
      } else if (rec.html !== undefined) {
        el.innerHTML = rec.html;
      }
    }

    Object.keys(rec.attrs || {}).forEach(attrName => {
      const key = el.getAttribute('data-i18n-' + attrName);
      const value = lookup(key, lang);
      const next = (value !== null) ? value : rec.attrs[attrName];
      if (next !== null && next !== undefined) el.setAttribute(attrName, next);
    });
  }

  const META_SELECTORS = {
    'meta.description': 'meta[name="description"]',
    'meta.ogTitle': 'meta[property="og:title"]',
    'meta.ogDescription': 'meta[property="og:description"]',
    'meta.twitterTitle': 'meta[name="twitter:title"]',
    'meta.twitterDescription': 'meta[name="twitter:description"]',
    'meta.ogImage': 'meta[property="og:image"]'
  };

  function applyMeta(lang) {
    const title = lookup('meta.title', lang);
    document.title = (title !== null) ? title : metaOriginals['meta.title'];

    Object.keys(META_SELECTORS).forEach(key => {
      const el = document.head.querySelector(META_SELECTORS[key]);
      if (!el) return;
      const value = lookup(key, lang);
      el.setAttribute('content', (value !== null) ? value : metaOriginals[key]);
    });
  }

  // Valeurs anglaises d'origine des balises meta (avant toute traduction).
  const metaOriginals = {};

  function cacheMetaOriginals() {
    metaOriginals['meta.title'] = document.title;
    Object.keys(META_SELECTORS).forEach(key => {
      const el = document.head.querySelector(META_SELECTORS[key]);
      if (el) metaOriginals[key] = el.getAttribute('content');
    });
  }

  function syncYears() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = year;
    });
  }

  function updateToggle(lang) {
    const group = document.getElementById('lang-toggle');
    if (!group) return;
    group.setAttribute('aria-label', t('lang.label'));
    group.setAttribute('data-current-lang', lang);
    group.querySelectorAll('[data-lang-option]').forEach(el => {
      const code = el.getAttribute('data-lang-option');
      const active = code === lang;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-pressed', active ? 'true' : 'false');
      const nameKey = (code === 'fr') ? 'lang.french' : 'lang.english';
      el.setAttribute('aria-label', t(nameKey));
      el.setAttribute('title', t(nameKey));
    });
  }

  function setLanguage(lang) {
    currentLang = SUPPORTED.indexOf(lang) === -1 ? DEFAULT_LANG : lang;

    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (erreur) {
      // localStorage peut être bloqué : la langue reste active pour la visite.
    }

    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-aria-label], [data-i18n-placeholder], [data-i18n-title]')
      .forEach(el => applyElement(el, currentLang));

    applyMeta(currentLang);
    syncYears();
    updateToggle(currentLang);

    document.dispatchEvent(new CustomEvent('languagechange', {
      detail: { lang: currentLang }
    }));
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'fr' ? 'en' : 'fr');
  }

  function getInitialLanguage() {
    // Lien partageable : index.html?lang=fr ou ?lang=en
    try {
      const requested = (new URLSearchParams(window.location.search).get('lang') || '').toLowerCase();
      if (SUPPORTED.indexOf(requested) !== -1) return requested;
    } catch (erreur) {
      // URLSearchParams indisponible : on continue avec le reste.
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (erreur) {
      // localStorage indisponible : on garde la langue par défaut.
    }
    return DEFAULT_LANG;
  }

  cacheOriginals();
  cacheMetaOriginals();

  window.PortfolioI18n = {
    get lang() { return currentLang; },
    t: t,
    setLanguage: setLanguage,
    toggle: toggleLanguage
  };

  const languageSwitch = document.getElementById('lang-toggle');
  if (languageSwitch) {
    languageSwitch.querySelectorAll('[data-lang-option]').forEach(option => {
      option.addEventListener('click', () => {
        const code = option.getAttribute('data-lang-option');
        if (code !== currentLang) setLanguage(code);
      });
    });
  }

  currentLang = getInitialLanguage();
  setLanguage(currentLang);
})();
