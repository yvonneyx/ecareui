import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN,
  HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS,
  HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE,
  HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findPatientDtlByVsId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/PatientDetail/find/detail`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindPatientDtlByVsIdError() {
  return {
    type: HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR,
  };
}

export function useFindPatientDtlByVsId() {
  const dispatch = useDispatch();

  const { findPatientDtlByVsIdPending, findPatientDtlByVsIdError } = useSelector(
    state => ({
      findPatientDtlByVsIdPending: state.home.findPatientDtlByVsIdPending,
      findPatientDtlByVsIdError: state.home.findPatientDtlByVsIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findPatientDtlByVsId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindPatientDtlByVsIdError());
  }, [dispatch]);

  return {
    findPatientDtlByVsId: boundAction,
    findPatientDtlByVsIdPending,
    findPatientDtlByVsIdError,
    dismissFindPatientDtlByVsIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FIND_PATIENT_DTL_BY_VS_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findPatientDtlByVsIdPending: true,
        findPatientDtlByVsIdError: null,
      };

    case HOME_FIND_PATIENT_DTL_BY_VS_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        findPatientDtlByVsIdPending: false,
        findPatientDtlByVsIdError: null,
      };

    case HOME_FIND_PATIENT_DTL_BY_VS_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findPatientDtlByVsIdPending: false,
        findPatientDtlByVsIdError: action.data.error,
      };

    case HOME_FIND_PATIENT_DTL_BY_VS_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findPatientDtlByVsIdError: null,
      };

    default:
      return state;
  }
}
