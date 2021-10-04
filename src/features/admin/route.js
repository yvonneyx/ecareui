// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import { Layout, UserMngPage } from './';

export default {
  path: 'admin',
  component: Layout,
  childRoutes: [
    { path: 'gestion-des-utilisateurs', component: UserMngPage, isIndex: true },
  ],
};
