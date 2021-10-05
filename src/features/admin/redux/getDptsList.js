import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_GET_DPTS_LIST_BEGIN,
  ADMIN_GET_DPTS_LIST_SUCCESS,
  ADMIN_GET_DPTS_LIST_FAILURE,
  ADMIN_GET_DPTS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getDptsList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_GET_DPTS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Departement/all`, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_GET_DPTS_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_GET_DPTS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetDptsListError() {
  return {
    type: ADMIN_GET_DPTS_LIST_DISMISS_ERROR,
  };
}

export function useGetDptsList() {
  const dispatch = useDispatch();

  const { dptsList, getDptsListPending, getDptsListError } = useSelector(
    state => ({
      dptsList: state.admin.dptsList,
      getDptsListPending: state.admin.getDptsListPending,
      getDptsListError: state.admin.getDptsListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getDptsList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetDptsListError());
  }, [dispatch]);

  return {
    dptsList,
    getDptsList: boundAction,
    getDptsListPending,
    getDptsListError,
    dismissGetDptsListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_GET_DPTS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getDptsListPending: true,
        getDptsListError: null,
      };

    case ADMIN_GET_DPTS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        dptsList: action.data,
        getDptsListPending: false,
        getDptsListError: null,
      };

    case ADMIN_GET_DPTS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getDptsListPending: false,
        getDptsListError: action.data.error,
      };

    case ADMIN_GET_DPTS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getDptsListError: null,
      };

    default:
      return state;
  }
}
