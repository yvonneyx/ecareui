import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_UPDATE_COOR_BEGIN,
  ADMIN_UPDATE_COOR_SUCCESS,
  ADMIN_UPDATE_COOR_FAILURE,
  ADMIN_UPDATE_COOR_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  updateCoor,
  dismissUpdateCoorError,
  reducer,
} from '../../../../src/features/admin/redux/updateCoor';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/updateCoor', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateCoor succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateCoor())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_COOR_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_COOR_SUCCESS);
      });
  });

  it('dispatches failure action when updateCoor fails', () => {
    const store = mockStore({});

    return store.dispatch(updateCoor({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_COOR_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_COOR_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateCoorError', () => {
    const expectedAction = {
      type: ADMIN_UPDATE_COOR_DISMISS_ERROR,
    };
    expect(dismissUpdateCoorError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_UPDATE_COOR_BEGIN correctly', () => {
    const prevState = { updateCoorPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_COOR_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCoorPending).toBe(true);
  });

  it('handles action type ADMIN_UPDATE_COOR_SUCCESS correctly', () => {
    const prevState = { updateCoorPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_COOR_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCoorPending).toBe(false);
  });

  it('handles action type ADMIN_UPDATE_COOR_FAILURE correctly', () => {
    const prevState = { updateCoorPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_COOR_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCoorPending).toBe(false);
    expect(state.updateCoorError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_UPDATE_COOR_DISMISS_ERROR correctly', () => {
    const prevState = { updateCoorError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_COOR_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateCoorError).toBe(null);
  });
});

