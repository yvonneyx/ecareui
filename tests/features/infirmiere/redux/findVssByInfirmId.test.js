import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN,
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS,
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE,
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR,
} from '../../../../src/features/infirmiere/redux/constants';

import {
  findVssByInfirmId,
  dismissFindVssByInfirmIdError,
  reducer,
} from '../../../../src/features/infirmiere/redux/findVssByInfirmId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('infirmiere/redux/findVssByInfirmId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findVssByInfirmId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findVssByInfirmId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findVssByInfirmId fails', () => {
    const store = mockStore({});

    return store.dispatch(findVssByInfirmId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindVssByInfirmIdError', () => {
    const expectedAction = {
      type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR,
    };
    expect(dismissFindVssByInfirmIdError()).toEqual(expectedAction);
  });

  it('handles action type INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN correctly', () => {
    const prevState = { findVssByInfirmIdPending: false };
    const state = reducer(
      prevState,
      { type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByInfirmIdPending).toBe(true);
  });

  it('handles action type INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS correctly', () => {
    const prevState = { findVssByInfirmIdPending: true };
    const state = reducer(
      prevState,
      { type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByInfirmIdPending).toBe(false);
  });

  it('handles action type INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE correctly', () => {
    const prevState = { findVssByInfirmIdPending: true };
    const state = reducer(
      prevState,
      { type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByInfirmIdPending).toBe(false);
    expect(state.findVssByInfirmIdError).toEqual(expect.anything());
  });

  it('handles action type INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findVssByInfirmIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByInfirmIdError).toBe(null);
  });
});

