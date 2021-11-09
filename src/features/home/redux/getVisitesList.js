import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_GET_VISITES_LIST_BEGIN,
  HOME_GET_VISITES_LIST_SUCCESS,
  HOME_GET_VISITES_LIST_FAILURE,
  HOME_GET_VISITES_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getVisitesList(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: HOME_GET_VISITES_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Visite/all`, config);
      doRequest.then(
        res => {
          dispatch({
            type: HOME_GET_VISITES_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: HOME_GET_VISITES_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetVisitesListError() {
  return {
    type: HOME_GET_VISITES_LIST_DISMISS_ERROR,
  };
}

export function useGetVisitesList() {
  const dispatch = useDispatch();

  const { visitesList, getVisitesListPending, getVisitesListError } = useSelector(
    state => ({
      visitesList: state.home.visitesList,
      getVisitesListPending: state.home.getVisitesListPending,
      getVisitesListError: state.home.getVisitesListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(getVisitesList(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetVisitesListError());
  }, [dispatch]);

  return {
    visitesList,
    getVisitesList: boundAction,
    getVisitesListPending,
    getVisitesListError,
    dismissGetVisitesListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_VISITES_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getVisitesListPending: true,
        getVisitesListError: null,
      };

    case HOME_GET_VISITES_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        visitesList: action.data.ext && action.data.ext.visites,
        getVisitesListPending: false,
        getVisitesListError: null,
      };

    case HOME_GET_VISITES_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getVisitesListPending: false,
        getVisitesListError: action.data.error,
      };

    case HOME_GET_VISITES_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getVisitesListError: null,
      };

    default:
      return state;
  }
}
