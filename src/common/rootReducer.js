import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import { connectRouter } from 'connected-react-router'
import history from './history';
import homeReducer from '../features/home/redux/reducer';
import commonReducer from '../features/common/redux/reducer';
import adminReducer from '../features/admin/redux/reducer';
import coordinateurReducer from '../features/coordinateur/redux/reducer';
import infirmiereReducer from '../features/infirmiere/redux/reducer';

const reducerMap = {
  router: connectRouter(history),
  home: homeReducer,
  common: commonReducer,
  admin: adminReducer,
  coordinateur: coordinateurReducer,
  infirmiere: infirmiereReducer,
};

export default combineReducers(reducerMap);
