import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_DELETE_INFIRMIERE_BEGIN,
  ADMIN_DELETE_INFIRMIERE_SUCCESS,
  ADMIN_DELETE_INFIRMIERE_FAILURE,
  ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function deleteInfirmiere(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_DELETE_INFIRMIERE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Infirmiere/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_DELETE_INFIRMIERE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_DELETE_INFIRMIERE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteInfirmiereError() {
  return {
    type: ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR,
  };
}

export function useDeleteInfirmiere() {
  const dispatch = useDispatch();

  const { deleteInfirmierePending, deleteInfirmiereError } = useSelector(
    state => ({
      deleteInfirmierePending: state.admin.deleteInfirmierePending,
      deleteInfirmiereError: state.admin.deleteInfirmiereError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteInfirmiere(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteInfirmiereError());
  }, [dispatch]);

  return {
    deleteInfirmiere: boundAction,
    deleteInfirmierePending,
    deleteInfirmiereError,
    dismissDeleteInfirmiereError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_DELETE_INFIRMIERE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteInfirmierePending: true,
        deleteInfirmiereError: null,
      };

    case ADMIN_DELETE_INFIRMIERE_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteInfirmierePending: false,
        deleteInfirmiereError: null,
      };

    case ADMIN_DELETE_INFIRMIERE_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteInfirmierePending: false,
        deleteInfirmiereError: action.data.error,
      };

    case ADMIN_DELETE_INFIRMIERE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteInfirmiereError: null,
      };

    default:
      return state;
  }
}
