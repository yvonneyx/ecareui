import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_UPDATE_USER_BEGIN,
  ADMIN_UPDATE_USER_SUCCESS,
  ADMIN_UPDATE_USER_FAILURE,
  ADMIN_UPDATE_USER_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  updateUser,
  dismissUpdateUserError,
  reducer,
} from '../../../../src/features/admin/redux/updateUser';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/updateUser', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateUser succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateUser())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_USER_SUCCESS);
      });
  });

  it('dispatches failure action when updateUser fails', () => {
    const store = mockStore({});

    return store.dispatch(updateUser({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_USER_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_USER_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateUserError', () => {
    const expectedAction = {
      type: ADMIN_UPDATE_USER_DISMISS_ERROR,
    };
    expect(dismissUpdateUserError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_UPDATE_USER_BEGIN correctly', () => {
    const prevState = { updateUserPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_USER_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserPending).toBe(true);
  });

  it('handles action type ADMIN_UPDATE_USER_SUCCESS correctly', () => {
    const prevState = { updateUserPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_USER_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserPending).toBe(false);
  });

  it('handles action type ADMIN_UPDATE_USER_FAILURE correctly', () => {
    const prevState = { updateUserPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserPending).toBe(false);
    expect(state.updateUserError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_UPDATE_USER_DISMISS_ERROR correctly', () => {
    const prevState = { updateUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_USER_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateUserError).toBe(null);
  });
});

