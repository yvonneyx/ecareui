import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_GET_INFIRMIERES_LIST_BEGIN,
  ADMIN_GET_INFIRMIERES_LIST_SUCCESS,
  ADMIN_GET_INFIRMIERES_LIST_FAILURE,
  ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getInfirmieresList(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_GET_INFIRMIERES_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/Infirmiere/all`, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: ADMIN_GET_INFIRMIERES_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ADMIN_GET_INFIRMIERES_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetInfirmieresListError() {
  return {
    type: ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR,
  };
}

export function useGetInfirmieresList() {
  const dispatch = useDispatch();

  const { infirmieresList, getInfirmieresListPending, getInfirmieresListError } = useSelector(
    state => ({
      infirmieresList: state.admin.infirmieresList,
      getInfirmieresListPending: state.admin.getInfirmieresListPending,
      getInfirmieresListError: state.admin.getInfirmieresListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(getInfirmieresList(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetInfirmieresListError());
  }, [dispatch]);

  return {
    infirmieresList,
    getInfirmieresList: boundAction,
    getInfirmieresListPending,
    getInfirmieresListError,
    dismissGetInfirmieresListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_GET_INFIRMIERES_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getInfirmieresListPending: true,
        getInfirmieresListError: null,
      };

    case ADMIN_GET_INFIRMIERES_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        infirmieresList: action.data,
        getInfirmieresListPending: false,
        getInfirmieresListError: null,
      };

    case ADMIN_GET_INFIRMIERES_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getInfirmieresListPending: false,
        getInfirmieresListError: action.data.error,
      };

    case ADMIN_GET_INFIRMIERES_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getInfirmieresListError: null,
      };

    default:
      return state;
  }
}
