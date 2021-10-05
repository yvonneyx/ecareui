import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_GET_EXAMENS_LIST_BEGIN,
  ADMIN_GET_EXAMENS_LIST_SUCCESS,
  ADMIN_GET_EXAMENS_LIST_FAILURE,
  ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  getExamensList,
  dismissGetExamensListError,
  reducer,
} from '../../../../src/features/admin/redux/getExamensList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/getExamensList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getExamensList succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getExamensList())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_EXAMENS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_EXAMENS_LIST_SUCCESS);
      });
  });

  it('dispatches failure action when getExamensList fails', () => {
    const store = mockStore({});

    return store.dispatch(getExamensList({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_GET_EXAMENS_LIST_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_GET_EXAMENS_LIST_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetExamensListError', () => {
    const expectedAction = {
      type: ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR,
    };
    expect(dismissGetExamensListError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_GET_EXAMENS_LIST_BEGIN correctly', () => {
    const prevState = { getExamensListPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_EXAMENS_LIST_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getExamensListPending).toBe(true);
  });

  it('handles action type ADMIN_GET_EXAMENS_LIST_SUCCESS correctly', () => {
    const prevState = { getExamensListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_EXAMENS_LIST_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getExamensListPending).toBe(false);
  });

  it('handles action type ADMIN_GET_EXAMENS_LIST_FAILURE correctly', () => {
    const prevState = { getExamensListPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_EXAMENS_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getExamensListPending).toBe(false);
    expect(state.getExamensListError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { getExamensListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getExamensListError).toBe(null);
  });
});

