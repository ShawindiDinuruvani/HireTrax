import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable native cursor globally — our custom canvas cursor takes over
document.documentElement.style.cursor = 'none'

createRoot(document.getElementById('root')).render(
  <App />
)
