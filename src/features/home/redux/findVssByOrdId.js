import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FIND_VSS_BY_ORD_ID_BEGIN,
  HOME_FIND_VSS_BY_ORD_ID_SUCCESS,
  HOME_FIND_VSS_BY_ORD_ID_FAILURE,
  HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findVssByOrdId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FIND_VSS_BY_ORD_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Visite/all/ordonnanceId`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_FIND_VSS_BY_ORD_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_FIND_VSS_BY_ORD_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindVssByOrdIdError() {
  return {
    type: HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR,
  };
}

export function useFindVssByOrdId() {
  const dispatch = useDispatch();

  const { findVssByOrdIdPending, findVssByOrdIdError } = useSelector(
    state => ({
      findVssByOrdIdPending: state.home.findVssByOrdIdPending,
      findVssByOrdIdError: state.home.findVssByOrdIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findVssByOrdId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindVssByOrdIdError());
  }, [dispatch]);

  return {
    findVssByOrdId: boundAction,
    findVssByOrdIdPending,
    findVssByOrdIdError,
    dismissFindVssByOrdIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FIND_VSS_BY_ORD_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findVssByOrdIdPending: true,
        findVssByOrdIdError: null,
      };

    case HOME_FIND_VSS_BY_ORD_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        findVssByOrdIdPending: false,
        findVssByOrdIdError: null,
      };

    case HOME_FIND_VSS_BY_ORD_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findVssByOrdIdPending: false,
        findVssByOrdIdError: action.data.error,
      };

    case HOME_FIND_VSS_BY_ORD_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findVssByOrdIdError: null,
      };

    default:
      return state;
  }
}
