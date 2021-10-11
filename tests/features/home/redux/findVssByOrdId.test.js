import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FIND_VSS_BY_ORD_ID_BEGIN,
  HOME_FIND_VSS_BY_ORD_ID_SUCCESS,
  HOME_FIND_VSS_BY_ORD_ID_FAILURE,
  HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  findVssByOrdId,
  dismissFindVssByOrdIdError,
  reducer,
} from '../../../../src/features/home/redux/findVssByOrdId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/findVssByOrdId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findVssByOrdId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findVssByOrdId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_VSS_BY_ORD_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_VSS_BY_ORD_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findVssByOrdId fails', () => {
    const store = mockStore({});

    return store.dispatch(findVssByOrdId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_VSS_BY_ORD_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_VSS_BY_ORD_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindVssByOrdIdError', () => {
    const expectedAction = {
      type: HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR,
    };
    expect(dismissFindVssByOrdIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FIND_VSS_BY_ORD_ID_BEGIN correctly', () => {
    const prevState = { findVssByOrdIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VSS_BY_ORD_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByOrdIdPending).toBe(true);
  });

  it('handles action type HOME_FIND_VSS_BY_ORD_ID_SUCCESS correctly', () => {
    const prevState = { findVssByOrdIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VSS_BY_ORD_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByOrdIdPending).toBe(false);
  });

  it('handles action type HOME_FIND_VSS_BY_ORD_ID_FAILURE correctly', () => {
    const prevState = { findVssByOrdIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VSS_BY_ORD_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByOrdIdPending).toBe(false);
    expect(state.findVssByOrdIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findVssByOrdIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVssByOrdIdError).toBe(null);
  });
});

