import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
//import reduxImmutableStateInvariant 'redux-immutable-state-invariant';, reduxImmutableStateInvariant()
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  );
}
