/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {GET_LOCATIONS, FAIL_LOCATIONS, CREATE_LOCATION} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_LOCATIONS:
      return action.payload.data;
    case FAIL_LOCATIONS:
      console.error(FAIL_LOCATIONS, action.error);
      return state;
    case CREATE_LOCATION:
      return state;
    default:
      return state;
  }
}