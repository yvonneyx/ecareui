import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_ADD_EM_BY_VS_ID_BEGIN,
  HOME_ADD_EM_BY_VS_ID_SUCCESS,
  HOME_ADD_EM_BY_VS_ID_FAILURE,
  HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addEmByVsId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_ADD_EM_BY_VS_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/VisiteDetail/new`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_ADD_EM_BY_VS_ID_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_ADD_EM_BY_VS_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddEmByVsIdError() {
  return {
    type: HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR,
  };
}

export function useAddEmByVsId() {
  const dispatch = useDispatch();

  const { addEmByVsIdPending, addEmByVsIdError } = useSelector(
    state => ({
      addEmByVsIdPending: state.home.addEmByVsIdPending,
      addEmByVsIdError: state.home.addEmByVsIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addEmByVsId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddEmByVsIdError());
  }, [dispatch]);

  return {
    addEmByVsId: boundAction,
    addEmByVsIdPending,
    addEmByVsIdError,
    dismissAddEmByVsIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_ADD_EM_BY_VS_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addEmByVsIdPending: true,
        addEmByVsIdError: null,
      };

    case HOME_ADD_EM_BY_VS_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        addEmByVsIdPending: false,
        addEmByVsIdError: null,
      };

    case HOME_ADD_EM_BY_VS_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        addEmByVsIdPending: false,
        addEmByVsIdError: action.data.error,
      };

    case HOME_ADD_EM_BY_VS_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addEmByVsIdError: null,
      };

    default:
      return state;
  }
}
