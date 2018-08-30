import 'normalize.css';
import OfflinePluginRuntime from 'offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import freeze from 'redux-freeze';
import thunkMiddleware from 'redux-thunk';

import App from './components/App';
import './index.css';
import { IAppAction } from './redux/interfaces/IAppAction';
import { IAppStore } from './redux/interfaces/IAppStore';
import { rootReducer } from './redux/reducers';
import { AppThunkDispatch } from './redux/thunks';
import { extraThunkArgument } from './settings';

import 'map.prototype.tojson'; // TODO only import for development

const reduxMiddlewares: Middleware[] = [
  thunkMiddleware.withExtraArgument(extraThunkArgument), // lets us use dispatch() functions
];

if (process.env.NODE_ENV !== 'production') {
  // Freeze redux state in development to prevent accidental modifications
  // Disable in production to improve performance
  reduxMiddlewares.push(freeze);
}

const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore<IAppStore, IAppAction, { dispatch: AppThunkDispatch }, {}>(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      ...reduxMiddlewares,
    ),
  ),
);

const HotloadableApp = process.env.NODE_ENV !== 'production' ? hot(module)(App) : App;

ReactDOM.render(
  <HotloadableApp store={store} />,
  document.getElementById('content'),
);

if (process.env.NODE_ENV === 'production') {
  OfflinePluginRuntime.install({
    onUpdating: () => {
      // do something
    },
    // tslint:disable-next-line:object-literal-sort-keys
    onUpdateReady: () => {
      // Tells to new SW to take control immediately
      OfflinePluginRuntime.applyUpdate();
    },
    onUpdated: () => {
      // Reload the webpage to load into the new version
      // TODO: show an update notification with button, or reload on user navigation
      window.location.reload();
    },
    onUpdateFailed: () => {
      // do something
    },
  });
}
