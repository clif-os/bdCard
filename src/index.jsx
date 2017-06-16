import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import bmShowcaseApp from './reducers/index.jsx';
import './index.styl';
import './components/mapShowcaser/loader/LoadingPane.styl';
import AppInterface from './AppInterface.jsx';

// shims and polyfills for cross-browser
window.fetch = window.fetch || require('fetch-ie8');
window.Promise = window.Promise || require('promise-polyfill');
require('es6-shim');
require('custom-event-polyfill');

const store = createStore(
  bmShowcaseApp,
  applyMiddleware(logger),
);

const root = document.getElementById('appInterface-container');
render(
  <Provider store={store}>
    <AppInterface />
  </Provider>, root,
);
