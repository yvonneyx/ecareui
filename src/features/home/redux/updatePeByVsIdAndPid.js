import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN,
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS,
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE,
  HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updatePeByVsIdAndPid(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/PatientDetail/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdatePeByVsIdAndPidError() {
  return {
    type: HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR,
  };
}

export function useUpdatePeByVsIdAndPid() {
  const dispatch = useDispatch();

  const { updatePeByVsIdAndPidPending, updatePeByVsIdAndPidError } = useSelector(
    state => ({
      updatePeByVsIdAndPidPending: state.home.updatePeByVsIdAndPidPending,
      updatePeByVsIdAndPidError: state.home.updatePeByVsIdAndPidError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updatePeByVsIdAndPid(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdatePeByVsIdAndPidError());
  }, [dispatch]);

  return {
    updatePeByVsIdAndPid: boundAction,
    updatePeByVsIdAndPidPending,
    updatePeByVsIdAndPidError,
    dismissUpdatePeByVsIdAndPidError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPDATE_PE_BY_VS_ID_AND_PID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updatePeByVsIdAndPidPending: true,
        updatePeByVsIdAndPidError: null,
      };

    case HOME_UPDATE_PE_BY_VS_ID_AND_PID_SUCCESS:
      // The request is success
      return {
        ...state,
        updatePeByVsIdAndPidPending: false,
        updatePeByVsIdAndPidError: null,
      };

    case HOME_UPDATE_PE_BY_VS_ID_AND_PID_FAILURE:
      // The request is failed
      return {
        ...state,
        updatePeByVsIdAndPidPending: false,
        updatePeByVsIdAndPidError: action.data.error,
      };

    case HOME_UPDATE_PE_BY_VS_ID_AND_PID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updatePeByVsIdAndPidError: null,
      };

    default:
      return state;
  }
}
