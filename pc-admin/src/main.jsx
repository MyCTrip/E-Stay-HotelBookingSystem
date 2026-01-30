// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. 👇 必须引入这个路由核心包
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. 👇 必须用 BrowserRouter 包裹住 App，路由才能生效 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)