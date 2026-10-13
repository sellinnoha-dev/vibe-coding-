# Paris, une ville qui me fait rêver — motion design (60 s)

Projet scolaire de motion design réalisé en code avec **Remotion** (React + SVG), rendu en MP4 avec FFmpeg.
1920 × 1080 · 30 images/s · 60 s exactement (1800 images) · H.264 + AAC.

## Les vidéos
| Fichier | Contenu |
|---|---|
| `out/paris-motion_voix-guide.mp4` | Vidéo complète avec musique, effets et **voix de synthèse provisoire** (pour juger le rythme) |
| `out/paris-motion_sans-voix.mp4` | Vidéo complète avec musique et effets, **sans voix** (pour ajouter ta voix dans un logiciel de montage) |
| `out/paris-motion_FINAL.mp4` | Créée automatiquement quand tu as enregistré ta voix (voir plus bas) |

## Déroulé
| Temps | Scène | Raison d'aimer Paris | Transition vers la suite |
|---|---|---|---|
| 0–6 s | Introduction : titre, tour Eiffel, carte de France qui zoome sur Paris | — | Le point doré de Paris s'ouvre en cercle et devient le soleil |
| 6–17 s | Monuments : tour Eiffel puis Arc de Triomphe (zoom puis travelling arrière) | Une identité reconnaissable | Les corniches de l'Arc s'étirent et deviennent les étages des immeubles |
| 17–29 s | Architecture : façades haussmanniennes, quais, Seine, péniche | La beauté de la ville | Le soleil se couche, le décor reste le même |
| 29–41 s | Ambiance : ciel du soir, fenêtres et lampadaires allumés, reflets, passants, bateau-mouche | L'atmosphère du soir | Des fenêtres allumées se détachent et deviennent des tuiles |
| 41–52 s | Culture : musées, cafés, librairies, art, spectacles + ligne de métro des quartiers | Toujours quelque chose à découvrir | La ligne de métro devient l'horizon, les tuiles deviennent une frise |
| 52–60 s | Conclusion : panorama de nuit, tour Eiffel illuminée, message final | « Paris, bien plus qu'une ville : une atmosphère unique. » | Fondu doux vers le bleu nuit |

## Lancer le projet
Prérequis : Node.js 18+ (testé avec Node 22), Python 3 avec `numpy` et `scipy`.

```bash
cd paris-motion
npm install
npm run studio        # ouvre l'aperçu interactif dans le navigateur (lecture, timeline, modifications en direct)
```

## Exporter la vidéo en MP4
```bash
npm run render        # crée les MP4 dans out/
# ou une seule version :
npx remotion render src/index.ts ParisMotion out/video.mp4 --props='{"voix":"guide","musique":true}'
```
`voix` peut valoir `"guide"`, `"perso"` (ta voix) ou `"aucune"`. Si Remotion n'arrive pas à télécharger son navigateur,
ajoute `--browser-executable=/chemin/vers/chrome`.

## Enregistrer ta voix (recommandé pour le rendu final)
La voix guide est une synthèse vocale robotique (seule disponible hors ligne). Pour un vrai rendu :
1. Lis `narration/script_voix_off.md` : texte, temps de départ et durée max de chaque phrase.
2. Enregistre 6 fichiers et place-les dans `public/voix/perso/` : `scene1.wav` … `scene6.wav`.
   Depuis un MP3 / M4A de téléphone : `ffmpeg -i scene1.m4a -ar 44100 -ac 2 public/voix/perso/scene1.wav`
3. `npm run render` → `out/paris-motion_FINAL.mp4`. La musique baisse automatiquement sous ta voix.

Autre option : importer `out/paris-motion_sans-voix.mp4` dans CapCut, Premiere, DaVinci Resolve… et poser ta voix
aux temps indiqués (le fichier `narration/voix_off.srt` contient les mêmes temps, utilisable comme sous-titres).

## Musique et sons
- `public/audio/musique.wav` : musique originale **générée par code** (`scripts/generate_music.py`) : nappes, piano,
  basse douce, réverbération. Un changement d'accord tombe sur chaque changement de scène. Aucun droit d'auteur tiers.
- `public/audio/sfx/` : scintillement, cloche, souffle, générés par le même script.
- Pour utiliser une autre musique (libre de droits), remplace `public/audio/musique.wav` par ton fichier (même nom, en WAV).
- Polices : Playfair Display et Montserrat (licence libre SIL OFL), incluses dans `public/fonts/`.

## Organisation du code
```
src/
  Root.tsx, index.ts        composition Remotion (1920x1080, 30 i/s, 1800 images)
  ParisVideo.tsx            empilement des scènes, audio, grain, fondu final
  lib/timeline.ts           découpage des scènes et créneaux de voix
  lib/anim.ts               courbes ease-in-out, tracés progressifs
  lib/audio.ts              effets sonores et baisse auto de la musique sous la voix
  lib/theme.ts              palette (bleu nuit, crème, blanc, rouge, doré) et polices
  components/               tour Eiffel, Arc de Triomphe, carte de France, immeubles, passants,
                            pictogrammes, silhouette de Paris, textes animés
  scenes/                   S1Intro, S2Monuments, S34City (jour → nuit), S5Culture, S6Finale
scripts/                    musique, voix guide, export
narration/                  script de voix off, sous-titres .srt, texte .json
```

---

# Deuxième vidéo : « Le pont des Arts » (60 s)
Composition `PontDesArts` (code dans `src/pont/`). Même style et même découpage en 6 scènes : histoire (1804),
effondrement et reconstruction (1979 → 1984, 9 → 7 arches), cadenas d'amour, 45 tonnes et retrait (2014-2015), aujourd'hui.

- Texte de la voix off, temps et pas-à-pas CapCut : `narration/PONT_DES_ARTS_CapCut.md`
- Vidéos : `out/pont-des-arts_musique.mp4` (musique baissée sous la voix), `out/pont-des-arts_sans-son.mp4`, musique seule `out/pont-des-arts_musique-seule.wav`
- Regénérer la musique : `python3 scripts/generate_music.py pont`
- Exporter : `npx remotion render src/index.ts PontDesArts out/pont-des-arts_musique.mp4`
