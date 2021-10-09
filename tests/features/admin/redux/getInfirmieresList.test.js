import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_GET_INFIRMIERES_LIST_BEGIN,
  ADMIN_GET_INFIRMIERES_LIST_SUCCESS,
  ADMIN_GET_INFIRMIERES_LIST_FAILURE,
  ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  getInfirmieresList,
  dismissGetInfirmieresListError,
  reducer,
} from '../../../../src/features/admin/redux/getInfirmieresList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/getInfirmieresList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getInfirmieresList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getInfirmieresList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_INFIRMIERES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_INFIRMIERES_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getInfirmieresList fails', () => {
    const store = mockStore({});

    return store.dispatch(getInfirmieresList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_INFIRMIERES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_INFIRMIERES_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetInfirmieresListError', () => {
    const expectedAction = {
      type: ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR,
    };
    expect(dismissGetInfirmieresListError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_GET_INFIRMIERES_LIST_BEGIN correctly', () => {
    const prevState = { getInfirmieresListPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_INFIRMIERES_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getInfirmieresListPending).toBe(true);
  });

  it('handles action type ADMIN_GET_INFIRMIERES_LIST_SUCCESS correctly', () => {
    const prevState = { getInfirmieresListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_INFIRMIERES_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getInfirmieresListPending).toBe(false);
  });

  it('handles action type ADMIN_GET_INFIRMIERES_LIST_FAILURE correctly', () => {
    const prevState = { getInfirmieresListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_INFIRMIERES_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getInfirmieresListPending).toBe(false);
    expect(state.getInfirmieresListError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getInfirmieresListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getInfirmieresListError).toBe(null);
  });
});

