/* eslint-disable */
import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider, injectGlobal } from "styled-components";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { Meteor } from "meteor/meteor";
import { Bert } from "meteor/themeteorchef:bert";
import App from "../../ui/layouts/App/App";
import mainReducer from "../../modules/redux/index";
if (Meteor.isClient) import "../../ui/stylesheets/app.scss";

Bert.defaults.style = "growl-bottom-right";

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;
const middleWare = [thunk];
const store = createStore(
  mainReducer,
  preloadedState,
  compose(
    applyMiddleware(...middleWare),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
//window.navigator.userAgent.includes('Chrome') &&
//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),

//compose(
//applyMiddleware(...middleWare),
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//)

injectGlobal`
  :root {
    --primary: #337ab7;
    --success: #5cb85c;
    --info: #5bc0de;
    --warning: #f0ad4e;
    --danger: #d9534f;

    --gray-darker: #222;
    --gray-dark: #333;
    --gray: #555;
    --gray-light: #777;
    --gray-lighter: #eee;

    --facebook: #3b5998;
    --google: #ea4335;
    --github: var(--gray-dark);

    --cb-blue: #4285F4;
    --cb-green: #00D490;
    --cb-yellow: #FFCF50;
    --cb-red: #DA5847;
   
  }



  html {
    position: relative;
    min-height: 100%;
  }
  
  body {
    margin-bottom: 80px;
    margin-top:0;
    padding: 0;
    font-size: 14px;
    line-height: 20px;
    background-color:#E6ECF0;
    
  }

  .react-datepicker{
    font-size: 1.0rem;
  }

 
  form label {
    display: block;
  }

  form .control-label {
    display: block;
    margin-bottom: 7px;
  }

  form label.error {
    display: block;
    margin-top: 8px;
    font-size: 13px;
    font-weight: normal;
    color: var(--danger);
  }

  .page-header {
    margin-top: 0;
  }

  @media screen and (min-width: 768px) {
    .page-header {
      margin-top: 20px;
    }
  }
  
`;

const theme = {};

Meteor.startup(() =>
  hydrate(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <App />
          </Switch>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>,
    document.getElementById("react-root")
  )
);
