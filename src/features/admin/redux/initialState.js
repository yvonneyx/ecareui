// Initial state is the place you define all initial values for the Redux store of the feature.
// In the 'standard' way, initialState is defined in reducers: http://redux.js.org/docs/basics/Reducers.html
// But when application grows, there will be multiple reducers files, it's not intuitive what data is managed by the whole store.
// So Rekit extracts the initial state definition into a separate module so that you can have
// a quick view about what data is used for the feature, at any time.

// NOTE: initialState constant is necessary so that Rekit could auto add initial state when creating async actions.
const initialState = {
  getUsersListPending: false,
  getUsersListError: null,
  addUserPending: false,
  addUserError: null,
  deleteUserPending: false,
  deleteUserError: null,
  updateUserPending: false,
  updateUserError: null,
  addExamenPending: false,
  addExamenError: null,
  deleteExamenPending: false,
  deleteExamenError: null,
  updateExamenPending: false,
  updateExamenError: null,
  getExamensListPending: false,
  getExamensListError: null,
  addDptPending: false,
  addDptError: null,
  getDptsListPending: false,
  getDptsListError: null,
  deleteDptPending: false,
  deleteDptError: null,
  updateDptPending: false,
  updateDptError: null,
};

export default initialState;
