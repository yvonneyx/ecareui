import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_UPDATE_COOR_BEGIN,
  ADMIN_UPDATE_COOR_SUCCESS,
  ADMIN_UPDATE_COOR_FAILURE,
  ADMIN_UPDATE_COOR_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function updateCoor(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_UPDATE_COOR_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Coordinateur/change`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_UPDATE_COOR_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_UPDATE_COOR_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateCoorError() {
  return {
    type: ADMIN_UPDATE_COOR_DISMISS_ERROR,
  };
}

export function useUpdateCoor() {
  const dispatch = useDispatch();

  const { updateCoorPending, updateCoorError } = useSelector(
    state => ({
      updateCoorPending: state.admin.updateCoorPending,
      updateCoorError: state.admin.updateCoorError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateCoor(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateCoorError());
  }, [dispatch]);

  return {
    updateCoor: boundAction,
    updateCoorPending,
    updateCoorError,
    dismissUpdateCoorError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_UPDATE_COOR_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateCoorPending: true,
        updateCoorError: null,
      };

    case ADMIN_UPDATE_COOR_SUCCESS:
      // The request is success
      return {
        ...state,
        updateCoorPending: false,
        updateCoorError: null,
      };

    case ADMIN_UPDATE_COOR_FAILURE:
      // The request is failed
      return {
        ...state,
        updateCoorPending: false,
        updateCoorError: action.data.error,
      };

    case ADMIN_UPDATE_COOR_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateCoorError: null,
      };

    default:
      return state;
  }
}
