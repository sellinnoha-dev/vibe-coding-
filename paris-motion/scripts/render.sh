#!/usr/bin/env bash
# Exporte les vidéos finales (MP4 H.264, 1920x1080, 30 i/s, audio AAC).
#   bash scripts/render.sh            -> 3 versions : voix guide, sans voix, ta voix (si enregistrée)
#   BROWSER=/chemin/vers/chrome bash scripts/render.sh   (facultatif : navigateur à utiliser)
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
EXTRA=()
[ -n "${BROWSER:-}" ] && EXTRA+=(--browser-executable="$BROWSER")

[ -f public/audio/musique.wav ] || python3 scripts/generate_music.py

npx remotion render src/index.ts ParisMotion out/paris-motion_voix-guide.mp4 --props='{"voix":"guide","musique":true}' "${EXTRA[@]}"
npx remotion render src/index.ts ParisMotion out/paris-motion_sans-voix.mp4 --props='{"voix":"aucune","musique":true}' "${EXTRA[@]}"
if ls public/voix/perso/scene{1,2,3,4,5,6}.wav >/dev/null 2>&1; then
  npx remotion render src/index.ts ParisMotion out/paris-motion_FINAL.mp4 --props='{"voix":"perso","musique":true}' "${EXTRA[@]}"
else
  echo "Astuce : enregistre public/voix/perso/scene1.wav ... scene6.wav pour obtenir out/paris-motion_FINAL.mp4"
fi
