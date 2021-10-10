import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_UPDATE_PATIENT_BEGIN,
  ADMIN_UPDATE_PATIENT_SUCCESS,
  ADMIN_UPDATE_PATIENT_FAILURE,
  ADMIN_UPDATE_PATIENT_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updatePatient(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_UPDATE_PATIENT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Patient/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_UPDATE_PATIENT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_UPDATE_PATIENT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdatePatientError() {
  return {
    type: ADMIN_UPDATE_PATIENT_DISMISS_ERROR,
  };
}

export function useUpdatePatient() {
  const dispatch = useDispatch();

  const { updatePatientPending, updatePatientError } = useSelector(
    state => ({
      updatePatientPending: state.admin.updatePatientPending,
      updatePatientError: state.admin.updatePatientError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updatePatient(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdatePatientError());
  }, [dispatch]);

  return {
    updatePatient: boundAction,
    updatePatientPending,
    updatePatientError,
    dismissUpdatePatientError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_UPDATE_PATIENT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updatePatientPending: true,
        updatePatientError: null,
      };

    case ADMIN_UPDATE_PATIENT_SUCCESS:
      // The request is success
      return {
        ...state,
        updatePatientPending: false,
        updatePatientError: null,
      };

    case ADMIN_UPDATE_PATIENT_FAILURE:
      // The request is failed
      return {
        ...state,
        updatePatientPending: false,
        updatePatientError: action.data.error,
      };

    case ADMIN_UPDATE_PATIENT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updatePatientError: null,
      };

    default:
      return state;
  }
}
