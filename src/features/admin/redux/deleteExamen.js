import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_DELETE_EXAMEN_BEGIN,
  ADMIN_DELETE_EXAMEN_SUCCESS,
  ADMIN_DELETE_EXAMEN_FAILURE,
  ADMIN_DELETE_EXAMEN_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function deleteExamen(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_DELETE_EXAMEN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/ExamenMedical/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_DELETE_EXAMEN_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_DELETE_EXAMEN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteExamenError() {
  return {
    type: ADMIN_DELETE_EXAMEN_DISMISS_ERROR,
  };
}

export function useDeleteExamen() {
  const dispatch = useDispatch();

  const { deleteExamenPending, deleteExamenError } = useSelector(
    state => ({
      deleteExamenPending: state.admin.deleteExamenPending,
      deleteExamenError: state.admin.deleteExamenError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteExamen(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteExamenError());
  }, [dispatch]);

  return {
    deleteExamen: boundAction,
    deleteExamenPending,
    deleteExamenError,
    dismissDeleteExamenError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_DELETE_EXAMEN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteExamenPending: true,
        deleteExamenError: null,
      };

    case ADMIN_DELETE_EXAMEN_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteExamenPending: false,
        deleteExamenError: null,
      };

    case ADMIN_DELETE_EXAMEN_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteExamenPending: false,
        deleteExamenError: action.data.error,
      };

    case ADMIN_DELETE_EXAMEN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteExamenError: null,
      };

    default:
      return state;
  }
}
