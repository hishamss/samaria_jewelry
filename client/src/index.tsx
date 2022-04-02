import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux"
import thunk from "redux-thunk";
import allReducers from "./redux/reducers";
import { Auth0Provider } from '@auth0/auth0-react';
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const myStore = createStore(
  allReducers,
  applyMiddleware(thunk),

)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={myStore}>
      <BrowserRouter>
        <Auth0Provider 
        domain={auth0Domain!}
        clientId={auth0ClientId!}
        redirectUri={window.location.origin}
        >
          <App />
          </Auth0Provider>


      </BrowserRouter>
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

