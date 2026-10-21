#!/usr/bin/env sh
# ------------------------------------------------------------------
# demarrer.sh — Lance un mini serveur local pour le portfolio.
#
# Pourquoi ? En double-cliquant sur index.html (file://), Chrome interdit
# de lire les fichiers assets/projects/*.json. Ce serveur rend les requêtes
# possibles : les projets JSON personnels s'affichent alors normalement.
#
# Usage : ./demarrer.sh        (site sur http://localhost:8000)
#         ./demarrer.sh 3000   (autre port)
# Arrêt : Ctrl + C dans ce terminal.
# ------------------------------------------------------------------
set -e

cd "$(dirname "$0")"

PORT="${1:-8000}"

echo ""
echo "  Portfolio NoRushJustChat"
echo "  → Ouvre http://localhost:$PORT dans ton navigateur"
echo "  → Arrêt : Ctrl + C"
echo ""

# Ouvre le navigateur automatiquement (silencieux si indisponible)
if command -v xdg-open >/dev/null 2>&1; then
  (sleep 1 && xdg-open "http://localhost:$PORT") >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  (sleep 1 && open "http://localhost:$PORT") >/dev/null 2>&1 &
fi

# Petite protection : python3 est obligatoire ici
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 introuvable. Installe-le, ou lance manuellement :"
  echo "  npx serve .   (si Node.js est installé)"
  exit 1
fi

python3 -m http.server "$PORT"
