import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  ADMIN_ADD_EXAMEN_BEGIN,
  ADMIN_ADD_EXAMEN_SUCCESS,
  ADMIN_ADD_EXAMEN_FAILURE,
  ADMIN_ADD_EXAMEN_DISMISS_ERROR,
} from '../../../../src/features/admin/redux/constants';

import {
  addExamen,
  dismissAddExamenError,
  reducer,
} from '../../../../src/features/admin/redux/addExamen';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/redux/addExamen', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addExamen succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addExamen())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_ADD_EXAMEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_ADD_EXAMEN_SUCCESS);
      });
  });

  it('dispatches failure action when addExamen fails', () => {
    const store = mockStore({});

    return store.dispatch(addExamen({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', ADMIN_ADD_EXAMEN_BEGIN);
        expect(actions[1]).toHaveProperty('type', ADMIN_ADD_EXAMEN_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddExamenError', () => {
    const expectedAction = {
      type: ADMIN_ADD_EXAMEN_DISMISS_ERROR,
    };
    expect(dismissAddExamenError()).toEqual(expectedAction);
  });

  it('handles action type ADMIN_ADD_EXAMEN_BEGIN correctly', () => {
    const prevState = { addExamenPending: false };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_EXAMEN_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addExamenPending).toBe(true);
  });

  it('handles action type ADMIN_ADD_EXAMEN_SUCCESS correctly', () => {
    const prevState = { addExamenPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_EXAMEN_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addExamenPending).toBe(false);
  });

  it('handles action type ADMIN_ADD_EXAMEN_FAILURE correctly', () => {
    const prevState = { addExamenPending: true };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_EXAMEN_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addExamenPending).toBe(false);
    expect(state.addExamenError).toEqual(expect.anything());
  });

  it('handles action type ADMIN_ADD_EXAMEN_DISMISS_ERROR correctly', () => {
    const prevState = { addExamenError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ADMIN_ADD_EXAMEN_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addExamenError).toBe(null);
  });
});

