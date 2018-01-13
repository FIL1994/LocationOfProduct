/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import locationsReducer from './locationsReducer';

export default combineReducers({
  locations: locationsReducer,
  form: formReducer
});