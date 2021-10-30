import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FIND_VS_DTL_BY_VS_ID_BEGIN,
  HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS,
  HOME_FIND_VS_DTL_BY_VS_ID_FAILURE,
  HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findVsDtlByVsId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FIND_VS_DTL_BY_VS_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/VisiteDetail/find/visitId`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FIND_VS_DTL_BY_VS_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindVsDtlByVsIdError() {
  return {
    type: HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR,
  };
}

export function useFindVsDtlByVsId() {
  const dispatch = useDispatch();

  const { findVsDtlByVsIdPending, findVsDtlByVsIdError } = useSelector(
    state => ({
      findVsDtlByVsIdPending: state.home.findVsDtlByVsIdPending,
      findVsDtlByVsIdError: state.home.findVsDtlByVsIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findVsDtlByVsId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindVsDtlByVsIdError());
  }, [dispatch]);

  return {
    findVsDtlByVsId: boundAction,
    findVsDtlByVsIdPending,
    findVsDtlByVsIdError,
    dismissFindVsDtlByVsIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FIND_VS_DTL_BY_VS_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findVsDtlByVsIdPending: true,
        findVsDtlByVsIdError: null,
      };

    case HOME_FIND_VS_DTL_BY_VS_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        findVsDtlByVsIdPending: false,
        findVsDtlByVsIdError: null,
      };

    case HOME_FIND_VS_DTL_BY_VS_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findVsDtlByVsIdPending: false,
        findVsDtlByVsIdError: action.data.error,
      };

    case HOME_FIND_VS_DTL_BY_VS_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findVsDtlByVsIdError: null,
      };

    default:
      return state;
  }
}
