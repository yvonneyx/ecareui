import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_DELETE_COOR_BEGIN,
  ADMIN_DELETE_COOR_SUCCESS,
  ADMIN_DELETE_COOR_FAILURE,
  ADMIN_DELETE_COOR_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function deleteCoor(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_DELETE_COOR_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Coordinateur/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_DELETE_COOR_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_DELETE_COOR_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteCoorError() {
  return {
    type: ADMIN_DELETE_COOR_DISMISS_ERROR,
  };
}

export function useDeleteCoor() {
  const dispatch = useDispatch();

  const { deleteCoorPending, deleteCoorError } = useSelector(
    state => ({
      deleteCoorPending: state.admin.deleteCoorPending,
      deleteCoorError: state.admin.deleteCoorError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteCoor(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteCoorError());
  }, [dispatch]);

  return {
    deleteCoor: boundAction,
    deleteCoorPending,
    deleteCoorError,
    dismissDeleteCoorError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_DELETE_COOR_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteCoorPending: true,
        deleteCoorError: null,
      };

    case ADMIN_DELETE_COOR_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteCoorPending: false,
        deleteCoorError: null,
      };

    case ADMIN_DELETE_COOR_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteCoorPending: false,
        deleteCoorError: action.data.error,
      };

    case ADMIN_DELETE_COOR_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteCoorError: null,
      };

    default:
      return state;
  }
}
