import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_UPDATE_EXAMEN_BEGIN,
  ADMIN_UPDATE_EXAMEN_SUCCESS,
  ADMIN_UPDATE_EXAMEN_FAILURE,
  ADMIN_UPDATE_EXAMEN_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  updateExamen,
  dismissUpdateExamenError,
  reducer,
} from '../../../../src/features/admin/redux/updateExamen';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/updateExamen', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateExamen succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateExamen())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_EXAMEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_EXAMEN_SUCCESS);
      });
  });

  it('dispatches failure action when updateExamen fails', () => {
    const store = mockStore({});

    return store.dispatch(updateExamen({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_EXAMEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_EXAMEN_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateExamenError', () => {
    const expectedAction = {
      type: ADMIN_UPDATE_EXAMEN_DISMISS_ERROR,
    };
    expect(dismissUpdateExamenError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_UPDATE_EXAMEN_BEGIN correctly', () => {
    const prevState = { updateExamenPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_EXAMEN_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateExamenPending).toBe(true);
  });

  it('handles action type ADMIN_UPDATE_EXAMEN_SUCCESS correctly', () => {
    const prevState = { updateExamenPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_EXAMEN_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateExamenPending).toBe(false);
  });

  it('handles action type ADMIN_UPDATE_EXAMEN_FAILURE correctly', () => {
    const prevState = { updateExamenPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_EXAMEN_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateExamenPending).toBe(false);
    expect(state.updateExamenError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_UPDATE_EXAMEN_DISMISS_ERROR correctly', () => {
    const prevState = { updateExamenError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_EXAMEN_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateExamenError).toBe(null);
  });
});

