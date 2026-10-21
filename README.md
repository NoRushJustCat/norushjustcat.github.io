# Portfolio — NoRushJustChat

Mon portfolio. Une seule page en HTML, CSS et JavaScript, sans framework ni build.

Le thème : un cockpit d'avion de nuit croisé avec le développement Roblox Studio. Concrètement, il y a un écran de chargement façon avionique, un curseur personnalisé, une chronologie qui glisse vers la droite pendant qu'on descend la page, et une grille de projets chargée depuis des fichiers .json (un fichier par projet, dans `assets/projects/`).

## Voir le site

https://norushjustcat.github.io/

En local, un double-clic sur `index.html` suffit. Le navigateur (Chrome comme Firefox) refusant de lire les .json locaux dans ce cas, le site affiche alors ses projets intégrés. Pour tout voir :

```
./demarrer.sh          (Windows : demarrer.bat, sinon python3 -m http.server 8000)
```

puis ouvrir http://localhost:8000. Une fois le site hébergé, plus rien à lancer.

## Ajouter ou retirer un projet

Copie `assets/projects/_template.json` vers un nouveau fichier qui ne commence pas par un underscore (`05-mon-projet.json` par exemple), remplis les champs, puis ajoute son nom dans `assets/projects/_index.json`. Les onglets de filtre se créent tout seuls d'après les catégories utilisées. Pour retirer un projet, enlève sa ligne dans `_index.json`.

Pense à committer les fichiers de projets, sinon ils ne partent pas vers GitHub Pages.

Le `.nojekyll` à la racine est là pour ça : sans lui, GitHub Pages passe par Jekyll et ignore tout fichier commençant par un underscore, donc `_index.json`.

## Pour bricoler

Les couleurs se règlent dans les variables `:root` de `style.css`. Toute la logique (curseur, scroll, canvas, filtres, chargement des projets) est dans `script.js`, commentée en français. Le système de design complet est documenté dans [DESIGN.md](DESIGN.md).

© NoRushJustChat
