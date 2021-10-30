import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UPDATE_EM_BY_VS_ID_BEGIN,
  HOME_UPDATE_EM_BY_VS_ID_SUCCESS,
  HOME_UPDATE_EM_BY_VS_ID_FAILURE,
  HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateEmByVsId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UPDATE_EM_BY_VS_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/VisiteDetail/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_UPDATE_EM_BY_VS_ID_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_UPDATE_EM_BY_VS_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateEmByVsIdError() {
  return {
    type: HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR,
  };
}

export function useUpdateEmByVsId() {
  const dispatch = useDispatch();

  const { updateEmByVsIdPending, updateEmByVsIdError } = useSelector(
    state => ({
      updateEmByVsIdPending: state.home.updateEmByVsIdPending,
      updateEmByVsIdError: state.home.updateEmByVsIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateEmByVsId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateEmByVsIdError());
  }, [dispatch]);

  return {
    updateEmByVsId: boundAction,
    updateEmByVsIdPending,
    updateEmByVsIdError,
    dismissUpdateEmByVsIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPDATE_EM_BY_VS_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateEmByVsIdPending: true,
        updateEmByVsIdError: null,
      };

    case HOME_UPDATE_EM_BY_VS_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        updateEmByVsIdPending: false,
        updateEmByVsIdError: null,
      };

    case HOME_UPDATE_EM_BY_VS_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        updateEmByVsIdPending: false,
        updateEmByVsIdError: action.data.error,
      };

    case HOME_UPDATE_EM_BY_VS_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateEmByVsIdError: null,
      };

    default:
      return state;
  }
}
