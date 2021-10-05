import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_UPDATE_EXAMEN_BEGIN,
  ADMIN_UPDATE_EXAMEN_SUCCESS,
  ADMIN_UPDATE_EXAMEN_FAILURE,
  ADMIN_UPDATE_EXAMEN_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateExamen(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_UPDATE_EXAMEN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/ExamenMedical/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_UPDATE_EXAMEN_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_UPDATE_EXAMEN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateExamenError() {
  return {
    type: ADMIN_UPDATE_EXAMEN_DISMISS_ERROR,
  };
}

export function useUpdateExamen() {
  const dispatch = useDispatch();

  const { updateExamenPending, updateExamenError } = useSelector(
    state => ({
      updateExamenPending: state.admin.updateExamenPending,
      updateExamenError: state.admin.updateExamenError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateExamen(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateExamenError());
  }, [dispatch]);

  return {
    updateExamen: boundAction,
    updateExamenPending,
    updateExamenError,
    dismissUpdateExamenError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_UPDATE_EXAMEN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateExamenPending: true,
        updateExamenError: null,
      };

    case ADMIN_UPDATE_EXAMEN_SUCCESS:
      // The request is success
      return {
        ...state,
        updateExamenPending: false,
        updateExamenError: null,
      };

    case ADMIN_UPDATE_EXAMEN_FAILURE:
      // The request is failed
      return {
        ...state,
        updateExamenPending: false,
        updateExamenError: action.data.error,
      };

    case ADMIN_UPDATE_EXAMEN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateExamenError: null,
      };

    default:
      return state;
  }
}
