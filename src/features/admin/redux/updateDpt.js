import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_UPDATE_DPT_BEGIN,
  ADMIN_UPDATE_DPT_SUCCESS,
  ADMIN_UPDATE_DPT_FAILURE,
  ADMIN_UPDATE_DPT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateDpt(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_UPDATE_DPT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Departement/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_UPDATE_DPT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_UPDATE_DPT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateDptError() {
  return {
    type: ADMIN_UPDATE_DPT_DISMISS_ERROR,
  };
}

export function useUpdateDpt() {
  const dispatch = useDispatch();

  const { updateDptPending, updateDptError } = useSelector(
    state => ({
      updateDptPending: state.admin.updateDptPending,
      updateDptError: state.admin.updateDptError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateDpt(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateDptError());
  }, [dispatch]);

  return {
    updateDpt: boundAction,
    updateDptPending,
    updateDptError,
    dismissUpdateDptError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_UPDATE_DPT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateDptPending: true,
        updateDptError: null,
      };

    case ADMIN_UPDATE_DPT_SUCCESS:
      // The request is success
      return {
        ...state,
        updateDptPending: false,
        updateDptError: null,
      };

    case ADMIN_UPDATE_DPT_FAILURE:
      // The request is failed
      return {
        ...state,
        updateDptPending: false,
        updateDptError: action.data.error,
      };

    case ADMIN_UPDATE_DPT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateDptError: null,
      };

    default:
      return state;
  }
}
