import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_DELETE_DPT_BEGIN,
  ADMIN_DELETE_DPT_SUCCESS,
  ADMIN_DELETE_DPT_FAILURE,
  ADMIN_DELETE_DPT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function deleteDpt(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_DELETE_DPT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Departement/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_DELETE_DPT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_DELETE_DPT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteDptError() {
  return {
    type: ADMIN_DELETE_DPT_DISMISS_ERROR,
  };
}

export function useDeleteDpt() {
  const dispatch = useDispatch();

  const { deleteDptPending, deleteDptError } = useSelector(
    state => ({
      deleteDptPending: state.admin.deleteDptPending,
      deleteDptError: state.admin.deleteDptError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteDpt(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteDptError());
  }, [dispatch]);

  return {
    deleteDpt: boundAction,
    deleteDptPending,
    deleteDptError,
    dismissDeleteDptError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_DELETE_DPT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteDptPending: true,
        deleteDptError: null,
      };

    case ADMIN_DELETE_DPT_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteDptPending: false,
        deleteDptError: null,
      };

    case ADMIN_DELETE_DPT_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteDptPending: false,
        deleteDptError: action.data.error,
      };

    case ADMIN_DELETE_DPT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteDptError: null,
      };

    default:
      return state;
  }
}
