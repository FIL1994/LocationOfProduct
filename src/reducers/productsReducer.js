/**
 * productsReducer
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {GET_PRODUCTS, FAIL_PRODUCTS, CREATE_PRODUCT, DELETE_PRODUCT} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_PRODUCTS:
      return action.payload.data;
    case FAIL_PRODUCTS:
      console.error(FAIL_PRODUCTS, action.error);
      return state;
    case CREATE_PRODUCT:
      return state;
    case DELETE_PRODUCT:
      return _.filter(state, l => l._key !== action.payload);
    default:
      return state;
  }
}