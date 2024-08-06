import React from 'react'
import ReactDOM from 'react-dom/client'
import CameraCapture from './CameraCapture.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div>Image Captioning</div>
    <CameraCapture />
  </React.StrictMode>,
)
