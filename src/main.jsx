import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

// Tampilkan domain saja di address bar: buang #..., ?..., dan /index.html.
if (/^https?:$/.test(location.protocol)) {
  const clean = location.pathname.replace(/index\.html$/, '')
  if (location.hash || location.search || clean !== location.pathname) history.replaceState(null, '', clean)
  window.addEventListener('hashchange', () => history.replaceState(null, '', location.pathname))
}

createRoot(document.getElementById('root')).render(<App />)
