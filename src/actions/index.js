/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import axios from 'axios';
import {GET_LOCATIONS, FAIL_LOCATIONS, CREATE_LOCATION, EDIT_LOCATION, GET_LOCATION, FAIL_LOCATION}
  from './types';

//API Info
const ROOT_URL = "http://45.77.106.244:7131/data";

// region Locations
export function getLocations() {
  return dispatch =>
    axios.get(ROOT_URL)
      .then(response =>
        dispatch({
          type: GET_LOCATIONS,
          payload: response
        })
      ).catch(
        error => dispatch({
          type: FAIL_LOCATIONS,
          error
        })
    );
}

export function createLocation(values, callback) {
  return dispatch =>
    axios.post(ROOT_URL, values)
      .then(response => callback(response) &&
        dispatch({
          type: CREATE_LOCATION,
          payload: response
        })
      ).catch(
        error => callback(error) && dispatch({
          type: FAIL_LOCATION,
          error
        })
    );
}
// endregion

// region Location
export function getLocation(id) {
  return dispatch =>
    axios.get(`${ROOT_URL}/${id}`)
      .then(response =>
        dispatch({
          type: GET_LOCATION,
          payload: response
        })
      ).catch(
      error => dispatch({
        type: FAIL_LOCATION,
        error
      })
    );
}

export function editLocation(id, values, callback) {
  return dispatch =>
    axios.put(`${ROOT_URL}/${id}`, values)
      .then(response => callback(response) &&
        dispatch({
          type: GET_LOCATION,
          payload: response
        })
      ).catch(
      error => callback(error) && dispatch({
        type: FAIL_LOCATION,
        error
      })
    );
}
// endregion