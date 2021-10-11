import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_DELETE_VISITE_BEGIN,
  HOME_DELETE_VISITE_SUCCESS,
  HOME_DELETE_VISITE_FAILURE,
  HOME_DELETE_VISITE_DISMISS_ERROR,
} from './constants';

export function deleteVisite(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_DELETE_VISITE_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = args.error ? Promise.reject(new Error()) : Promise.resolve();
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_DELETE_VISITE_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_DELETE_VISITE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissDeleteVisiteError() {
  return {
    type: HOME_DELETE_VISITE_DISMISS_ERROR,
  };
}

export function useDeleteVisite() {
  const dispatch = useDispatch();

  const { deleteVisitePending, deleteVisiteError } = useSelector(
    state => ({
      deleteVisitePending: state.home.deleteVisitePending,
      deleteVisiteError: state.home.deleteVisiteError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(deleteVisite(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissDeleteVisiteError());
  }, [dispatch]);

  return {
    deleteVisite: boundAction,
    deleteVisitePending,
    deleteVisiteError,
    dismissDeleteVisiteError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_DELETE_VISITE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteVisitePending: true,
        deleteVisiteError: null,
      };

    case HOME_DELETE_VISITE_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteVisitePending: false,
        deleteVisiteError: null,
      };

    case HOME_DELETE_VISITE_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteVisitePending: false,
        deleteVisiteError: action.data.error,
      };

    case HOME_DELETE_VISITE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteVisiteError: null,
      };

    default:
      return state;
  }
}
