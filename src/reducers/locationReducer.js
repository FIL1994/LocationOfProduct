/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {GET_LOCATION, GET_LOCATION_FAIL, EDIT_LOCATION} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_LOCATION:
      return action.payload.data;
    case GET_LOCATION_FAIL:
      console.error(GET_LOCATION_FAIL, action.error);
      return state;
    default:
      return state;
  }
}