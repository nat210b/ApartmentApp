import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import { Sidebar } from './components/sidebar/Sidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="d-flex flex-row">
        <Sidebar />
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
