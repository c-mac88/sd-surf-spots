// Import React dependencies
import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { configureStore, history } from './store';

import App from './views/App/App';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);
