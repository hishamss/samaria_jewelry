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
const myStore = createStore(
  allReducers,
  applyMiddleware(thunk),
  
)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={myStore}>
      <BrowserRouter>

        <App />

      </BrowserRouter>
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

