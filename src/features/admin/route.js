// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import {
  Layout,
  UserMngPage,
  ExamenMngPage,
  DptMngPage,
  CoorMngPage,
  PatientMngPage,
  InfirMngPage,
} from './';

export default {
  path: 'admin',
  component: Layout,
  childRoutes: [
    { path: 'gestion-des-utilisateurs', component: UserMngPage, isIndex: true },
    { path: 'gestion-des-examens', component: ExamenMngPage },
    { path: 'gestion-des-departements', component: DptMngPage },
    { path: 'gestion-des-coordinateurs/:userId?', component: CoorMngPage },
    { path: 'gestion-des-infirmieres/:userId?', component: InfirMngPage },
    { path: 'gestion-des-patients', component: PatientMngPage },
  ],
};
