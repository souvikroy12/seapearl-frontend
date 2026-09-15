import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google' // Naya import
import { HelmetProvider } from 'react-helmet-async' // 👈 1. Naya Meta Tag Provider import kiya
import App from './App.jsx'
import './index.css'

//  Google Client ID
const googleClientId = "1087570042733-qvs1l2hjpjpu4ia2vpic6qgc7cifnqjh.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <HelmetProvider> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider> 
    </GoogleOAuthProvider>
  </React.StrictMode>
)