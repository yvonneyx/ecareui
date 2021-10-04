import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_GET_USERS_LIST_BEGIN,
  ADMIN_GET_USERS_LIST_SUCCESS,
  ADMIN_GET_USERS_LIST_FAILURE,
  ADMIN_GET_USERS_LIST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  getUsersList,
  dismissGetUsersListError,
  reducer,
} from '../../../../src/features/admin/redux/getUsersList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/getUsersList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getUsersList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getUsersList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_USERS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_USERS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getUsersList fails', () => {
    const store = mockStore({});

    return store.dispatch(getUsersList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_USERS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_USERS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetUsersListError', () => {
    const expectedAction = {
      type: ADMIN_GET_USERS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetUsersListError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_GET_USERS_LIST_BEGIN correctly', () => {
    const prevState = { getUsersListPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_USERS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getUsersListPending).toBe(true);
  });

  it('handles action type ADMIN_GET_USERS_LIST_SUCCESS correctly', () => {
    const prevState = { getUsersListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_USERS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getUsersListPending).toBe(false);
  });

  it('handles action type ADMIN_GET_USERS_LIST_FAILURE correctly', () => {
    const prevState = { getUsersListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_USERS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getUsersListPending).toBe(false);
    expect(state.getUsersListError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_GET_USERS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getUsersListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_USERS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getUsersListError).toBe(null);
  });
});

