# Système de Design — Portfolio « NoRushJustChat »

## 1. Vision & Ambiance
- **Thématique :** Cockpit d'avion de ligne / aviation générale de nuit croisé avec la créativité technique du développement Roblox Studio.
- **Ton :** Sérieux, rigoureux, passionné, humble et tourné vers l'apprentissage technique.
- **Identité publique :** Uniquement sous le pseudonyme **NoRushJustChat**. Aucune information personnelle (nom civil, téléphone, adresse, date de naissance, nom d'établissement) n'est autorisée.

---

## 2. Palette de Couleurs

| Nom de variable | Code Hex | Rôle & Usage | Contraste / Accessibilité |
| :--- | :--- | :--- | :--- |
| `--bg-space` | `#0b0c0a` | Arrière-plan global (nuit d'encre, légèrement olive) | Fond sombre principal |
| `--bg-cockpit` | `#11130f` | Surface des conteneurs & cartes (panneau de bord) | Contraste > 12:1 avec le texte clair |
| `--bg-card` | `rgba(27, 29, 23, 0.82)` | Fond translucide des cartes interactives | Élévation +1 |
| `--bg-card-hover` | `#292c22` | État hover des cartes & modules interactifs | Élévation +2 |
| `--border-subtle` | `rgba(215, 202, 174, 0.15)` | Délimitations fines rappelant les sérigraphies d'instruments | Discret, non intrusif |
| `--border-strong` | `rgba(217, 160, 102, 0.42)` | Bordures actives et survols | Accent lisible |
| `--border-focus` | `#d9a066` | Accentuation des focus clavier | Norme WCAG focus visible |
| `--text-main` | `#f3eddf` | Titres et texte principal (ivoire chaud) | Ratio > 14:1 sur fond sombre |
| `--text-muted` | `#c2baa8` | Sous-titres, descriptions et métadonnées secondaires | Ratio > 5.5:1 (conforme AA) |
| `--text-subtle` | `#8f8877` | Libellés techniques et informations tertiaires | Ratio proche de 4.5:1 |
| `--accent-cyan` | `#d9a066` | Ambre/cuivre de piste (variable historique, accents primaires) | Accents principaux |
| `--accent-cyan-deep` | `#a96b3c` | Cuivre profond, départ des dégradés et jauges | Accent secondaire |
| `--accent-amber` | `#d8bd92` | Sable clair pour les étiquettes et distinctions | Points chauds doux |
| `--accent-green` | `#93a786` | Sauge instrument (systèmes opérationnels, mentions TB) | Validation & statuts actifs |
| `--accent-roblox` | `#cf6450` | Rouge terre cuite (accent spécifique Roblox Studio) | Badges & tags Roblox |

---

## 3. Typographie

### 3.1 Familles de polices
1. **Police Display / Titres :** `'Space Grotesk'`, avec pile de secours :
   `'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
2. **Police Corps / Interface :** `'Inter'`, avec pile de secours :
   `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
3. **Police Technique / Instruments / Données :** `'JetBrains Mono'`, chargée via Google Fonts, avec pile de secours :
   `'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Menlo, monospace`

### 3.2 Échelle Typographique (Mobile-first avec clamp)
- **Titre Hero (H1) :** `clamp(3rem, 7.2vw, 5.6rem)` — Graisse 700, interlettrage `-0.055em`, dégradé ivoire → ambre
- **Titre de Section (H2) :** `clamp(2rem, 4.4vw, 3.25rem)` — Graisse 700, interlettrage `-0.035em`
- **Sous-titre / Cartouche (H3) :** `clamp(1.2rem, 2.5vw, 1.45rem)` — Graisse 600
- **Corps de texte (P) :** `1rem (16px)` avec `line-height: 1.65` — Longueur maximale `68ch`
- **Petites mentions & Badges :** `0.6–0.8rem` — `JetBrains Mono`, interlettrage `0.08–0.18em`, majuscules

---

## 4. Composants & Motifs Aéronautiques
1. **Navigation flottante :** Barre glassmorphism en pilule (`border-radius: 16px`), bordure fine, flou d'arrière-plan et ombre douce. Elle se masque au défilement vers le bas et réapparaît vers le haut.
2. **Hero asymétrique :** Colonne éditoriale à gauche, instrument de bord décoratif à droite (radar animé, avion, lectures `TRACK / STACK / STATUS`). L'instrument disparaît sous 900 px pour laisser toute la place au contenu.
3. **En-têtes de section éditoriaux :** Filet supérieur, index généré en CSS (`01 /`, `02 /`…), titre à gauche et chapô aligné à droite sur grand écran ; passage en une colonne sur mobile.
4. **Cartes Projets :** Coins adoucis (`border-radius: 18px`), dégradé de surface, liseré lumineux au survol (mask CSS), visuel avec vignettage bas et effet de soulèvement.
5. **Chronologie horizontale :** Trait continu reliant les balises de vol (BIA, brevets, stages, baptêmes de l'air). La section se fige à l'écran : le scroll vertical fait glisser la chronologie vers la droite ; chaque étape est désormais une carte en verre sombre.
6. **Icônes :** Fichiers SVG de `assets/icons/` (avion, logo Roblox Studio, code, outils, GitHub, Discord) chargés en `<img>`, teintés ambre pour les pictogrammes structurels — aucun emoji structurel.
7. **Barres de Télémétrie :** Jauges horizontales dégradées cuivre → ambre avec indicateur de pourcentage en `JetBrains Mono`, intégrées dans un bandeau à quatre cellules séparées par des filets d'instrument.
8. **Ruban de fond réactif :** Sur le canvas, une traînée de lumière ambre et sauge suit le curseur avec inertie. Le tracé est construit comme un ruban effilé (largeur et opacité décroissantes), complété par un halo de tête et une fine poussière lumineuse. Il s'estompe progressivement quand la souris s'immobilise.

---

## 5. Principes d'Animation & Performance
- **Propriétés autorisées pour l'animation :** Uniquement `transform` et `opacity` afin d'exploiter l'accélération matérielle (GPU) sans déclencher de reflow/repaint.
- **Défilement & Révélation :** Utilisation d'`IntersectionObserver` pour déclencher les apparitions une seule fois avec un seuil de 15%.
- **Curseur personnalisé :** Activé uniquement sur les périphériques disposant d'un pointeur précis (`@media (hover: hover) and (pointer: fine)`). Déconnecté sur écran tactile. Le curseur natif est masqué (`body.cursor-active`) pour ne laisser que le curseur custom.
- **Ruban réactif :** Rendu dans le canvas fixe, derrière le contenu. Le suivi du pointeur est lissé par interpolation et la géométrie du ruban est recalculée à chaque image (36 points maximum), sans allocation DOM. Désactivé avec `prefers-reduced-motion`.
- **Année automatique :** Les éléments `[data-year]` (badge hero, pied de page) sont renseignés au chargement via `new Date().getFullYear()`.
- **Effet de tilt 3D :** Calculé sur `pointermove` avec `requestAnimationFrame` pour éviter les saccades sur PC modeste.
- **Trajectoire d'avion :** Avion SVG se déplaçant sur le scroll sans bloquer le fil d'exécution principal.
- **Accessibilité motrice (`prefers-reduced-motion`) :**
  Désactivation des transitions 3D, du tilt, des trajectoires d'avion et du curseur personnalisé. Remplacement par de simples apparitions statiques instantanées.

---

## 6. Accessibilité (A11y) & Performance
- Score Lighthouse ciblé : **90+** en Performance, Accessibilité, Bonnes Pratiques et SEO.
- Focus visuel distinct pour la navigation clavier (`:focus-visible`).
- Balises ARIA pertinentes (`aria-label`, `aria-hidden` sur les icônes décoratives, `role="region"`).
- Absence de dépendance lourde : fonctionnel à 100% en local hors-ligne en double-cliquant sur `index.html`.

---

## 7. Contenu des Projets (fichiers `.json` séparés)

Les projets ne sont plus écrits dans `script.js` : chacun vit dans son propre fichier JSON.

### 7.1 Structure
```
assets/projects/
  _index.json          Liste des projets affichés (et leur ordre)
  _template.json       Modèle à copier — jamais affiché (commence par « _ »)
  01-simulateur-vol.json
  02-traffic-balisage.json
  …                    Un fichier = un projet, librement ajouté ou supprimé
```

### 7.2 Champs d'un projet
| Champ | Obligatoire | Rôle |
| :--- | :--- | :--- |
| `title` | **oui** | Titre de la carte |
| `category` | non (`divers`) | Clé de l'onglet de filtre : `roblox`, `aviation`, `web`, `divers`… |
| `description` | non | Texte de la carte |
| `tags` | non (`[]`) | Tableau de chaînes affichées sous la carte |
| `image` | non | Chemin relatif de l'image ; si vide, la carte s'affiche sans visuel |
| `link` / `linkText` | non | URL du projet et libellé du lien |
| `badge` | non | Étiquette en haut à droite du visuel |
| `id` | non | Identifiant ; déduit du titre s'il est absent |
| `en` | non | Traductions anglaises : `{ "title", "description", "tags", "image", "linkText" }` |

### 7.3 Ajout / suppression
1. **Ajouter** : copier `_template.json` vers `05-mon-projet.json`, remplir les champs, ajouter `"05-mon-projet.json"` dans `_index.json`.
2. **Supprimer** : retirer la ligne dans `_index.json` (et, si on veut, le fichier JSON).
3. Les onglets de filtre sont **générés automatiquement** à partir des catégories présentes : un projet en `"category": "web"` crée l'onglet « Web ».
4. Les champs de base (`title`, `description`, `tags`, `linkText`) sont en français ; l'objet `en` fournit la version anglaise affichée quand la langue active est l'anglais. Sans objet `en`, la version française sert de repli.

### 7.4 Repli hors-ligne (contrainte double-clic)
Les navigateurs (Chrome, Firefox…) interdisent toute requête vers un fichier local en `file://` (origine `null`, politique CORS) : `fetch()` sur les `.json` échoue donc en double-clic sur `index.html`.

- **En double-clic** : la section Projets affiche les projets de secours (`PROJETS_DE_SECOURS` dans `script.js`, copie des mêmes données) et un bandeau ambre explique la situation.
- **Via un serveur local** (`./demarrer.sh` sous Linux/macOS, `demarrer.bat` sous Windows, soit `python3 -m http.server`) ou une fois **hébergé en ligne**, les `.json` se chargent et les projets personnels s'affichent.
- **GitHub Pages : `.nojekyll` à la racine est obligatoire.** Pages construit les sites avec Jekyll, qui ignore les fichiers dont le nom commence par un underscore (`_index.json` en 404). `.nojekyll` indique à Pages de servir les fichiers tels quels.
- Le bandeau s'adapte à la cause : en `file://` il parle du double-clic et de `demarrer.sh` ; hébergé, il invite à vérifier que les `.json` sont commités et poussés.
- Un fichier cassé ou absent n'empêche pas les autres : il est signalé dans la console et ignoré.
- Tout texte issu des JSON est échappé (`escapeHtml` / `escapeAttr`) avant injection dans le DOM.

---

## 8. Configuration optionnelle (`config.json`, à la racine)

| Champ | Valeurs | Effet |
| :--- | :--- | :--- |
| `placeholderVisible` | `true` / `false` | Affiche ou retire la mention « Ces projets sont des placeholders… » |
| `imageFond` | chemin ou URL d'image | Remplace le canvas d'étoiles par cette image, recouverte d'un voile sombre (55 %) pour garder le texte lisible |

- `imageFond` vide (ou champ absent) → **fond actuel conservé** (canvas d'étoiles) : aucune image n'est imposée.
- L'héberge tant dans `assets/` qu'on veut, le chemin est relatif à `index.html` (`assets/images/fond.jpg` par exemple).
- Si `config.json` est illisible (double-clic en `file://`, fichier absent ou invalide), les valeurs par défaut s'appliquent en silence : mention affichée, fond étoiles conservé. Comme pour les projets, lire `config.json` suppose un serveur local (`./demarrer.sh`) ou l'hébergement.
- Le canvas (étoiles + balise radar) est stoppé et masqué tant que le fond image est actif ; `resumeCanvas` ne le relance pas.

---

## 9. Bilingue français / anglais

- **Langue par défaut :** anglais. Le HTML de `index.html` est rédigé en anglais.
- **Bascule :** sélecteur `FR / EN` intégré à droite de la navbar (`#lang-toggle`), avec sélection directe de la langue. Le choix est mémorisé dans `localStorage` (`norushjustchat-lang`).
- **Lien direct :** `index.html?lang=fr` ou `index.html?lang=en` force la langue pour la visite.
- **Textes statiques :** chaque élément traduisible porte `data-i18n="clé"` (ou `data-i18n-html`, `data-i18n-aria-label`, `data-i18n-placeholder`, `data-i18n-title`). Les traductions françaises sont dans `lang.js` (objet `FR`), l'anglais reste dans le HTML.
- **Textes dynamiques :** `window.PortfolioI18n.t("clé")` (onglets, cartes projets, avis). `script.js` écoute l'événement `languagechange` pour régénérer les projets, et la chronologie recalcule sa course horizontale.
- **Projets JSON :** champs de base en français + objet `en` pour l'anglais (voir §7.2).
- **Attribut `lang` :** `<html lang>` est mis à jour à chaque bascule (`fr` / `en`).


---
