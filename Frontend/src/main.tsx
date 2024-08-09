import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import TokenAuthProvider from './ContextAPI/TokenAuth'; // Ensure correct import
import AvarageRes from './ContextAPI/AvarageRes'; // Ensure correct import

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TokenAuthProvider>
        <AvarageRes>
          <App />
        </AvarageRes>
      </TokenAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
