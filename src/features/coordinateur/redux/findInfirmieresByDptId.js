import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN,
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS,
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE,
  COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findInfirmieresByDptId(args = {}) {
  return dispatch => {
    // optionally you can have getState as the second argument
    dispatch({
      type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Infirmiere/find/departement`, requestJSON, config);
      doRequest.then(
        res => {
          dispatch({
            type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        err => {
          dispatch({
            type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindInfirmieresByDptIdError() {
  return {
    type: COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR,
  };
}

export function useFindInfirmieresByDptId() {
  const dispatch = useDispatch();

  const { infirmieres, findInfirmieresByDptIdPending, findInfirmieresByDptIdError } = useSelector(
    state => ({
      infirmieres: state.coordinateur.infirmieres,
      findInfirmieresByDptIdPending: state.coordinateur.findInfirmieresByDptIdPending,
      findInfirmieresByDptIdError: state.coordinateur.findInfirmieresByDptIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (...args) => {
      return dispatch(findInfirmieresByDptId(...args));
    },
    [dispatch],
  );

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindInfirmieresByDptIdError());
  }, [dispatch]);

  return {
    infirmieres,
    findInfirmieresByDptId: boundAction,
    findInfirmieresByDptIdPending,
    findInfirmieresByDptIdError,
    dismissFindInfirmieresByDptIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findInfirmieresByDptIdPending: true,
        findInfirmieresByDptIdError: null,
      };

    case COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        // infirmieres: _.concat(state.infirmieres, action.data),
        infirmieres: action.data,
        findInfirmieresByDptIdPending: false,
        findInfirmieresByDptIdError: null,
      };

    case COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findInfirmieresByDptIdPending: false,
        findInfirmieresByDptIdError: action.data.error,
      };

    case COORDINATEUR_FIND_INFIRMIERES_BY_DPT_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findInfirmieresByDptIdError: null,
      };

    default:
      return state;
  }
}
