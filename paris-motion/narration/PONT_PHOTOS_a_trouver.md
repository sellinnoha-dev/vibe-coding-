# Version « vraies photos » — état actuel

✅ Vidéo rendue : `out/pont-des-arts_photos.mp4` (avec musique) et `out/pont-des-arts_photos_sans-son.mp4`.
Photos fournies par Noha, intégrées dans `public/photos/pont/`. À citer dans ta bibliographie / ton oral :
- Le tableau est **« Le Pont-Neuf » d'Auguste Renoir (1872)**, domaine public (National Gallery of Art, Washington). Ce n'est pas le pont des Arts : la légende à l'écran le précise.
- Photo des panneaux de verre : © Véronique Meflah (crédit affiché à l'écran).
- Autres photos : note le site d'où tu les as prises pour les citer.

---

# Version « vraies photos » — les 8 photos à trouver

Dépose-les dans `public/photos/pont/` avec **exactement** ces noms (les images actuelles marquées « PHOTO À AJOUTER » sont provisoires),
puis remplis le crédit de chaque photo dans `src/pont/photos.ts`.

| Fichier | Ce que la photo doit montrer | Recherche conseillée sur commons.wikimedia.org |
|---|---|---|
| 1-vue-generale.jpg | Le pont en entier avec la coupole de l'Institut | `Pont des Arts Institut de France` |
| 2-tableau-renoir.jpg | Le tableau de Renoir (1867-1868), domaine public | `Renoir Pont des Arts` |
| 3-louvre.jpg | La façade du Louvre côté Seine | `Louvre Seine facade` |
| 4-arches.jpg | Les arches vues de côté, depuis le quai | `Pont des Arts arches` |
| 5-cadenas-gros-plan.jpg | Gros plan de cadenas | `Love locks Pont des Arts` |
| 6-cadenas-pont.jpg | Grillage couvert de cadenas | `Pont des Arts love locks 2014` |
| 7-panneaux-verre.jpg | Le pont avec ses panneaux de verre | `Pont des Arts glass panels` |
| 8-coucher-soleil.jpg | Le pont au coucher du soleil ou de nuit | `Pont des Arts sunset` ou `Pont des Arts night` |

Licences : prends des photos marquées **CC0**, **domaine public**, **CC BY** ou **CC BY-SA**, et cite l'auteur
(ex. « Photo : Nom, CC BY-SA 4.0, Wikimedia Commons »). Le crédit s'affiche alors en petit en bas à droite.

Rendu : `npx remotion render src/index.ts PontDesArtsPhotos out/pont-des-arts_photos.mp4`
