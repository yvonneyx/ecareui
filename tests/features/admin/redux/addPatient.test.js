import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_ADD_PATIENT_BEGIN,
  ADMIN_ADD_PATIENT_SUCCESS,
  ADMIN_ADD_PATIENT_FAILURE,
  ADMIN_ADD_PATIENT_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  addPatient,
  dismissAddPatientError,
  reducer,
} from '../../../../src/features/admin/redux/addPatient';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/addPatient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addPatient succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addPatient())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_ADD_PATIENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_ADD_PATIENT_SUCCESS);
      });
  });

  it('dispatches failure action when addPatient fails', () => {
    const store = mockStore({});

    return store.dispatch(addPatient({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_ADD_PATIENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_ADD_PATIENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddPatientError', () => {
    const expectedAction = {
      type: ADMIN_ADD_PATIENT_DISMISS_ERROR,
    };
    expect(dismissAddPatientError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_ADD_PATIENT_BEGIN correctly', () => {
    const prevState = { addPatientPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_PATIENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPatientPending).toBe(true);
  });

  it('handles action type ADMIN_ADD_PATIENT_SUCCESS correctly', () => {
    const prevState = { addPatientPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_PATIENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPatientPending).toBe(false);
  });

  it('handles action type ADMIN_ADD_PATIENT_FAILURE correctly', () => {
    const prevState = { addPatientPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_PATIENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPatientPending).toBe(false);
    expect(state.addPatientError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_ADD_PATIENT_DISMISS_ERROR correctly', () => {
    const prevState = { addPatientError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_PATIENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPatientError).toBe(null);
  });
});

