import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_GET_PATIENTS_LIST_BEGIN,
  ADMIN_GET_PATIENTS_LIST_SUCCESS,
  ADMIN_GET_PATIENTS_LIST_FAILURE,
  ADMIN_GET_PATIENTS_LIST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  getPatientsList,
  dismissGetPatientsListError,
  reducer,
} from '../../../../src/features/admin/redux/getPatientsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/getPatientsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getPatientsList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getPatientsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_PATIENTS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_PATIENTS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getPatientsList fails', () => {
    const store = mockStore({});

    return store.dispatch(getPatientsList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_PATIENTS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_PATIENTS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetPatientsListError', () => {
    const expectedAction = {
      type: ADMIN_GET_PATIENTS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetPatientsListError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_GET_PATIENTS_LIST_BEGIN correctly', () => {
    const prevState = { getPatientsListPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_PATIENTS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPatientsListPending).toBe(true);
  });

  it('handles action type ADMIN_GET_PATIENTS_LIST_SUCCESS correctly', () => {
    const prevState = { getPatientsListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_PATIENTS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPatientsListPending).toBe(false);
  });

  it('handles action type ADMIN_GET_PATIENTS_LIST_FAILURE correctly', () => {
    const prevState = { getPatientsListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_PATIENTS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPatientsListPending).toBe(false);
    expect(state.getPatientsListError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_GET_PATIENTS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getPatientsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_PATIENTS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getPatientsListError).toBe(null);
  });
});

