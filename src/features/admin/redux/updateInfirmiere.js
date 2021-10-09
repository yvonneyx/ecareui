import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_UPDATE_INFIRMIERE_BEGIN,
  ADMIN_UPDATE_INFIRMIERE_SUCCESS,
  ADMIN_UPDATE_INFIRMIERE_FAILURE,
  ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateInfirmiere(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_UPDATE_INFIRMIERE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Infirmiere/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_UPDATE_INFIRMIERE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_UPDATE_INFIRMIERE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateInfirmiereError() {
  return {
    type: ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR,
  };
}

export function useUpdateInfirmiere() {
  const dispatch = useDispatch();

  const { updateInfirmierePending, updateInfirmiereError } = useSelector(
    state => ({
      updateInfirmierePending: state.admin.updateInfirmierePending,
      updateInfirmiereError: state.admin.updateInfirmiereError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateInfirmiere(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateInfirmiereError());
  }, [dispatch]);

  return {
    updateInfirmiere: boundAction,
    updateInfirmierePending,
    updateInfirmiereError,
    dismissUpdateInfirmiereError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_UPDATE_INFIRMIERE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateInfirmierePending: true,
        updateInfirmiereError: null,
      };

    case ADMIN_UPDATE_INFIRMIERE_SUCCESS:
      // The request is success
      return {
        ...state,
        updateInfirmierePending: false,
        updateInfirmiereError: null,
      };

    case ADMIN_UPDATE_INFIRMIERE_FAILURE:
      // The request is failed
      return {
        ...state,
        updateInfirmierePending: false,
        updateInfirmiereError: action.data.error,
      };

    case ADMIN_UPDATE_INFIRMIERE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateInfirmiereError: null,
      };

    default:
      return state;
  }
}
