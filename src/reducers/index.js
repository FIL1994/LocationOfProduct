/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {combineReducers} from 'redux';
import locationsReducer from './locationsReducer';

export default combineReducers({
  locations: locationsReducer
});