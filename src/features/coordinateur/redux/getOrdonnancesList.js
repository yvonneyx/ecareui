import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  COORDINATEUR_GET_ORDONNANCES_LIST_BEGIN,
  COORDINATEUR_GET_ORDONNANCES_LIST_SUCCESS,
  COORDINATEUR_GET_ORDONNANCES_LIST_FAILURE,
  COORDINATEUR_GET_ORDONNANCES_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getOrdonnancesList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: COORDINATEUR_GET_ORDONNANCES_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Ordonnance/all`, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: COORDINATEUR_GET_ORDONNANCES_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: COORDINATEUR_GET_ORDONNANCES_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetOrdonnancesListError() {
  return {
    type: COORDINATEUR_GET_ORDONNANCES_LIST_DISMISS_ERROR,
  };
}

export function useGetOrdonnancesList() {
  const dispatch = useDispatch();

  const { ordonnancesList, getOrdonnancesListPending, getOrdonnancesListError } = useSelector(
    state => ({
      ordonnancesList: state.coordinateur.ordonnancesList,
      getOrdonnancesListPending: state.coordinateur.getOrdonnancesListPending,
      getOrdonnancesListError: state.coordinateur.getOrdonnancesListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getOrdonnancesList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetOrdonnancesListError());
  }, [dispatch]);

  return {
    ordonnancesList,
    getOrdonnancesList: boundAction,
    getOrdonnancesListPending,
    getOrdonnancesListError,
    dismissGetOrdonnancesListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COORDINATEUR_GET_ORDONNANCES_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getOrdonnancesListPending: true,
        getOrdonnancesListError: null,
      };

    case COORDINATEUR_GET_ORDONNANCES_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        ordonnancesList: action.data.ext.ordonnances,
        getOrdonnancesListPending: false,
        getOrdonnancesListError: null,
      };

    case COORDINATEUR_GET_ORDONNANCES_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getOrdonnancesListPending: false,
        getOrdonnancesListError: action.data.error,
      };

    case COORDINATEUR_GET_ORDONNANCES_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getOrdonnancesListError: null,
      };

    default:
      return state;
  }
}
