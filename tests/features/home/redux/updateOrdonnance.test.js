import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPDATE_ORDONNANCE_BEGIN,
  HOME_UPDATE_ORDONNANCE_SUCCESS,
  HOME_UPDATE_ORDONNANCE_FAILURE,
  HOME_UPDATE_ORDONNANCE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  updateOrdonnance,
  dismissUpdateOrdonnanceError,
  reducer,
} from '../../../../src/features/home/redux/updateOrdonnance';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/updateOrdonnance', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when updateOrdonnance succeeds', () => {
    const store = mockStore({});

    return store.dispatch(updateOrdonnance())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_ORDONNANCE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_ORDONNANCE_SUCCESS);
      });
  });

  it('dispatches failure action when updateOrdonnance fails', () => {
    const store = mockStore({});

    return store.dispatch(updateOrdonnance({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPDATE_ORDONNANCE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPDATE_ORDONNANCE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUpdateOrdonnanceError', () => {
    const expectedAction = {
      type: HOME_UPDATE_ORDONNANCE_DISMISS_ERROR,
    };
    expect(dismissUpdateOrdonnanceError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPDATE_ORDONNANCE_BEGIN correctly', () => {
    const prevState = { updateOrdonnancePending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_ORDONNANCE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateOrdonnancePending).toBe(true);
  });

  it('handles action type HOME_UPDATE_ORDONNANCE_SUCCESS correctly', () => {
    const prevState = { updateOrdonnancePending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_ORDONNANCE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateOrdonnancePending).toBe(false);
  });

  it('handles action type HOME_UPDATE_ORDONNANCE_FAILURE correctly', () => {
    const prevState = { updateOrdonnancePending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_ORDONNANCE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateOrdonnancePending).toBe(false);
    expect(state.updateOrdonnanceError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPDATE_ORDONNANCE_DISMISS_ERROR correctly', () => {
    const prevState = { updateOrdonnanceError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPDATE_ORDONNANCE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.updateOrdonnanceError).toBe(null);
  });
});

