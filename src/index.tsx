import 'map.prototype.tojson'; // TODO only import for development
import 'normalize.css';
import OfflinePluginRuntime from 'offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import freeze from 'redux-freeze';
import thunkMiddleware from 'redux-thunk';

import App from './components/App';
import './index.css';
import { initialGameState, initialQuizState } from './redux/actions/ui.actions';
import { AppAction } from './redux/interfaces/AppAction';
import { IAppStore } from './redux/interfaces/IAppStore';
import { rootReducer } from './redux/reducers';
import { extraThunkArgument } from './redux/store';
import { AppThunkDispatch } from './redux/thunks';

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
const store = createStore<IAppStore, AppAction, { dispatch: AppThunkDispatch }, {}>(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      ...reduxMiddlewares,
    ),
  ),
);

const gameStateString = localStorage.getItem('gameState');
if (gameStateString !== null) {
  const gameStates = JSON.parse(gameStateString);
  store.dispatch(initialGameState(gameStates));
}

const quizStateString = localStorage.getItem('quizState');
if (quizStateString !== null) {
  const quizStates = JSON.parse(quizStateString);
  store.dispatch(initialQuizState(quizStates));
}

store.subscribe((() => {
  let previousState = store.getState().ui.gameState;
  return () => {
    const newState = store.getState().ui.gameState;
    if (previousState !== newState) {
      localStorage.setItem('gameState', JSON.stringify(Array.from(newState.entries())));
      previousState = newState;
    }
  };
})());

store.subscribe((() => {
  let previousState = store.getState().ui.quizState;
  return () => {
    const newState = store.getState().ui.quizState;
    if (previousState !== newState) {
      localStorage.setItem('quizState', JSON.stringify(Array.from(newState.entries())));
      previousState = newState;
    }
  };
})());

const ReduxApp = () => <Provider store={store}>
  <App />
</Provider>;

const HotloadableApp = process.env.NODE_ENV !== 'production' ? hot(module)(ReduxApp) : ReduxApp;

ReactDOM.render(
  <HotloadableApp />,
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
