import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_DELETE_USER_BEGIN,
  ADMIN_DELETE_USER_SUCCESS,
  ADMIN_DELETE_USER_FAILURE,
  ADMIN_DELETE_USER_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function deleteUser(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_DELETE_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/User/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_DELETE_USER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_DELETE_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteUserError() {
  return {
    type: ADMIN_DELETE_USER_DISMISS_ERROR,
  };
}

export function useDeleteUser() {
  const dispatch = useDispatch();

  const { deleteUserPending, deleteUserError } = useSelector(
    state => ({
      deleteUserPending: state.admin.deleteUserPending,
      deleteUserError: state.admin.deleteUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteUserError());
  }, [dispatch]);

  return {
    deleteUser: boundAction,
    deleteUserPending,
    deleteUserError,
    dismissDeleteUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_DELETE_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteUserPending: true,
        deleteUserError: null,
      };

    case ADMIN_DELETE_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteUserPending: false,
        deleteUserError: null,
      };

    case ADMIN_DELETE_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteUserPending: false,
        deleteUserError: action.data.error,
      };

    case ADMIN_DELETE_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteUserError: null,
      };

    default:
      return state;
  }
}
