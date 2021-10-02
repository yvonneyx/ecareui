import { WelcomePage } from './';

export default {
  path: '',
  childRoutes: [
    {
      path: 'welcome-page',
      component: WelcomePage,
      isIndex: true,
      protected: true,
      role: 'admin',
    },
  ],
};
