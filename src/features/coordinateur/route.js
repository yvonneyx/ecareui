// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import { Layout, PatientMngWrapper, NouvelleOrdonnance, NouvelleVisite } from './';

export default {
  path: 'coordinateur',
  component: Layout,
  childRoutes: [
    { path: 'gestion-des-patients', component: PatientMngWrapper, protected: true, role: 'coor' },
    { path: 'nouvelle-ordonnance', component: NouvelleOrdonnance },
    { path: 'nouvelle-visite', component: NouvelleVisite },
  ],
};
