import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_ADD_VISITE_BEGIN,
  HOME_ADD_VISITE_SUCCESS,
  HOME_ADD_VISITE_FAILURE,
  HOME_ADD_VISITE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  addVisite,
  dismissAddVisiteError,
  reducer,
} from '../../../../src/features/home/redux/addVisite';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/addVisite', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addVisite succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addVisite())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_VISITE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_VISITE_SUCCESS);
      });
  });

  it('dispatches failure action when addVisite fails', () => {
    const store = mockStore({});

    return store.dispatch(addVisite({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_VISITE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_VISITE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddVisiteError', () => {
    const expectedAction = {
      type: HOME_ADD_VISITE_DISMISS_ERROR,
    };
    expect(dismissAddVisiteError()).toEqual(expectedAction);
  });

  it('handles action type HOME_ADD_VISITE_BEGIN correctly', () => {
    const prevState = { addVisitePending: false };
    const state = reducer(
      prevState,
      { type: HOME_ADD_VISITE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addVisitePending).toBe(true);
  });

  it('handles action type HOME_ADD_VISITE_SUCCESS correctly', () => {
    const prevState = { addVisitePending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_VISITE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addVisitePending).toBe(false);
  });

  it('handles action type HOME_ADD_VISITE_FAILURE correctly', () => {
    const prevState = { addVisitePending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_VISITE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addVisitePending).toBe(false);
    expect(state.addVisiteError).toEqual(expect.anything());
  });

  it('handles action type HOME_ADD_VISITE_DISMISS_ERROR correctly', () => {
    const prevState = { addVisiteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_ADD_VISITE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addVisiteError).toBe(null);
  });
});

