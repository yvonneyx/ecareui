import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_DELETE_PATIENT_BEGIN,
  HOME_DELETE_PATIENT_SUCCESS,
  HOME_DELETE_PATIENT_FAILURE,
  HOME_DELETE_PATIENT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function deletePatient(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_DELETE_PATIENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Patient/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_DELETE_PATIENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_DELETE_PATIENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeletePatientError() {
  return {
    type: HOME_DELETE_PATIENT_DISMISS_ERROR,
  };
}

export function useDeletePatient() {
  const dispatch = useDispatch();

  const { deletePatientPending, deletePatientError } = useSelector(
    state => ({
      deletePatientPending: state.home.deletePatientPending,
      deletePatientError: state.home.deletePatientError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deletePatient(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeletePatientError());
  }, [dispatch]);

  return {
    deletePatient: boundAction,
    deletePatientPending,
    deletePatientError,
    dismissDeletePatientError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_DELETE_PATIENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deletePatientPending: true,
        deletePatientError: null,
      };

    case HOME_DELETE_PATIENT_SUCCESS:
      // The request is success
      return {
        ...state,
        deletePatientPending: false,
        deletePatientError: null,
      };

    case HOME_DELETE_PATIENT_FAILURE:
      // The request is failed
      return {
        ...state,
        deletePatientPending: false,
        deletePatientError: action.data.error,
      };

    case HOME_DELETE_PATIENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deletePatientError: null,
      };

    default:
      return state;
  }
}
