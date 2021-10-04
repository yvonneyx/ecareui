import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_GET_USERS_LIST_BEGIN,
  ADMIN_GET_USERS_LIST_SUCCESS,
  ADMIN_GET_USERS_LIST_FAILURE,
  ADMIN_GET_USERS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getUsersList(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_GET_USERS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/User/all`, config);
      doRequest.then(
        res => {
          dispatch({
            type: ADMIN_GET_USERS_LIST_SUCCESS,
            data: res.data.ext,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ADMIN_GET_USERS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetUsersListError() {
  return {
    type: ADMIN_GET_USERS_LIST_DISMISS_ERROR,
  };
}

export function useGetUsersList() {
  const dispatch = useDispatch();

  const { usersList, getUsersListPending, getUsersListError } = useSelector(
    state => ({
      usersList: state.admin.usersList,
      getUsersListPending: state.admin.getUsersListPending,
      getUsersListError: state.admin.getUsersListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(getUsersList(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetUsersListError());
  }, [dispatch]);

  return {
    usersList,
    getUsersList: boundAction,
    getUsersListPending,
    getUsersListError,
    dismissGetUsersListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_GET_USERS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getUsersListPending: true,
        getUsersListError: null,
      };

    case ADMIN_GET_USERS_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        usersList: action.data.users,
        getUsersListPending: false,
        getUsersListError: null,
      };

    case ADMIN_GET_USERS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getUsersListPending: false,
        getUsersListError: action.data.error,
      };

    case ADMIN_GET_USERS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getUsersListError: null,
      };

    default:
      return state;
  }
}
