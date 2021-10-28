import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN,
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS,
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE,
  INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config } from '../../../common/globalConfig';

export function findVssByInfirmId(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/Visite/find`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissFindVssByInfirmIdError() {
  return {
    type: INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR,
  };
}

export function useFindVssByInfirmId() {
  const dispatch = useDispatch();

  const { vssByInfirmId, findVssByInfirmIdPending, findVssByInfirmIdError } = useSelector(
    state => ({
      vssByInfirmId: state.infirmiere.vssByInfirmId,
      findVssByInfirmIdPending: state.infirmiere.findVssByInfirmIdPending,
      findVssByInfirmIdError: state.infirmiere.findVssByInfirmIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(findVssByInfirmId(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissFindVssByInfirmIdError());
  }, [dispatch]);

  return {
    vssByInfirmId,
    findVssByInfirmId: boundAction,
    findVssByInfirmIdPending,
    findVssByInfirmIdError,
    dismissFindVssByInfirmIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case INFIRMIERE_FIND_VSS_BY_INFIRM_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        findVssByInfirmIdPending: true,
        findVssByInfirmIdError: null,
      };

    case INFIRMIERE_FIND_VSS_BY_INFIRM_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        vssByInfirmId: action.data.ext.visites,
        findVssByInfirmIdPending: false,
        findVssByInfirmIdError: null,
      };

    case INFIRMIERE_FIND_VSS_BY_INFIRM_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        findVssByInfirmIdPending: false,
        findVssByInfirmIdError: action.data.error,
      };

    case INFIRMIERE_FIND_VSS_BY_INFIRM_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        findVssByInfirmIdError: null,
      };

    default:
      return state;
  }
}
