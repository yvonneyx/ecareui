import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPDATE_VISITE_BEGIN,
  HOME_UPDATE_VISITE_SUCCESS,
  HOME_UPDATE_VISITE_FAILURE,
  HOME_UPDATE_VISITE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  updateVisite,
  dismissUpdateVisiteError,
  reducer,
} from '../../../../src/features/home/redux/updateVisite';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/updateVisite', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateVisite succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateVisite())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_VISITE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_VISITE_SUCCESS);
      });
  });

  it('dispatches failure action when updateVisite fails', () => {
    const store = mockStore({});

    return store.dispatch(updateVisite({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_VISITE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_VISITE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateVisiteError', () => {
    const expectedAction = {
      type: HOME_UPDATE_VISITE_DISMISS_ERROR,
    };
    expect(dismissUpdateVisiteError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPDATE_VISITE_BEGIN correctly', () => {
    const prevState = { updateVisitePending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_VISITE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateVisitePending).toBe(true);
  });

  it('handles action type HOME_UPDATE_VISITE_SUCCESS correctly', () => {
    const prevState = { updateVisitePending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_VISITE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateVisitePending).toBe(false);
  });

  it('handles action type HOME_UPDATE_VISITE_FAILURE correctly', () => {
    const prevState = { updateVisitePending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_VISITE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateVisitePending).toBe(false);
    expect(state.updateVisiteError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPDATE_VISITE_DISMISS_ERROR correctly', () => {
    const prevState = { updateVisiteError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_VISITE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateVisiteError).toBe(null);
  });
});

