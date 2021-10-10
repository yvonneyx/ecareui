import initialState from './initialState';
import { reducer as loginReducer } from './login';
import { reducer as addPatientReducer } from './addPatient';
import { reducer as deletePatientReducer } from './deletePatient';
import { reducer as getPatientsListReducer } from './getPatientsList';
import { reducer as updatePatientReducer } from './updatePatient';

const reducers = [
  loginReducer,
  addPatientReducer,
  deletePatientReducer,
  getPatientsListReducer,
  updatePatientReducer,
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
