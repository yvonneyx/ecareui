import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_GET_DPTS_LIST_BEGIN,
  ADMIN_GET_DPTS_LIST_SUCCESS,
  ADMIN_GET_DPTS_LIST_FAILURE,
  ADMIN_GET_DPTS_LIST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  getDptsList,
  dismissGetDptsListError,
  reducer,
} from '../../../../src/features/admin/redux/getDptsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/getDptsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getDptsList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getDptsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_DPTS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_DPTS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getDptsList fails', () => {
    const store = mockStore({});

    return store.dispatch(getDptsList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_DPTS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_DPTS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetDptsListError', () => {
    const expectedAction = {
      type: ADMIN_GET_DPTS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetDptsListError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_GET_DPTS_LIST_BEGIN correctly', () => {
    const prevState = { getDptsListPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_DPTS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getDptsListPending).toBe(true);
  });

  it('handles action type ADMIN_GET_DPTS_LIST_SUCCESS correctly', () => {
    const prevState = { getDptsListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_DPTS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getDptsListPending).toBe(false);
  });

  it('handles action type ADMIN_GET_DPTS_LIST_FAILURE correctly', () => {
    const prevState = { getDptsListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_DPTS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getDptsListPending).toBe(false);
    expect(state.getDptsListError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_GET_DPTS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getDptsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_DPTS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getDptsListError).toBe(null);
  });
});

