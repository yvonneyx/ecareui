import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_DELETE_INFIRMIERE_BEGIN,
  ADMIN_DELETE_INFIRMIERE_SUCCESS,
  ADMIN_DELETE_INFIRMIERE_FAILURE,
  ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  deleteInfirmiere,
  dismissDeleteInfirmiereError,
  reducer,
} from '../../../../src/features/admin/redux/deleteInfirmiere';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/deleteInfirmiere', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteInfirmiere succeeds', () => {
    const store = mockStore({});

    return store.dispatch(deleteInfirmiere())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_DELETE_INFIRMIERE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_DELETE_INFIRMIERE_SUCCESS);
      });
  });

  it('dispatches failure action when deleteInfirmiere fails', () => {
    const store = mockStore({});

    return store.dispatch(deleteInfirmiere({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_DELETE_INFIRMIERE_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_DELETE_INFIRMIERE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteInfirmiereError', () => {
    const expectedAction = {
      type: ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR,
    };
    expect(dismissDeleteInfirmiereError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_DELETE_INFIRMIERE_BEGIN correctly', () => {
    const prevState = { deleteInfirmierePending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_INFIRMIERE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteInfirmierePending).toBe(true);
  });

  it('handles action type ADMIN_DELETE_INFIRMIERE_SUCCESS correctly', () => {
    const prevState = { deleteInfirmierePending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_INFIRMIERE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteInfirmierePending).toBe(false);
  });

  it('handles action type ADMIN_DELETE_INFIRMIERE_FAILURE correctly', () => {
    const prevState = { deleteInfirmierePending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_INFIRMIERE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteInfirmierePending).toBe(false);
    expect(state.deleteInfirmiereError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteInfirmiereError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteInfirmiereError).toBe(null);
  });
});

