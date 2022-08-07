import 'map.prototype.tojson'; // TODO only import for development
import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import './index.css';
import { initialMessages } from './redux/actions/entities.actions';
import { initialGameState, initialQuizState } from './redux/actions/ui.actions';
import { createAppStore } from './redux/store';

if (process.env.NODE_ENV === 'production') {
  let serviceWorkerRegistered = false;
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          serviceWorkerRegistered = true;
          reg.addEventListener('updatefound', () => {
            console.info('[SW] Update found');
            const newSW = reg.installing;
            newSW?.addEventListener('statechange', e => {
              if (newSW?.state === 'installed') {
                console.info('[SW] Reloading to update');
                window.location.reload();
              }
            });
          });
        })
        .catch(() => {
          // Failed to register service worker, maybe blocked by user agent
          serviceWorkerRegistered = false;
        });
    });

    document.addEventListener('visibilitychange', async () => {
      if (serviceWorkerRegistered && !document.hidden) {
        (await navigator.serviceWorker.getRegistration())?.update();
      }
    });
  }
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

ReactDOM.render(
  <ReduxApp />,
  document.getElementById('content'),
);
