import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_GET_COORS_LIST_BEGIN,
  ADMIN_GET_COORS_LIST_SUCCESS,
  ADMIN_GET_COORS_LIST_FAILURE,
  ADMIN_GET_COORS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getCoorsList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_GET_COORS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Coordinateur/all`, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_GET_COORS_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_GET_COORS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetCoorsListError() {
  return {
    type: ADMIN_GET_COORS_LIST_DISMISS_ERROR,
  };
}

export function useGetCoorsList() {
  const dispatch = useDispatch();

  const { coorsList, getCoorsListPending, getCoorsListError } = useSelector(
    state => ({
      coorsList: state.admin.coorsList,
      getCoorsListPending: state.admin.getCoorsListPending,
      getCoorsListError: state.admin.getCoorsListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getCoorsList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetCoorsListError());
  }, [dispatch]);

  return {
    coorsList,
    getCoorsList: boundAction,
    getCoorsListPending,
    getCoorsListError,
    dismissGetCoorsListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_GET_COORS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getCoorsListPending: true,
        getCoorsListError: null,
      };

    case ADMIN_GET_COORS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        coorsList: action.data,
        getCoorsListPending: false,
        getCoorsListError: null,
      };

    case ADMIN_GET_COORS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getCoorsListPending: false,
        getCoorsListError: action.data.error,
      };

    case ADMIN_GET_COORS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getCoorsListError: null,
      };

    default:
      return state;
  }
}
