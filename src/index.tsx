import 'map.prototype.tojson'; // TODO only import for development
import 'normalize.css';
import OfflinePluginRuntime from 'offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';

import App from './components/App';
import './index.css';
import { initialMessages } from './redux/actions/entities.actions';
import { initialGameState, initialQuizState } from './redux/actions/ui.actions';
import { createAppStore } from './redux/store';

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

  document.addEventListener('visibilitychange', e => {
    if (!document.hidden) {
      OfflinePluginRuntime.update();
    }
  });
}

const store = createAppStore();

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

const messagesString = localStorage.getItem('gameMessages');
if (messagesString !== null) {
  const messages = JSON.parse(messagesString);
  store.dispatch(initialMessages(messages));
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
  let previousState = store.getState().entities.messages;
  return () => {
    const newState = store.getState().entities.messages;
    if (previousState !== newState) {
      localStorage.setItem('gameMessages', JSON.stringify(newState));
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
