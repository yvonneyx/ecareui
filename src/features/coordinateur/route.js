// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  Layout,
  PatientMngWrapper,
  NouvelleOrdonnance,
  NouvelleVisite,
  VsMngWrapper,
  OrdMngWrapper,
  SingleVsDtlWrapper,
  OrdWithVsDtlWrapper,
} from './';

export default {
  path: 'coordinateur',
  component: Layout,
  protected: true,
  childRoutes: [
    { path: 'gestion-des-patients', component: PatientMngWrapper },
    { path: 'nouvelle-ordonnance', component: NouvelleOrdonnance },
    { path: 'nouvelle-visite', component: NouvelleVisite, isIndex: true },
    { path: 'gestion-des-visites', component: VsMngWrapper },
    { path: 'gestion-des-ordonnances', component: OrdMngWrapper },
    { path: 'ordonnance/:ordonnanceId/visite/:visiteId', component: SingleVsDtlWrapper },
    { path: 'ordonnance/:ordonnanceId', component: OrdWithVsDtlWrapper },
  ],
};
