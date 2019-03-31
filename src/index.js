import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/index';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}
