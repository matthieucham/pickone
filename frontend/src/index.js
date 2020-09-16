import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, compose, createStore } from "redux";
import { Provider, useSelector } from "react-redux";
import thunk from "redux-thunk";
import { createFirestoreInstance, reduxFirestore, getFirestore, actionTypes } from "redux-firestore";
import { ReactReduxFirebaseProvider, getFirebase, isLoaded } from "react-redux-firebase";

import fbConfig, { backendAPIEndpoint, getMessagingToken } from "./config/fbConfig";
import firebase from "firebase/app";
import { APIService } from "./service";
import LoadingLayer from "./components/lib/LoadingLayer"

import rootReducer from "./store/reducers/rootReducer";
import { sendToken } from "./store/actions/messagingActions";

const getAPIService = () => {
  return new APIService(backendAPIEndpoint);
};

const store = createStore(rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore, getAPIService })),
    reduxFirestore(firebase, fbConfig)
  )
);

const rrfConfig = {
  onAuthStateChanged: (authData, firebase, dispatch) => {
    // Clear redux-firestore state if auth does not exist (i.e logout)
    if (!authData) {
      dispatch({ type: actionTypes.CLEAR_DATA })
      dispatch({ type: "DISABLE_PUSH_MESSAGING" });
    } else {
      // "new" user : setup push messaging
      getMessagingToken().then(
        (token) => dispatch(sendToken(token))
      );
    }
  }
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth)
  if (!isLoaded(auth)) return <LoadingLayer />;
  return children
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <BrowserRouter>
          <AuthIsLoaded>
            <App />
          </AuthIsLoaded>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
