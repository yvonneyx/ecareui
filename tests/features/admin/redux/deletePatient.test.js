import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_DELETE_PATIENT_BEGIN,
  ADMIN_DELETE_PATIENT_SUCCESS,
  ADMIN_DELETE_PATIENT_FAILURE,
  ADMIN_DELETE_PATIENT_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  deletePatient,
  dismissDeletePatientError,
  reducer,
} from '../../../../src/features/admin/redux/deletePatient';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/deletePatient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deletePatient succeeds', () => {
    const store = mockStore({});

    return store.dispatch(deletePatient())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_DELETE_PATIENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_DELETE_PATIENT_SUCCESS);
      });
  });

  it('dispatches failure action when deletePatient fails', () => {
    const store = mockStore({});

    return store.dispatch(deletePatient({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_DELETE_PATIENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_DELETE_PATIENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeletePatientError', () => {
    const expectedAction = {
      type: ADMIN_DELETE_PATIENT_DISMISS_ERROR,
    };
    expect(dismissDeletePatientError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_DELETE_PATIENT_BEGIN correctly', () => {
    const prevState = { deletePatientPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_PATIENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePatientPending).toBe(true);
  });

  it('handles action type ADMIN_DELETE_PATIENT_SUCCESS correctly', () => {
    const prevState = { deletePatientPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_PATIENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePatientPending).toBe(false);
  });

  it('handles action type ADMIN_DELETE_PATIENT_FAILURE correctly', () => {
    const prevState = { deletePatientPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_PATIENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePatientPending).toBe(false);
    expect(state.deletePatientError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_DELETE_PATIENT_DISMISS_ERROR correctly', () => {
    const prevState = { deletePatientError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_PATIENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deletePatientError).toBe(null);
  });
});

