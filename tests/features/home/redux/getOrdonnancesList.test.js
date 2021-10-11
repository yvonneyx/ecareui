import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_ORDONNANCES_LIST_BEGIN,
  HOME_GET_ORDONNANCES_LIST_SUCCESS,
  HOME_GET_ORDONNANCES_LIST_FAILURE,
  HOME_GET_ORDONNANCES_LIST_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getOrdonnancesList,
  dismissGetOrdonnancesListError,
  reducer,
} from '../../../../src/features/home/redux/getOrdonnancesList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getOrdonnancesList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getOrdonnancesList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getOrdonnancesList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_ORDONNANCES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_ORDONNANCES_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getOrdonnancesList fails', () => {
    const store = mockStore({});

    return store.dispatch(getOrdonnancesList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_ORDONNANCES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_ORDONNANCES_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetOrdonnancesListError', () => {
    const expectedAction = {
      type: HOME_GET_ORDONNANCES_LIST_DISMISS_ERROR,
    };
    expect(dismissGetOrdonnancesListError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_ORDONNANCES_LIST_BEGIN correctly', () => {
    const prevState = { getOrdonnancesListPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_ORDONNANCES_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getOrdonnancesListPending).toBe(true);
  });

  it('handles action type HOME_GET_ORDONNANCES_LIST_SUCCESS correctly', () => {
    const prevState = { getOrdonnancesListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_ORDONNANCES_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getOrdonnancesListPending).toBe(false);
  });

  it('handles action type HOME_GET_ORDONNANCES_LIST_FAILURE correctly', () => {
    const prevState = { getOrdonnancesListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_ORDONNANCES_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getOrdonnancesListPending).toBe(false);
    expect(state.getOrdonnancesListError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_ORDONNANCES_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getOrdonnancesListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_ORDONNANCES_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getOrdonnancesListError).toBe(null);
  });
});

