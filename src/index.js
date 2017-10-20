import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Counter, {appState} from './App';
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(
  <Counter store={appState} />,
  document.getElementById("app")
)
registerServiceWorker();
