/**
 * locationReducer.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import {GET_LOCATION, CLEAR_LOCATION} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_LOCATION:
      return action.payload;
    case CLEAR_LOCATION:
      return {};
    default:
      return state;
  }
}