import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_UPDATE_USER_BEGIN,
  ADMIN_UPDATE_USER_SUCCESS,
  ADMIN_UPDATE_USER_FAILURE,
  ADMIN_UPDATE_USER_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateUser(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_UPDATE_USER_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/User/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_UPDATE_USER_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_UPDATE_USER_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateUserError() {
  return {
    type: ADMIN_UPDATE_USER_DISMISS_ERROR,
  };
}

export function useUpdateUser() {
  const dispatch = useDispatch();

  const { updateUserPending, updateUserError } = useSelector(
    state => ({
      updateUserPending: state.admin.updateUserPending,
      updateUserError: state.admin.updateUserError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateUser(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateUserError());
  }, [dispatch]);

  return {
    updateUser: boundAction,
    updateUserPending,
    updateUserError,
    dismissUpdateUserError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_UPDATE_USER_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateUserPending: true,
        updateUserError: null,
      };

    case ADMIN_UPDATE_USER_SUCCESS:
      // The request is success
      return {
        ...state,
        updateUserPending: false,
        updateUserError: null,
      };

    case ADMIN_UPDATE_USER_FAILURE:
      // The request is failed
      return {
        ...state,
        updateUserPending: false,
        updateUserError: action.data.error,
      };

    case ADMIN_UPDATE_USER_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateUserError: null,
      };

    default:
      return state;
  }
}
