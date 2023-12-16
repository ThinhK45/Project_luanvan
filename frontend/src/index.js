import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './pages/Routes';
import { Provider } from 'react-redux';
import store from './store';
import './style.css';
import './responsive.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.render(
    <Provider store={store}>
        {/* <React.StrictMode> */}
            <Routes />
            <ToastContainer />
        {/* </React.StrictMode> */}
    </Provider>,
    document.getElementById('root'),
);

