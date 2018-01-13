/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import axios from 'axios';
import {GET_LOCATIONS, GET_LOCATIONS_FAIL} from './types';

//API Info
const ROOT_URL = "http://45.77.106.244:7131";

export function getLocations() {
  const requestURL = `${ROOT_URL}/data`;
  return dispatch =>
    axios.get(requestURL)
      .then(response =>
        dispatch({
          type: GET_LOCATIONS,
          payload: response
        })
      ).catch(
        error => dispatch({
          type: GET_LOCATIONS_FAIL,
          error
        })
    );
}