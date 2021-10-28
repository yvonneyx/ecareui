import initialState from './initialState';
import { reducer as loginReducer } from './login';
import { reducer as addPatientReducer } from './addPatient';
import { reducer as deletePatientReducer } from './deletePatient';
import { reducer as getPatientsListReducer } from './getPatientsList';
import { reducer as updatePatientReducer } from './updatePatient';
import { reducer as addVisiteReducer } from './addVisite';
import { reducer as deleteVisiteReducer } from './deleteVisite';
import { reducer as updateVisiteReducer } from './updateVisite';
import { reducer as getVisitesListReducer } from './getVisitesList';
import { reducer as findVssByOrdIdReducer } from './findVssByOrdId';
import { reducer as getOrdonnancesListReducer } from './getOrdonnancesList';
import { reducer as updateOrdonnanceReducer } from './updateOrdonnance';
import { reducer as findVsByVsIdReducer } from './findVsByVsId';
import { reducer as findOrdByOrdIdReducer } from './findOrdByOrdId';

const reducers = [
  loginReducer,
  addPatientReducer,
  deletePatientReducer,
  getPatientsListReducer,
  updatePatientReducer,
  addVisiteReducer,
  deleteVisiteReducer,
  updateVisiteReducer,
  getVisitesListReducer,
  findVssByOrdIdReducer,
  getOrdonnancesListReducer,
  updateOrdonnanceReducer,
  findVsByVsIdReducer,
  findOrdByOrdIdReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
