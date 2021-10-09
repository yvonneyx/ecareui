import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_ADD_PATIENT_BEGIN,
  ADMIN_ADD_PATIENT_SUCCESS,
  ADMIN_ADD_PATIENT_FAILURE,
  ADMIN_ADD_PATIENT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addPatient(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_ADD_PATIENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Patient/new`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_ADD_PATIENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_ADD_PATIENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddPatientError() {
  return {
    type: ADMIN_ADD_PATIENT_DISMISS_ERROR,
  };
}

export function useAddPatient() {
  const dispatch = useDispatch();

  const { addPatientPending, addPatientError } = useSelector(
    state => ({
      addPatientPending: state.admin.addPatientPending,
      addPatientError: state.admin.addPatientError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addPatient(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddPatientError());
  }, [dispatch]);

  return {
    addPatient: boundAction,
    addPatientPending,
    addPatientError,
    dismissAddPatientError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_ADD_PATIENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addPatientPending: true,
        addPatientError: null,
      };

    case ADMIN_ADD_PATIENT_SUCCESS:
      // The request is success
      return {
        ...state,
        addPatientPending: false,
        addPatientError: null,
      };

    case ADMIN_ADD_PATIENT_FAILURE:
      // The request is failed
      return {
        ...state,
        addPatientPending: false,
        addPatientError: action.data.error,
      };

    case ADMIN_ADD_PATIENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addPatientError: null,
      };

    default:
      return state;
  }
}
