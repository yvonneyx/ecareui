import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_ADD_VISITE_BEGIN,
  HOME_ADD_VISITE_SUCCESS,
  HOME_ADD_VISITE_FAILURE,
  HOME_ADD_VISITE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function addVisite(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_ADD_VISITE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Visite/new`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_ADD_VISITE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_ADD_VISITE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAddVisiteError() {
  return {
    type: HOME_ADD_VISITE_DISMISS_ERROR,
  };
}

export function useAddVisite() {
  const dispatch = useDispatch();

  const { addVisitePending, addVisiteError } = useSelector(
    state => ({
      addVisitePending: state.home.addVisitePending,
      addVisiteError: state.home.addVisiteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(addVisite(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAddVisiteError());
  }, [dispatch]);

  return {
    addVisite: boundAction,
    addVisitePending,
    addVisiteError,
    dismissAddVisiteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_ADD_VISITE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addVisitePending: true,
        addVisiteError: null,
      };

    case HOME_ADD_VISITE_SUCCESS:
      // The request is success
      return {
        ...state,
        addVisitePending: false,
        addVisiteError: null,
      };

    case HOME_ADD_VISITE_FAILURE:
      // The request is failed
      return {
        ...state,
        addVisitePending: false,
        addVisiteError: action.data.error,
      };

    case HOME_ADD_VISITE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addVisiteError: null,
      };

    default:
      return state;
  }
}
