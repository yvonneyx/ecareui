import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_UPDATE_DPT_BEGIN,
  ADMIN_UPDATE_DPT_SUCCESS,
  ADMIN_UPDATE_DPT_FAILURE,
  ADMIN_UPDATE_DPT_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  updateDpt,
  dismissUpdateDptError,
  reducer,
} from '../../../../src/features/admin/redux/updateDpt';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/updateDpt', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateDpt succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateDpt())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_DPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_DPT_SUCCESS);
      });
  });

  it('dispatches failure action when updateDpt fails', () => {
    const store = mockStore({});

    return store.dispatch(updateDpt({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_DPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_DPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateDptError', () => {
    const expectedAction = {
      type: ADMIN_UPDATE_DPT_DISMISS_ERROR,
    };
    expect(dismissUpdateDptError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_UPDATE_DPT_BEGIN correctly', () => {
    const prevState = { updateDptPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_DPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateDptPending).toBe(true);
  });

  it('handles action type ADMIN_UPDATE_DPT_SUCCESS correctly', () => {
    const prevState = { updateDptPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_DPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateDptPending).toBe(false);
  });

  it('handles action type ADMIN_UPDATE_DPT_FAILURE correctly', () => {
    const prevState = { updateDptPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_DPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateDptPending).toBe(false);
    expect(state.updateDptError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_UPDATE_DPT_DISMISS_ERROR correctly', () => {
    const prevState = { updateDptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_DPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateDptError).toBe(null);
  });
});

