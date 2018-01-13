/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import locationsReducer from './locationsReducer';
import locationReducer from './locationReducer';

export default combineReducers({
  locations: locationsReducer,
  location: locationReducer,
  form: formReducer
});