import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_ADD_EM_BY_VS_ID_BEGIN,
  HOME_ADD_EM_BY_VS_ID_SUCCESS,
  HOME_ADD_EM_BY_VS_ID_FAILURE,
  HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  addEmByVsId,
  dismissAddEmByVsIdError,
  reducer,
} from '../../../../src/features/home/redux/addEmByVsId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/addEmByVsId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addEmByVsId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addEmByVsId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_EM_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_EM_BY_VS_ID_SUCCESS);
      });
  });

  it('dispatches failure action when addEmByVsId fails', () => {
    const store = mockStore({});

    return store.dispatch(addEmByVsId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_EM_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_EM_BY_VS_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddEmByVsIdError', () => {
    const expectedAction = {
      type: HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR,
    };
    expect(dismissAddEmByVsIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_ADD_EM_BY_VS_ID_BEGIN correctly', () => {
    const prevState = { addEmByVsIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_ADD_EM_BY_VS_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addEmByVsIdPending).toBe(true);
  });

  it('handles action type HOME_ADD_EM_BY_VS_ID_SUCCESS correctly', () => {
    const prevState = { addEmByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_EM_BY_VS_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addEmByVsIdPending).toBe(false);
  });

  it('handles action type HOME_ADD_EM_BY_VS_ID_FAILURE correctly', () => {
    const prevState = { addEmByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_EM_BY_VS_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addEmByVsIdPending).toBe(false);
    expect(state.addEmByVsIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR correctly', () => {
    const prevState = { addEmByVsIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addEmByVsIdError).toBe(null);
  });
});

