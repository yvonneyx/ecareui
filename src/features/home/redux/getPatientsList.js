import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_PATIENTS_LIST_BEGIN,
  HOME_GET_PATIENTS_LIST_SUCCESS,
  HOME_GET_PATIENTS_LIST_FAILURE,
  HOME_GET_PATIENTS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getPatientsList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_PATIENTS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Patient/all`, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_GET_PATIENTS_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_GET_PATIENTS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetPatientsListError() {
  return {
    type: HOME_GET_PATIENTS_LIST_DISMISS_ERROR,
  };
}

export function useGetPatientsList() {
  const dispatch = useDispatch();

  const { patientsList, getPatientsListPending, getPatientsListError } = useSelector(
    state => ({
      patientsList: state.home.patientsList,
      getPatientsListPending: state.home.getPatientsListPending,
      getPatientsListError: state.home.getPatientsListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getPatientsList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetPatientsListError());
  }, [dispatch]);

  return {
    patientsList,
    getPatientsList: boundAction,
    getPatientsListPending,
    getPatientsListError,
    dismissGetPatientsListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_PATIENTS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getPatientsListPending: true,
        getPatientsListError: null,
      };

    case HOME_GET_PATIENTS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        patientsList: action.data.ext.patients,
        getPatientsListPending: false,
        getPatientsListError: null,
      };

    case HOME_GET_PATIENTS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getPatientsListPending: false,
        getPatientsListError: action.data.error,
      };

    case HOME_GET_PATIENTS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getPatientsListError: null,
      };

    default:
      return state;
  }
}
