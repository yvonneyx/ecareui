import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UPDATE_ORDONNANCE_BEGIN,
  HOME_UPDATE_ORDONNANCE_SUCCESS,
  HOME_UPDATE_ORDONNANCE_FAILURE,
  HOME_UPDATE_ORDONNANCE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateOrdonnance(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UPDATE_ORDONNANCE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Ordonnance/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_UPDATE_ORDONNANCE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_UPDATE_ORDONNANCE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateOrdonnanceError() {
  return {
    type: HOME_UPDATE_ORDONNANCE_DISMISS_ERROR,
  };
}

export function useUpdateOrdonnance() {
  const dispatch = useDispatch();

  const { updateOrdonnancePending, updateOrdonnanceError } = useSelector(
    state => ({
      updateOrdonnancePending: state.home.updateOrdonnancePending,
      updateOrdonnanceError: state.home.updateOrdonnanceError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateOrdonnance(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateOrdonnanceError());
  }, [dispatch]);

  return {
    updateOrdonnance: boundAction,
    updateOrdonnancePending,
    updateOrdonnanceError,
    dismissUpdateOrdonnanceError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPDATE_ORDONNANCE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateOrdonnancePending: true,
        updateOrdonnanceError: null,
      };

    case HOME_UPDATE_ORDONNANCE_SUCCESS:
      // The request is success
      return {
        ...state,
        updateOrdonnancePending: false,
        updateOrdonnanceError: null,
      };

    case HOME_UPDATE_ORDONNANCE_FAILURE:
      // The request is failed
      return {
        ...state,
        updateOrdonnancePending: false,
        updateOrdonnanceError: action.data.error,
      };

    case HOME_UPDATE_ORDONNANCE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateOrdonnanceError: null,
      };

    default:
      return state;
  }
}
