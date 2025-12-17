import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const inferCodespaceName = () => {
  const host = window.location.hostname;
  const explicit = process.env.REACT_APP_CODESPACE_NAME?.trim();
  if (explicit) {
    console.log('[Frontend] Using REACT_APP_CODESPACE_NAME from env:', explicit);
    return explicit;
  }
  // If running inside Codespaces frontend (port 3000), derive backend prefix
  const match = host.match(/^(.*)-\d+\.app\.github\.dev$/);
  if (match && match[1]) {
    const inferred = match[1];
    console.log('[Frontend] Inferred codespace name from host:', inferred);
    return inferred;
  }
  console.log('[Frontend] No codespace name found, using localhost fallback. Host:', host);
  return null;
};

const codespaceName = inferCodespaceName();
const apiBase = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
console.log('[Frontend] API base URL:', apiBase);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
