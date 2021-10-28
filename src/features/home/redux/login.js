import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_LOGIN_BEGIN,
  HOME_LOGIN_SUCCESS,
  HOME_LOGIN_FAILURE,
  HOME_LOGIN_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function login(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_LOGIN_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/User/login`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_LOGIN_SUCCESS,
            data: res.data.ext.user,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_LOGIN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissLoginError() {
  return {
    type: HOME_LOGIN_DISMISS_ERROR,
  };
}

export function useLogin() {
  const dispatch = useDispatch();

  const { loggedUserInfo, isLogined, loginPending, loginError } = useSelector(
    state => ({
      loginUserInfo: state.home.loggedUserInfo,
      isLogined: state.home.isLogined,
      loginPending: state.home.loginPending,
      loginError: state.home.loginError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(login(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissLoginError());
  }, [dispatch]);

  return {
    loggedUserInfo,
    isLogined,
    login: boundAction,
    loginPending,
    loginError,
    dismissLoginError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_LOGIN_BEGIN:
      return {
        ...state,
        isLogined: false,
        loginPending: true,
        loginError: null,
      };

    case HOME_LOGIN_SUCCESS:
      return {
        ...state,
        loggedUserInfo: {
          id: action.data.userId,
          name: action.data.userNom,
          role: action.data.userType,
        },
        isLogined: true,
        loginPending: false,
        loginError: null,
      };

    case HOME_LOGIN_FAILURE:
      return {
        ...state,
        isLogined: false,
        loginPending: false,
        loginError: action.data.error,
      };

    case HOME_LOGIN_DISMISS_ERROR:
      return {
        ...state,
        loginError: null,
      };

    default:
      return state;
  }
}
