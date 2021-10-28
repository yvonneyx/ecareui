// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

import { Layout, SingleVsDtlWrapper, OrdWithVsDtlWrapper, VsSummaryPage } from './';

export default {
  path: 'infirmiere',
  component: Layout,
  childRoutes: [
    { path: 'ordonnance/:ordonnanceId/visite/:visiteId', component: SingleVsDtlWrapper },
    { path: 'ordonnance/:ordonnanceId', component: OrdWithVsDtlWrapper },
    { path: 'visite-summary', component: VsSummaryPage },
  ],
};
