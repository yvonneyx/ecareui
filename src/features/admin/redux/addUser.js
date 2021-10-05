import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_ADD_USER_BEGIN,
  ADMIN_ADD_USER_SUCCESS,
  ADMIN_ADD_USER_FAILURE,
  ADMIN_ADD_USER_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addUser(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_ADD_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/User/new`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_ADD_USER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_ADD_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddUserError() {
  return {
    type: ADMIN_ADD_USER_DISMISS_ERROR,
  };
}

export function useAddUser() {
  const dispatch = useDispatch();

  const { addUserPending, addUserError } = useSelector(
    state => ({
      addUserPending: state.admin.addUserPending,
      addUserError: state.admin.addUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddUserError());
  }, [dispatch]);

  return {
    addUser: boundAction,
    addUserPending,
    addUserError,
    dismissAddUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_ADD_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addUserPending: true,
        addUserError: null,
      };

    case ADMIN_ADD_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        addUserPending: false,
        addUserError: null,
      };

    case ADMIN_ADD_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        addUserPending: false,
        addUserError: action.data.error,
      };

    case ADMIN_ADD_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addUserError: null,
      };

    default:
      return state;
  }
}
