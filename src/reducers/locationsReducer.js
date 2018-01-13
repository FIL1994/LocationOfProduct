/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {GET_LOCATIONS, GET_LOCATIONS_FAIL, CREATE_LOCATION} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_LOCATIONS:
      return action.payload.data;
    case GET_LOCATIONS_FAIL:
      console.error(GET_LOCATIONS_FAIL, action.error);
      return state;
    case CREATE_LOCATION:
      return state;
    default:
      return state;
  }
}