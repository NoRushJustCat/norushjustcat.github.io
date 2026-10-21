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
4. **Timeline Altimétrique :** Trait vertical continu reliant les balises de vol (BIA, brevets, stages, baptêmes de l'air), avec balise avion qui descend au scroll.
5. **Barres de Télémétrie :** Jauges horizontales progressives avec indicateur de pourcentage façon instrument numérique.

---

## 5. Principes d'Animation & Performance
- **Propriétés autorisées pour l'animation :** Uniquement `transform` et `opacity` afin d'exploiter l'accélération matérielle (GPU) sans déclencher de reflow/repaint.
- **Défilement & Révélation :** Utilisation d'`IntersectionObserver` pour déclencher les apparitions une seule fois avec un seuil de 15%.
- **Curseur personnalisé :** Activé uniquement sur les périphériques disposant d'un pointeur précis (`@media (hover: hover) and (pointer: fine)`). Déconnecté sur écran tactile.
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
