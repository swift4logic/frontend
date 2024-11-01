import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
// import 'dotenv/config';


createRoot(document.getElementById('root')).render(
  <Router>
  <App />
</Router>,
)
