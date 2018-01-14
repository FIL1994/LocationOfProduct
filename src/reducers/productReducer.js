/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {GET_PRODUCT, FAIL_PRODUCT, EDIT_PRODUCT} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_PRODUCT:
      return action.payload.data;
    case FAIL_PRODUCT:
      console.error(FAIL_PRODUCT, action.error);
      return state;
    default:
      return state;
  }
}