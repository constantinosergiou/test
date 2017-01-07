import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
//import reduxImmutableStateInvariant 'redux-immutable-state-invariant';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState
  );
}
