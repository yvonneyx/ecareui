import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FIND_ORD_BY_ORD_ID_BEGIN,
  HOME_FIND_ORD_BY_ORD_ID_SUCCESS,
  HOME_FIND_ORD_BY_ORD_ID_FAILURE,
  HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  findOrdByOrdId,
  dismissFindOrdByOrdIdError,
  reducer,
} from '../../../../src/features/home/redux/findOrdByOrdId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/findOrdByOrdId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findOrdByOrdId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findOrdByOrdId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_ORD_BY_ORD_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_ORD_BY_ORD_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findOrdByOrdId fails', () => {
    const store = mockStore({});

    return store.dispatch(findOrdByOrdId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_ORD_BY_ORD_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_ORD_BY_ORD_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindOrdByOrdIdError', () => {
    const expectedAction = {
      type: HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR,
    };
    expect(dismissFindOrdByOrdIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FIND_ORD_BY_ORD_ID_BEGIN correctly', () => {
    const prevState = { findOrdByOrdIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FIND_ORD_BY_ORD_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findOrdByOrdIdPending).toBe(true);
  });

  it('handles action type HOME_FIND_ORD_BY_ORD_ID_SUCCESS correctly', () => {
    const prevState = { findOrdByOrdIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_ORD_BY_ORD_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findOrdByOrdIdPending).toBe(false);
  });

  it('handles action type HOME_FIND_ORD_BY_ORD_ID_FAILURE correctly', () => {
    const prevState = { findOrdByOrdIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_ORD_BY_ORD_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findOrdByOrdIdPending).toBe(false);
    expect(state.findOrdByOrdIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findOrdByOrdIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findOrdByOrdIdError).toBe(null);
  });
});

