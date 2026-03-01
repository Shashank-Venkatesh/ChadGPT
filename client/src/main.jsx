import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {AppContextProvider} from './context/AppContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <App/>
      <Toaster
        toastOptions={{
          style: {
            background: 'var(--bg-surface-hover)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-main)',
            backdropFilter: 'blur(20px)',
          },
        }}
      />
    </AppContextProvider>
  </BrowserRouter>
)
