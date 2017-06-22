import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import bdCard from './reducers/index.jsx';
import './index.styl';
import AppInterface from './AppInterface.jsx';

window.fetch = window.fetch || require('fetch-ie8');
window.Promise = window.Promise || require('promise-polyfill');
require('es6-shim');
require('custom-event-polyfill');


const store = createStore(
  bdCard,
  applyMiddleware(logger),
);

const root = document.getElementById('appInterface-container');
render(
  <Provider store={store}>
    <AppInterface />
  </Provider>, root,
);
