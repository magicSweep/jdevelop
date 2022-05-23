import React from "react";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
//import Providers from "./../../provider/container/Providers";
//import { initApp } from "./firebase/initApp";
import { modalReducer, alertReducer, tagsReducer } from "./../../src/store";
import { photoReducer, searchReducer } from "./../../src/photos";
import { authReducer } from "./../../src/auth";

//CONFIG REDUX
const reducer = combineReducers({
  modal: modalReducer,
  alert: alertReducer,
  auth: authReducer,
  tags: tagsReducer,
  search: searchReducer,
  photos: photoReducer,
});

const composeEnhancers = compose;

/**
 * Logs all actions and states after they are dispatched.
 */
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info("DISPATCHING");
  console.info("ACTION", action);
  console.info("PREV STORE", store.getState());
  let result = next(action);
  console.log("NEW STORE", store.getState());
  console.groupEnd();
  return result;
};

const middleware = [thunk, logger]; //sagaMiddleware, thunk

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
);

export default (storyFn) => {
  return <ReduxProvider store={store}>{storyFn()}</ReduxProvider>;
};
