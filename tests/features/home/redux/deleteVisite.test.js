import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_DELETE_VISITE_BEGIN,
  HOME_DELETE_VISITE_SUCCESS,
  HOME_DELETE_VISITE_FAILURE,
  HOME_DELETE_VISITE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  deleteVisite,
  dismissDeleteVisiteError,
  reducer,
} from '../../../../src/features/home/redux/deleteVisite';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/deleteVisite', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteVisite succeeds', () => {
    const store = mockStore({});

    return store.dispatch(deleteVisite())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_DELETE_VISITE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_DELETE_VISITE_SUCCESS);
      });
  });

  it('dispatches failure action when deleteVisite fails', () => {
    const store = mockStore({});

    return store.dispatch(deleteVisite({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_DELETE_VISITE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_DELETE_VISITE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteVisiteError', () => {
    const expectedAction = {
      type: HOME_DELETE_VISITE_DISMISS_ERROR,
    };
    expect(dismissDeleteVisiteError()).toEqual(expectedAction);
  });

  it('handles action type HOME_DELETE_VISITE_BEGIN correctly', () => {
    const prevState = { deleteVisitePending: false };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_VISITE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteVisitePending).toBe(true);
  });

  it('handles action type HOME_DELETE_VISITE_SUCCESS correctly', () => {
    const prevState = { deleteVisitePending: true };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_VISITE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteVisitePending).toBe(false);
  });

  it('handles action type HOME_DELETE_VISITE_FAILURE correctly', () => {
    const prevState = { deleteVisitePending: true };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_VISITE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteVisitePending).toBe(false);
    expect(state.deleteVisiteError).toEqual(expect.anything());
  });

  it('handles action type HOME_DELETE_VISITE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteVisiteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_VISITE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteVisiteError).toBe(null);
  });
});

