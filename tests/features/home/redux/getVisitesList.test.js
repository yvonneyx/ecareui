import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_VISITES_LIST_BEGIN,
  HOME_GET_VISITES_LIST_SUCCESS,
  HOME_GET_VISITES_LIST_FAILURE,
  HOME_GET_VISITES_LIST_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getVisitesList,
  dismissGetVisitesListError,
  reducer,
} from '../../../../src/features/home/redux/getVisitesList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getVisitesList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getVisitesList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getVisitesList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_VISITES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_VISITES_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getVisitesList fails', () => {
    const store = mockStore({});

    return store.dispatch(getVisitesList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_VISITES_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_VISITES_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetVisitesListError', () => {
    const expectedAction = {
      type: HOME_GET_VISITES_LIST_DISMISS_ERROR,
    };
    expect(dismissGetVisitesListError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_VISITES_LIST_BEGIN correctly', () => {
    const prevState = { getVisitesListPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_VISITES_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getVisitesListPending).toBe(true);
  });

  it('handles action type HOME_GET_VISITES_LIST_SUCCESS correctly', () => {
    const prevState = { getVisitesListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_VISITES_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getVisitesListPending).toBe(false);
  });

  it('handles action type HOME_GET_VISITES_LIST_FAILURE correctly', () => {
    const prevState = { getVisitesListPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_VISITES_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getVisitesListPending).toBe(false);
    expect(state.getVisitesListError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_VISITES_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getVisitesListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_VISITES_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getVisitesListError).toBe(null);
  });
});

