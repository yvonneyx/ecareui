import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_ADD_DPT_BEGIN,
  ADMIN_ADD_DPT_SUCCESS,
  ADMIN_ADD_DPT_FAILURE,
  ADMIN_ADD_DPT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addDpt(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_ADD_DPT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Departement/new`, requestJSON, config);
      doRequest.then(
        res => {
          dispatch({
            type: ADMIN_ADD_DPT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ADMIN_ADD_DPT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddDptError() {
  return {
    type: ADMIN_ADD_DPT_DISMISS_ERROR,
  };
}

export function useAddDpt() {
  const dispatch = useDispatch();

  const { addDptPending, addDptError } = useSelector(
    state => ({
      addDptPending: state.admin.addDptPending,
      addDptError: state.admin.addDptError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(addDpt(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddDptError());
  }, [dispatch]);

  return {
    addDpt: boundAction,
    addDptPending,
    addDptError,
    dismissAddDptError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_ADD_DPT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addDptPending: true,
        addDptError: null,
      };

    case ADMIN_ADD_DPT_SUCCESS:
      // The request is success
      return {
        ...state,
        addDptPending: false,
        addDptError: null,
      };

    case ADMIN_ADD_DPT_FAILURE:
      // The request is failed
      return {
        ...state,
        addDptPending: false,
        addDptError: action.data.error,
      };

    case ADMIN_ADD_DPT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addDptError: null,
      };

    default:
      return state;
  }
}
