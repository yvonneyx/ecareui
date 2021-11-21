import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  ADMIN_GET_EXAMENS_LIST_BEGIN,
  ADMIN_GET_EXAMENS_LIST_SUCCESS,
  ADMIN_GET_EXAMENS_LIST_FAILURE,
  ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function getExamensList(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: ADMIN_GET_EXAMENS_LIST_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.get(`${serverUrl}/ExamenMedical/find`, config);
      doRequest.then(
        res => {
          console.log('200', new Date().getMilliseconds());

          dispatch({
            type: ADMIN_GET_EXAMENS_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: ADMIN_GET_EXAMENS_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissGetExamensListError() {
  return {
    type: ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR,
  };
}

export function useGetExamensList() {
  const dispatch = useDispatch();

  const { examensList, getExamensListPending, getExamensListError } = useSelector(
    state => ({
      examensList: state.admin.examensList,
      getExamensListPending: state.admin.getExamensListPending,
      getExamensListError: state.admin.getExamensListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(getExamensList(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissGetExamensListError());
  }, [dispatch]);

  return {
    examensList,
    getExamensList: boundAction,
    getExamensListPending,
    getExamensListError,
    dismissGetExamensListError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ADMIN_GET_EXAMENS_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        getExamensListPending: true,
        getExamensListError: null,
      };

    case ADMIN_GET_EXAMENS_LIST_SUCCESS:
      // The request is success
      console.log('ADMIN_GET_EXAMENS_LIST_SUCCESS', new Date().getMilliseconds());
      return {
        ...state,
        examensList: action.data.ext.examenMedicals,
        getExamensListPending: false,
        getExamensListError: null,
      };

    case ADMIN_GET_EXAMENS_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        getExamensListPending: false,
        getExamensListError: action.data.error,
      };

    case ADMIN_GET_EXAMENS_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        getExamensListError: null,
      };

    default:
      return state;
  }
}
