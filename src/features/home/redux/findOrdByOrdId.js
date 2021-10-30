import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_FIND_ORD_BY_ORD_ID_BEGIN,
  HOME_FIND_ORD_BY_ORD_ID_SUCCESS,
  HOME_FIND_ORD_BY_ORD_ID_FAILURE,
  HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findOrdByOrdId(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FIND_ORD_BY_ORD_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Ordonnance/find`, requestJSON, config);
      doRequest.then(
        res => {
          dispatch({
            type: HOME_FIND_ORD_BY_ORD_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: HOME_FIND_ORD_BY_ORD_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindOrdByOrdIdError() {
  return {
    type: HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR,
  };
}

export function useFindOrdByOrdId() {
  const dispatch = useDispatch();

  const { findOrdByOrdIdPending, findOrdByOrdIdError } = useSelector(
    state => ({
      findOrdByOrdIdPending: state.home.findOrdByOrdIdPending,
      findOrdByOrdIdError: state.home.findOrdByOrdIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(findOrdByOrdId(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindOrdByOrdIdError());
  }, [dispatch]);

  return {
    findOrdByOrdId: boundAction,
    findOrdByOrdIdPending,
    findOrdByOrdIdError,
    dismissFindOrdByOrdIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FIND_ORD_BY_ORD_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findOrdByOrdIdPending: true,
        findOrdByOrdIdError: null,
      };

    case HOME_FIND_ORD_BY_ORD_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        findOrdByOrdIdPending: false,
        findOrdByOrdIdError: null,
      };

    case HOME_FIND_ORD_BY_ORD_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findOrdByOrdIdPending: false,
        findOrdByOrdIdError: action.data.error,
      };

    case HOME_FIND_ORD_BY_ORD_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findOrdByOrdIdError: null,
      };

    default:
      return state;
  }
}
