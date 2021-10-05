import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_ADD_EXAMEN_BEGIN,
  ADMIN_ADD_EXAMEN_SUCCESS,
  ADMIN_ADD_EXAMEN_FAILURE,
  ADMIN_ADD_EXAMEN_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addExamen(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_ADD_EXAMEN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/ExamenMedical/new`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_ADD_EXAMEN_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_ADD_EXAMEN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddExamenError() {
  return {
    type: ADMIN_ADD_EXAMEN_DISMISS_ERROR,
  };
}

export function useAddExamen() {
  const dispatch = useDispatch();

  const { addExamenPending, addExamenError } = useSelector(
    state => ({
      addExamenPending: state.admin.addExamenPending,
      addExamenError: state.admin.addExamenError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addExamen(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddExamenError());
  }, [dispatch]);

  return {
    addExamen: boundAction,
    addExamenPending,
    addExamenError,
    dismissAddExamenError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_ADD_EXAMEN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addExamenPending: true,
        addExamenError: null,
      };

    case ADMIN_ADD_EXAMEN_SUCCESS:
      // The request is success
      return {
        ...state,
        addExamenPending: false,
        addExamenError: null,
      };

    case ADMIN_ADD_EXAMEN_FAILURE:
      // The request is failed
      return {
        ...state,
        addExamenPending: false,
        addExamenError: action.data.error,
      };

    case ADMIN_ADD_EXAMEN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addExamenError: null,
      };

    default:
      return state;
  }
}
