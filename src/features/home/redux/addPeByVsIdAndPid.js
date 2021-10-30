import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN,
  HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS,
  HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE,
  HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addPeByVsIdAndPid(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/PatientDetail/new`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddPeByVsIdAndPidError() {
  return {
    type: HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
  };
}

export function useAddPeByVsIdAndPid() {
  const dispatch = useDispatch();

  const { addPeByVsIdAndPidPending, addPeByVsIdAndPidError } = useSelector(
    state => ({
      addPeByVsIdAndPidPending: state.home.addPeByVsIdAndPidPending,
      addPeByVsIdAndPidError: state.home.addPeByVsIdAndPidError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addPeByVsIdAndPid(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddPeByVsIdAndPidError());
  }, [dispatch]);

  return {
    addPeByVsIdAndPid: boundAction,
    addPeByVsIdAndPidPending,
    addPeByVsIdAndPidError,
    dismissAddPeByVsIdAndPidError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_ADD_PE_BY_VS_ID_AND_PID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addPeByVsIdAndPidPending: true,
        addPeByVsIdAndPidError: null,
      };

    case HOME_ADD_PE_BY_VS_ID_AND_PID_SUCCESS:
      // The request is success
      return {
        ...state,
        addPeByVsIdAndPidPending: false,
        addPeByVsIdAndPidError: null,
      };

    case HOME_ADD_PE_BY_VS_ID_AND_PID_FAILURE:
      // The request is failed
      return {
        ...state,
        addPeByVsIdAndPidPending: false,
        addPeByVsIdAndPidError: action.data.error,
      };

    case HOME_ADD_PE_BY_VS_ID_AND_PID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addPeByVsIdAndPidError: null,
      };

    default:
      return state;
  }
}
