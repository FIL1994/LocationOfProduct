/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import axios from 'axios';
import {GET_LOCATIONS, GET_LOCATIONS_FAIL, CREATE_LOCATION, EDIT_LOCATION, GET_LOCATION, GET_LOCATION_FAIL}
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
          type: GET_LOCATIONS_FAIL,
          error
        })
    );
}

export function createLocation(values, callback) {
  console.log(values);

  /*
  axios.post(ROOT_URL, values)
    .then(response => callback(response));
  */

  return {
    type: CREATE_LOCATION
  };
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
        type: GET_LOCATION_FAIL,
        error
      })
    );
}
// endregion