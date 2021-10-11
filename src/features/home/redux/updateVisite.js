import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UPDATE_VISITE_BEGIN,
  HOME_UPDATE_VISITE_SUCCESS,
  HOME_UPDATE_VISITE_FAILURE,
  HOME_UPDATE_VISITE_DISMISS_ERROR,
} from './constants';

export function updateVisite(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UPDATE_VISITE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = args.error ? Promise.reject(new Error()) : Promise.resolve();
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_UPDATE_VISITE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_UPDATE_VISITE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUpdateVisiteError() {
  return {
    type: HOME_UPDATE_VISITE_DISMISS_ERROR,
  };
}

export function useUpdateVisite() {
  const dispatch = useDispatch();

  const { updateVisitePending, updateVisiteError } = useSelector(
    state => ({
      updateVisitePending: state.home.updateVisitePending,
      updateVisiteError: state.home.updateVisiteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(updateVisite(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUpdateVisiteError());
  }, [dispatch]);

  return {
    updateVisite: boundAction,
    updateVisitePending,
    updateVisiteError,
    dismissUpdateVisiteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPDATE_VISITE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        updateVisitePending: true,
        updateVisiteError: null,
      };

    case HOME_UPDATE_VISITE_SUCCESS:
      // The request is success
      return {
        ...state,
        updateVisitePending: false,
        updateVisiteError: null,
      };

    case HOME_UPDATE_VISITE_FAILURE:
      // The request is failed
      return {
        ...state,
        updateVisitePending: false,
        updateVisiteError: action.data.error,
      };

    case HOME_UPDATE_VISITE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        updateVisiteError: null,
      };

    default:
      return state;
  }
}
