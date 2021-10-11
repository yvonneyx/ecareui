import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN,
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS,
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE,
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR,
} from '../../../../src/features/coordinateur/redux/constants';

import {
  findInfirmieresByDptId,
  dismissFindInfirmieresByDptIdError,
  reducer,
} from '../../../../src/features/coordinateur/redux/findInfirmieresByDptId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('coordinateur/redux/findInfirmieresByDptId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findInfirmieresByDptId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findInfirmieresByDptId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findInfirmieresByDptId fails', () => {
    const store = mockStore({});

    return store.dispatch(findInfirmieresByDptId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindInfirmieresByDptIdError', () => {
    const expectedAction = {
      type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR,
    };
    expect(dismissFindInfirmieresByDptIdError()).toEqual(expectedAction);
  });

  it('handles action type COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN correctly', () => {
    const prevState = { findInfirmieresByDptIdPending: false };
    const state = reducer(
      prevState,
      { type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findInfirmieresByDptIdPending).toBe(true);
  });

  it('handles action type COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS correctly', () => {
    const prevState = { findInfirmieresByDptIdPending: true };
    const state = reducer(
      prevState,
      { type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findInfirmieresByDptIdPending).toBe(false);
  });

  it('handles action type COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE correctly', () => {
    const prevState = { findInfirmieresByDptIdPending: true };
    const state = reducer(
      prevState,
      { type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findInfirmieresByDptIdPending).toBe(false);
    expect(state.findInfirmieresByDptIdError).toEqual(expect.anything());
  });

  it('handles action type COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findInfirmieresByDptIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findInfirmieresByDptIdError).toBe(null);
  });
});

