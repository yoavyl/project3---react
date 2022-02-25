import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './Components/LayoutArea/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import interceptorService from './Services/InterceptorService';
import socketIoService from './Services/SocketIoService';
import './Assets/Fonts/FlyingPeace/FlyingPeacePersonalUseRegular-vmeK4.ttf';

interceptorService.createInterceptor();

// we can also do it the login component
socketIoService.connect();

ReactDOM.render(    
    <React.StrictMode>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
