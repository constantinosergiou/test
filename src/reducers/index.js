import {combineReducers} from 'redux';
import courses from './courseReducers';
import authors from './authorReducers';

const rootReducer = combineReducers({
  courses,
  authors,
  ajaxCallsInProgress
});

export default rootReducer;
