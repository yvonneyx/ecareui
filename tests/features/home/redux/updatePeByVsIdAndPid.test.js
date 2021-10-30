import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN,
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS,
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE,
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  updatePeByVsIdAndPid,
  dismissUpdatePeByVsIdAndPidError,
  reducer,
} from '../../../../src/features/home/redux/updatePeByVsIdAndPid';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/updatePeByVsIdAndPid', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updatePeByVsIdAndPid succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updatePeByVsIdAndPid())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS);
      });
  });

  it('dispatches failure action when updatePeByVsIdAndPid fails', () => {
    const store = mockStore({});

    return store.dispatch(updatePeByVsIdAndPid({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdatePeByVsIdAndPidError', () => {
    const expectedAction = {
      type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
    };
    expect(dismissUpdatePeByVsIdAndPidError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN correctly', () => {
    const prevState = { updatePeByVsIdAndPidPending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePeByVsIdAndPidPending).toBe(true);
  });

  it('handles action type HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS correctly', () => {
    const prevState = { updatePeByVsIdAndPidPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePeByVsIdAndPidPending).toBe(false);
  });

  it('handles action type HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE correctly', () => {
    const prevState = { updatePeByVsIdAndPidPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePeByVsIdAndPidPending).toBe(false);
    expect(state.updatePeByVsIdAndPidError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR correctly', () => {
    const prevState = { updatePeByVsIdAndPidError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updatePeByVsIdAndPidError).toBe(null);
  });
});

