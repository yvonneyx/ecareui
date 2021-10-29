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
            data: res.data.ext,
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

  const { loginPending, loginError } = useSelector(
    state => ({
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
        loginPending: true,
        loginError: null,
      };

    case HOME_LOGIN_SUCCESS:
      return {
        ...state,
        loginPending: false,
        loginError: null,
      };

    case HOME_LOGIN_FAILURE:
      return {
        ...state,
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
