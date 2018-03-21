import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import estApp from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { GetAllResultNames } from './FirebaseActions';

let store = createStore(estApp);

GetAllResultNames((names) => {
	localStorage.setItem('names', JSON.stringify(names));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root'));
registerServiceWorker();
