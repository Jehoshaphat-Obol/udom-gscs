import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './assets/vendor/bootstrap/js/bootstrap.bundle.js';
import './assets/vendor/apexcharts/apexcharts.min.js';
import './assets/vendor/chart.js/chart.umd.js';
import './assets/vendor/echarts/echarts.min.js';
import './assets/vendor/quill/quill.min.js';
import './assets/vendor/simple-datatables/simple-datatables.js';
import './assets/vendor/tinymce/tinymce.min.js';
import axios from 'axios'
import { AuthContextProvider } from './context/AuthContext.jsx';

axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';
// axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </>
  // </React.StrictMode>
)
