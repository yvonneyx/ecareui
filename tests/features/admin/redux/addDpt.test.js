import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_ADD_DPT_BEGIN,
  ADMIN_ADD_DPT_SUCCESS,
  ADMIN_ADD_DPT_FAILURE,
  ADMIN_ADD_DPT_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  addDpt,
  dismissAddDptError,
  reducer,
} from '../../../../src/features/admin/redux/addDpt';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/addDpt', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addDpt succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addDpt())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_ADD_DPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_ADD_DPT_SUCCESS);
      });
  });

  it('dispatches failure action when addDpt fails', () => {
    const store = mockStore({});

    return store.dispatch(addDpt({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_ADD_DPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_ADD_DPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddDptError', () => {
    const expectedAction = {
      type: ADMIN_ADD_DPT_DISMISS_ERROR,
    };
    expect(dismissAddDptError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_ADD_DPT_BEGIN correctly', () => {
    const prevState = { addDptPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_DPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addDptPending).toBe(true);
  });

  it('handles action type ADMIN_ADD_DPT_SUCCESS correctly', () => {
    const prevState = { addDptPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_DPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addDptPending).toBe(false);
  });

  it('handles action type ADMIN_ADD_DPT_FAILURE correctly', () => {
    const prevState = { addDptPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_DPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addDptPending).toBe(false);
    expect(state.addDptError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_ADD_DPT_DISMISS_ERROR correctly', () => {
    const prevState = { addDptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_DPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addDptError).toBe(null);
  });
});

