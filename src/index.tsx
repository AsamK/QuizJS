import 'normalize.css';
import OfflinePluginRuntime from 'offline-plugin/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

import App from './components/App';
import './index.css';

const HotloadableApp = process.env.NODE_ENV !== 'production' ? hot(module)(App) : App;

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
