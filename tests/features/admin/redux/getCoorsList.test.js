import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_GET_COORS_LIST_BEGIN,
  ADMIN_GET_COORS_LIST_SUCCESS,
  ADMIN_GET_COORS_LIST_FAILURE,
  ADMIN_GET_COORS_LIST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  getCoorsList,
  dismissGetCoorsListError,
  reducer,
} from '../../../../src/features/admin/redux/getCoorsList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/getCoorsList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getCoorsList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getCoorsList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_COORS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_COORS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getCoorsList fails', () => {
    const store = mockStore({});

    return store.dispatch(getCoorsList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_COORS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_COORS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetCoorsListError', () => {
    const expectedAction = {
      type: ADMIN_GET_COORS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetCoorsListError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_GET_COORS_LIST_BEGIN correctly', () => {
    const prevState = { getCoorsListPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_COORS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCoorsListPending).toBe(true);
  });

  it('handles action type ADMIN_GET_COORS_LIST_SUCCESS correctly', () => {
    const prevState = { getCoorsListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_COORS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCoorsListPending).toBe(false);
  });

  it('handles action type ADMIN_GET_COORS_LIST_FAILURE correctly', () => {
    const prevState = { getCoorsListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_COORS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCoorsListPending).toBe(false);
    expect(state.getCoorsListError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_GET_COORS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getCoorsListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_COORS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getCoorsListError).toBe(null);
  });
});

