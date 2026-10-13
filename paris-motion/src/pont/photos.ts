// Photos de la version « vraies images » (dossier public/photos/pont/).
// mode 'full' : plein écran avec zoom lent. mode 'card' : photo encadrée posée sur un fond flouté
// (utile pour les petites images, qui seraient floues en plein écran).

export type Photo = {
  file: string;
  from: number; // image de début (30 images = 1 s)
  to: number; // image de fin
  mode: 'full' | 'card';
  credit: string; // crédit affiché en bas à droite
  legend?: string; // légende sous une carte
  zoom: [number, number];
  pan: [[number, number], [number, number]]; // décalage en % (début → fin)
  frame?: 'gold' | 'white';
  rot?: number; // inclinaison de la carte (degrés)
  cardH?: number; // hauteur de la carte (px)
  cardY?: number; // centre vertical de la carte (px)
};

export const PHOTOS: Photo[] = [
  {file: '1-vue-generale.jpg', from: 0, to: 205, mode: 'full', credit: '', zoom: [1.16, 1.05], pan: [[0, 0], [0, 0]]},
  {file: '2-tableau-renoir.jpg', from: 180, to: 345, mode: 'card', frame: 'gold', rot: 0, cardH: 470, cardY: 560, credit: '', legend: 'Auguste Renoir, « Le Pont-Neuf » (1872) : Paris au XIXᵉ siècle, juste à côté du pont des Arts', zoom: [1, 1.05], pan: [[0, 0], [0, 0]]},
  {file: '1-vue-generale.jpg', from: 320, to: 515, mode: 'full', credit: '', zoom: [1.7, 1.55], pan: [[-16, -12], [-20, -14]]},
  {file: '4-arches.jpg', from: 490, to: 880, mode: 'card', frame: 'white', rot: -1.5, cardH: 330, cardY: 470, credit: '', zoom: [1, 1.06], pan: [[0, 0], [0, 0]]},
  {file: '5-cadenas-gros-plan.jpg', from: 855, to: 1065, mode: 'card', frame: 'white', rot: 2, cardH: 430, cardY: 600, credit: '', zoom: [1, 1.08], pan: [[0, 0], [0, 0]]},
  {file: '6-cadenas-pont.jpg', from: 1040, to: 1400, mode: 'full', credit: '', zoom: [1.12, 1.02], pan: [[-2, 1], [2, 0]]},
  {file: '7-panneaux-verre.jpg', from: 1375, to: 1570, mode: 'full', credit: 'Photo : © Véronique Meflah', zoom: [1.04, 1.14], pan: [[0, 0], [-2, 0]]},
  {file: '8-coucher-soleil.jpg', from: 1545, to: 1800, mode: 'full', credit: '', zoom: [1.14, 1.03], pan: [[0, 1], [0, 0]]},
];
