import { WelcomePage, Login, VsDetailForms } from './';

export default {
  path: '',
  childRoutes: [
    {
      path: 'welcome-page',
      component: WelcomePage,
      protected: true,
      role: 'admin',
    },
    { path: 'login', component: Login, isIndex: true },
    { path: 'test', component: VsDetailForms },
  ],
};
