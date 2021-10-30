import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN,
  HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS,
  HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE,
  HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  addPeByVsIdAndPid,
  dismissAddPeByVsIdAndPidError,
  reducer,
} from '../../../../src/features/home/redux/addPeByVsIdAndPid';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/addPeByVsIdAndPid', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addPeByVsIdAndPid succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addPeByVsIdAndPid())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS);
      });
  });

  it('dispatches failure action when addPeByVsIdAndPid fails', () => {
    const store = mockStore({});

    return store.dispatch(addPeByVsIdAndPid({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddPeByVsIdAndPidError', () => {
    const expectedAction = {
      type: HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
    };
    expect(dismissAddPeByVsIdAndPidError()).toEqual(expectedAction);
  });

  it('handles action type HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN correctly', () => {
    const prevState = { addPeByVsIdAndPidPending: false };
    const state = reducer(
      prevState,
      { type: HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPeByVsIdAndPidPending).toBe(true);
  });

  it('handles action type HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS correctly', () => {
    const prevState = { addPeByVsIdAndPidPending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPeByVsIdAndPidPending).toBe(false);
  });

  it('handles action type HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE correctly', () => {
    const prevState = { addPeByVsIdAndPidPending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPeByVsIdAndPidPending).toBe(false);
    expect(state.addPeByVsIdAndPidError).toEqual(expect.anything());
  });

  it('handles action type HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR correctly', () => {
    const prevState = { addPeByVsIdAndPidError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addPeByVsIdAndPidError).toBe(null);
  });
});

