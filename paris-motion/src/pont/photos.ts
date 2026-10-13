// Photos de la version « vraies images ». Dépose les fichiers dans public/photos/pont/
// avec exactement ces noms (format .jpg, idéalement 1920 px de large ou plus).
// Pense à remplir `credit` : les licences Creative Commons obligent à citer l'auteur.

export type Photo = {
  file: string;
  from: number; // image de début (30 images = 1 s)
  to: number; // image de fin
  description: string; // ce que la photo doit montrer
  credit: string; // ex. « Photo : Jean Dupont, CC BY-SA 4.0, Wikimedia Commons »
  zoom: [number, number]; // zoom lent (début → fin)
  pan: [[number, number], [number, number]]; // décalage en % (début → fin)
};

export const PHOTOS: Photo[] = [
  {file: '1-vue-generale.jpg', from: 0, to: 205, description: "Le pont des Arts en entier, avec la coupole de l'Institut de France", credit: '', zoom: [1.18, 1.06], pan: [[0, 0], [0, 0]]},
  {file: '2-tableau-renoir.jpg', from: 180, to: 345, description: 'Tableau « Le Pont des Arts » de Renoir (1867-1868), domaine public', credit: 'Auguste Renoir, Le Pont des Arts (1867-1868), domaine public', zoom: [1.04, 1.14], pan: [[-2, 0], [2, -1]]},
  {file: '3-louvre.jpg', from: 320, to: 515, description: 'La façade du Louvre vue depuis le pont ou les quais', credit: '', zoom: [1.12, 1.02], pan: [[2, 0], [-2, 0]]},
  {file: '4-arches.jpg', from: 490, to: 880, description: 'Les arches du pont vues de côté, depuis le quai', credit: '', zoom: [1.02, 1.16], pan: [[0, 0], [-3, -2]]},
  {file: '5-cadenas-gros-plan.jpg', from: 855, to: 1065, description: 'Gros plan sur des cadenas accrochés au grillage', credit: '', zoom: [1.06, 1.2], pan: [[0, 0], [1, -1]]},
  {file: '6-cadenas-pont.jpg', from: 1040, to: 1400, description: 'Le grillage du pont couvert de cadenas (photo des années 2010)', credit: '', zoom: [1.2, 1.04], pan: [[-2, 1], [2, 0]]},
  {file: '7-panneaux-verre.jpg', from: 1375, to: 1570, description: "Le pont aujourd'hui, avec ses panneaux de verre", credit: '', zoom: [1.04, 1.14], pan: [[0, 0], [-2, 0]]},
  {file: '8-coucher-soleil.jpg', from: 1545, to: 1800, description: 'Le pont des Arts au coucher du soleil ou de nuit', credit: '', zoom: [1.16, 1.04], pan: [[0, 1], [0, 0]]},
];
