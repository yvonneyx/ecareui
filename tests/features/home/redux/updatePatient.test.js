import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPDATE_PATIENT_BEGIN,
  HOME_UPDATE_PATIENT_SUCCESS,
  HOME_UPDATE_PATIENT_FAILURE,
  HOME_UPDATE_PATIENT_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  updatePatient,
  dismissUpdatePatientError,
  reducer,
} from '../../../../src/features/home/redux/updatePatient';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/updatePatient', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updatePatient succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updatePatient())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_PATIENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_PATIENT_SUCCESS);
      });
  });

  it('dispatches failure action when updatePatient fails', () => {
    const store = mockStore({});

    return store.dispatch(updatePatient({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_PATIENT_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_PATIENT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdatePatientError', () => {
    const expectedAction = {
      type: HOME_UPDATE_PATIENT_DISMISS_ERROR,
    };
    expect(dismissUpdatePatientError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPDATE_PATIENT_BEGIN correctly', () => {
    const prevState = { updatePatientPending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PATIENT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePatientPending).toBe(true);
  });

  it('handles action type HOME_UPDATE_PATIENT_SUCCESS correctly', () => {
    const prevState = { updatePatientPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PATIENT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePatientPending).toBe(false);
  });

  it('handles action type HOME_UPDATE_PATIENT_FAILURE correctly', () => {
    const prevState = { updatePatientPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PATIENT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePatientPending).toBe(false);
    expect(state.updatePatientError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPDATE_PATIENT_DISMISS_ERROR correctly', () => {
    const prevState = { updatePatientError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PATIENT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePatientError).toBe(null);
  });
});

