import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import TokenAuth from './ContextAPI/TokenAuth'; // Import the TokenAuth component

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TokenAuth>
        <App />
      </TokenAuth>
    </BrowserRouter>
  </React.StrictMode>
);
