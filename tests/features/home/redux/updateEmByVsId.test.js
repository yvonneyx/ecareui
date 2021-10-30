import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPDATE_EM_BY_VS_ID_BEGIN,
  HOME_UPDATE_EM_BY_VS_ID_SUCCESS,
  HOME_UPDATE_EM_BY_VS_ID_FAILURE,
  HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  updateEmByVsId,
  dismissUpdateEmByVsIdError,
  reducer,
} from '../../../../src/features/home/redux/updateEmByVsId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/updateEmByVsId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateEmByVsId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateEmByVsId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_EM_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_EM_BY_VS_ID_SUCCESS);
      });
  });

  it('dispatches failure action when updateEmByVsId fails', () => {
    const store = mockStore({});

    return store.dispatch(updateEmByVsId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_EM_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_EM_BY_VS_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateEmByVsIdError', () => {
    const expectedAction = {
      type: HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR,
    };
    expect(dismissUpdateEmByVsIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPDATE_EM_BY_VS_ID_BEGIN correctly', () => {
    const prevState = { updateEmByVsIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_EM_BY_VS_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateEmByVsIdPending).toBe(true);
  });

  it('handles action type HOME_UPDATE_EM_BY_VS_ID_SUCCESS correctly', () => {
    const prevState = { updateEmByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_EM_BY_VS_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateEmByVsIdPending).toBe(false);
  });

  it('handles action type HOME_UPDATE_EM_BY_VS_ID_FAILURE correctly', () => {
    const prevState = { updateEmByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_EM_BY_VS_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateEmByVsIdPending).toBe(false);
    expect(state.updateEmByVsIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR correctly', () => {
    const prevState = { updateEmByVsIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateEmByVsIdError).toBe(null);
  });
});

