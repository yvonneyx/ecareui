import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FIND_VS_DTL_BY_VS_ID_BEGIN,
  HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS,
  HOME_FIND_VS_DTL_BY_VS_ID_FAILURE,
  HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  findVsDtlByVsId,
  dismissFindVsDtlByVsIdError,
  reducer,
} from '../../../../src/features/home/redux/findVsDtlByVsId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/findVsDtlByVsId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findVsDtlByVsId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findVsDtlByVsId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_VS_DTL_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findVsDtlByVsId fails', () => {
    const store = mockStore({});

    return store.dispatch(findVsDtlByVsId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_VS_DTL_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_VS_DTL_BY_VS_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindVsDtlByVsIdError', () => {
    const expectedAction = {
      type: HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR,
    };
    expect(dismissFindVsDtlByVsIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FIND_VS_DTL_BY_VS_ID_BEGIN correctly', () => {
    const prevState = { findVsDtlByVsIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_DTL_BY_VS_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsDtlByVsIdPending).toBe(true);
  });

  it('handles action type HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS correctly', () => {
    const prevState = { findVsDtlByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsDtlByVsIdPending).toBe(false);
  });

  it('handles action type HOME_FIND_VS_DTL_BY_VS_ID_FAILURE correctly', () => {
    const prevState = { findVsDtlByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_DTL_BY_VS_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsDtlByVsIdPending).toBe(false);
    expect(state.findVsDtlByVsIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findVsDtlByVsIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findVsDtlByVsIdError).toBe(null);
  });
});

