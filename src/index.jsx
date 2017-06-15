import './index.styl';
import './components/loader/LoadingPane.styl';
import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import formApp from './reducers/index.jsx';

import AppInterface from './AppInterface.jsx';

// shims and polyfills for cross-browser
window.fetch = window.fetch || require('fetch-ie8');
window.Promise = window.Promise || require('promise-polyfill');
require('es6-shim');
require('custom-event-polyfill');

const store = createStore(
  formApp,
  applyMiddleware(logger),
);

const root = document.getElementById('appInterface-container');
render(
  <Provider store={store}>
    <AppInterface />
  </Provider>, root
);
