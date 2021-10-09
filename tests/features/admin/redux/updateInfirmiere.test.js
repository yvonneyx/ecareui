import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_UPDATE_INFIRMIERE_BEGIN,
  ADMIN_UPDATE_INFIRMIERE_SUCCESS,
  ADMIN_UPDATE_INFIRMIERE_FAILURE,
  ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  updateInfirmiere,
  dismissUpdateInfirmiereError,
  reducer,
} from '../../../../src/features/admin/redux/updateInfirmiere';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/updateInfirmiere', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateInfirmiere succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateInfirmiere())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_INFIRMIERE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_INFIRMIERE_SUCCESS);
      });
  });

  it('dispatches failure action when updateInfirmiere fails', () => {
    const store = mockStore({});

    return store.dispatch(updateInfirmiere({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_UPDATE_INFIRMIERE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_UPDATE_INFIRMIERE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateInfirmiereError', () => {
    const expectedAction = {
      type: ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR,
    };
    expect(dismissUpdateInfirmiereError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_UPDATE_INFIRMIERE_BEGIN correctly', () => {
    const prevState = { updateInfirmierePending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_INFIRMIERE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateInfirmierePending).toBe(true);
  });

  it('handles action type ADMIN_UPDATE_INFIRMIERE_SUCCESS correctly', () => {
    const prevState = { updateInfirmierePending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_INFIRMIERE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateInfirmierePending).toBe(false);
  });

  it('handles action type ADMIN_UPDATE_INFIRMIERE_FAILURE correctly', () => {
    const prevState = { updateInfirmierePending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_INFIRMIERE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateInfirmierePending).toBe(false);
    expect(state.updateInfirmiereError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR correctly', () => {
    const prevState = { updateInfirmiereError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateInfirmiereError).toBe(null);
  });
});

