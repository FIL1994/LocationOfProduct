/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {GET_LOCATION, FAIL_LOCATION, EDIT_LOCATION} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_LOCATION:
      return action.payload.data;
    case FAIL_LOCATION:
      console.error(FAIL_LOCATION, action.error);
      return state;
    default:
      return state;
  }
}