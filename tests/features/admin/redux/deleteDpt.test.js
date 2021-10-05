import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_DELETE_DPT_BEGIN,
  ADMIN_DELETE_DPT_SUCCESS,
  ADMIN_DELETE_DPT_FAILURE,
  ADMIN_DELETE_DPT_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  deleteDpt,
  dismissDeleteDptError,
  reducer,
} from '../../../../src/features/admin/redux/deleteDpt';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/deleteDpt', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteDpt succeeds', () => {
    const store = mockStore({});

    return store.dispatch(deleteDpt())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_DELETE_DPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_DELETE_DPT_SUCCESS);
      });
  });

  it('dispatches failure action when deleteDpt fails', () => {
    const store = mockStore({});

    return store.dispatch(deleteDpt({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_DELETE_DPT_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_DELETE_DPT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteDptError', () => {
    const expectedAction = {
      type: ADMIN_DELETE_DPT_DISMISS_ERROR,
    };
    expect(dismissDeleteDptError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_DELETE_DPT_BEGIN correctly', () => {
    const prevState = { deleteDptPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_DPT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteDptPending).toBe(true);
  });

  it('handles action type ADMIN_DELETE_DPT_SUCCESS correctly', () => {
    const prevState = { deleteDptPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_DPT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteDptPending).toBe(false);
  });

  it('handles action type ADMIN_DELETE_DPT_FAILURE correctly', () => {
    const prevState = { deleteDptPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_DPT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteDptPending).toBe(false);
    expect(state.deleteDptError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_DELETE_DPT_DISMISS_ERROR correctly', () => {
    const prevState = { deleteDptError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_DPT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteDptError).toBe(null);
  });
});

