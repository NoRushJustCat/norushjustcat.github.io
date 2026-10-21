# Système de Design — Portfolio « NoRushJustChat »

## 1. Vision & Ambiance
- **Thématique :** Cockpit d'avion de ligne / aviation générale de nuit croisé avec la créativité technique du développement Roblox Studio.
- **Ton :** Sérieux, rigoureux, passionné, humble et tourné vers l'apprentissage technique.
- **Identité publique :** Uniquement sous le pseudonyme **NoRushJustChat**. Aucune information personnelle (nom civil, téléphone, adresse, date de naissance, nom d'établissement) n'est autorisée.

---

## 2. Palette de Couleurs

| Nom de variable | Code Hex | Rôle & Usage | Contraste / Accessibilité |
| :--- | :--- | :--- | :--- |
| `--bg-space` | `#060b14` | Arrière-plan global (nuit aéronautique profonde) | Fond sombre principal |
| `--bg-cockpit` | `#0b1524` | Surface des conteneurs & cartes (panneau de bord) | Contraste > 12:1 avec le texte clair |
| `--bg-card` | `#112035` | Fond des cartes interactives au repos | Élévation +1 |
| `--bg-card-hover` | `#172c47` | État hover des cartes & modules interactifs | Élévation +2 |
| `--border-subtle` | `rgba(69, 214, 232, 0.15)` | Délimitations fines rappelant les sérigraphies d'instruments | Discret, non intrusif |
| `--border-focus` | `#45d6e8` | Accentuation des focus clavier et bordures actives | Norme WCAG focus visible |
| `--text-main` | `#f0f6fc` | Titres et texte principal à fort contraste | Ratio > 14:1 sur fond sombre |
| `--text-muted` | `#9ab3cf` | Sous-titres, descriptions et métadonnées secondaires | Ratio > 5.5:1 (conforme AA) |
| `--accent-cyan` | `#45d6e8` | Cyan avionique (écrans PFD/ND, trajectoires, liens) | Accents primaires |
| `--accent-amber` | `#ffb454` | Ambre d'alerte & sélecteur (caution light, badges majeurs) | Points chauds & distinctions |
| `--accent-green` | `#3cd070` | Vert instrument (systèmes opérationnels, mentions TB) | Validation & statuts actifs |
| `--accent-roblox` | `#e2231a` | Rouge brique Roblox (accent spécifique Roblox Studio) | Badges & tags Roblox |

---

## 3. Typographie

### 3.1 Familles de polices
1. **Police Display / Titres :** `'Space Grotesk'`, avec pile de secours :
   `'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
2. **Police Corps / Interface :** `'Inter'`, avec pile de secours :
   `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
3. **Police Technique / Instruments / Données :** Police monospace système :
   `'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Menlo, monospace`

### 3.2 Échelle Typographique (Mobile-first avec clamp)
- **Titre Hero (H1) :** `clamp(2.5rem, 6vw, 4.25rem)` — Graisse 700, interlettrage `-0.02em`
- **Titre de Section (H2) :** `clamp(1.75rem, 4vw, 2.5rem)` — Graisse 700
- **Sous-titre / Cartouche (H3) :** `clamp(1.2rem, 2.5vw, 1.45rem)` — Graisse 600
- **Corps de texte (P) :** `1rem (16px)` avec `line-height: 1.65` — Longueur maximale `68ch`
- **Petites mentions & Badges :** `0.85rem (13.6px)` — Graisse 500/600

---

## 4. Composants & Motifs Aéronautiques
1. **Grille Radar / Horizon :** Motifs SVG d'arrière-plan avec cercles concentriques et radiaux très estompés (`opacity: 0.04`).
2. **Badge d'état :** Puce lumineuse avec pulsation verte (`box-shadow: 0 0 10px rgba(60, 208, 112, 0.6)`).
3. **Cartes Projets :** Angle biseauté subtil ou coins adoucis (`border-radius: 12px`), bordure fine réactive au survol et effet tilt 3D géré au pointeur.
4. **Chronologie horizontale :** Trait continu reliant les balises de vol (BIA, brevets, stages, baptêmes de l'air). La section se fige à l'écran : le scroll vertical (vers le bas) fait glisser la chronologie vers la droite ; repli en défilement horizontal natif (mouvement réduit / sans JS).
5. **Icônes :** Fichiers SVG de `assets/icons/` (avion, logo Roblox Studio, code, outils, GitHub, Discord) chargés en `<img>` — pas de `mask-image`, pour rester affichables en ouverture locale (`file://`).
6. **Barres de Télémétrie :** Jauges horizontales progressives avec indicateur de pourcentage façon instrument numérique.

---

## 5. Principes d'Animation & Performance
- **Propriétés autorisées pour l'animation :** Uniquement `transform` et `opacity` afin d'exploiter l'accélération matérielle (GPU) sans déclencher de reflow/repaint.
- **Défilement & Révélation :** Utilisation d'`IntersectionObserver` pour déclencher les apparitions une seule fois avec un seuil de 15%.
- **Curseur personnalisé :** Activé uniquement sur les périphériques disposant d'un pointeur précis (`@media (hover: hover) and (pointer: fine)`). Déconnecté sur écran tactile. Le curseur natif est masqué (`body.cursor-active`) pour ne laisser que le curseur custom.
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

### 7.3 Ajout / suppression
1. **Ajouter** : copier `_template.json` vers `05-mon-projet.json`, remplir les champs, ajouter `"05-mon-projet.json"` dans `_index.json`.
2. **Supprimer** : retirer la ligne dans `_index.json` (et, si on veut, le fichier JSON).
3. Les onglets de filtre sont **générés automatiquement** à partir des catégories présentes : un projet en `"category": "web"` crée l'onglet « Web ».

### 7.4 Repli hors-ligne (contrainte double-clic)
Les navigateurs (Chrome, Firefox…) interdisent toute requête vers un fichier local en `file://` (origine `null`, politique CORS) : `fetch()` sur les `.json` échoue donc en double-clic sur `index.html`.

- **En double-clic** : la section Projets affiche les projets de secours (`PROJETS_DE_SECOURS` dans `script.js`, copie des mêmes données) et un bandeau ambre explique la situation.
- **Via un serveur local** (`./demarrer.sh` sous Linux/macOS, `demarrer.bat` sous Windows, soit `python3 -m http.server`) ou une fois **hébergé en ligne**, les `.json` se chargent et les projets personnels s'affichent.
- **GitHub Pages : `.nojekyll` à la racine est obligatoire.** Pages construit les sites avec Jekyll, qui ignore les fichiers dont le nom commence par un underscore (`_index.json` en 404). `.nojekyll` indique à Pages de servir les fichiers tels quels.
- Le bandeau s'adapte à la cause : en `file://` il parle du double-clic et de `demarrer.sh` ; hébergé, il invite à vérifier que les `.json` sont commités et poussés.
- Un fichier cassé ou absent n'empêche pas les autres : il est signalé dans la console et ignoré.
- Tout texte issu des JSON est échappé (`escapeHtml` / `escapeAttr`) avant injection dans le DOM.

---
