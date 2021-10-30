import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN,
  HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS,
  HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE,
  HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  findPatientDtlByVsId,
  dismissFindPatientDtlByVsIdError,
  reducer,
} from '../../../../src/features/home/redux/findPatientDtlByVsId';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/findPatientDtlByVsId', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when findPatientDtlByVsId succeeds', () => {
    const store = mockStore({});

    return store.dispatch(findPatientDtlByVsId())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS);
      });
  });

  it('dispatches failure action when findPatientDtlByVsId fails', () => {
    const store = mockStore({});

    return store.dispatch(findPatientDtlByVsId({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFindPatientDtlByVsIdError', () => {
    const expectedAction = {
      type: HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR,
    };
    expect(dismissFindPatientDtlByVsIdError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN correctly', () => {
    const prevState = { findPatientDtlByVsIdPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPatientDtlByVsIdPending).toBe(true);
  });

  it('handles action type HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS correctly', () => {
    const prevState = { findPatientDtlByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPatientDtlByVsIdPending).toBe(false);
  });

  it('handles action type HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE correctly', () => {
    const prevState = { findPatientDtlByVsIdPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPatientDtlByVsIdPending).toBe(false);
    expect(state.findPatientDtlByVsIdError).toEqual(expect.anything());
  });

  it('handles action type HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR correctly', () => {
    const prevState = { findPatientDtlByVsIdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.findPatientDtlByVsIdError).toBe(null);
  });
});

