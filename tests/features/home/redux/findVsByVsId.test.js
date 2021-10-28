import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FIND_VS_BY_VS_ID_BEGIN,
  HOME_FIND_VS_BY_VS_ID_SUCCESS,
  HOME_FIND_VS_BY_VS_ID_FAILURE,
  HOME_FIND_VS_BY_VS_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  findVsByVsId,
  dismissFindVsByVsIdError,
  reducer,
} from '../../../../src/features/home/redux/findVsByVsId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/findVsByVsId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findVsByVsId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findVsByVsId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_VS_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_VS_BY_VS_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findVsByVsId fails', () => {
    const store = mockStore({});

    return store.dispatch(findVsByVsId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_VS_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_VS_BY_VS_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindVsByVsIdError', () => {
    const expectedAction = {
      type: HOME_FIND_VS_BY_VS_ID_DISMISS_ERROR,
    };
    expect(dismissFindVsByVsIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FIND_VS_BY_VS_ID_BEGIN correctly', () => {
    const prevState = { findVsByVsIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_BY_VS_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsByVsIdPending).toBe(true);
  });

  it('handles action type HOME_FIND_VS_BY_VS_ID_SUCCESS correctly', () => {
    const prevState = { findVsByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_BY_VS_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsByVsIdPending).toBe(false);
  });

  it('handles action type HOME_FIND_VS_BY_VS_ID_FAILURE correctly', () => {
    const prevState = { findVsByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_BY_VS_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsByVsIdPending).toBe(false);
    expect(state.findVsByVsIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_FIND_VS_BY_VS_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findVsByVsIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_BY_VS_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsByVsIdError).toBe(null);
  });
});

