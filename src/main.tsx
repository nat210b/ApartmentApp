import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import { Sidebar } from './components/sidebar/Sidebar'
import Navbar from './components/navbar/Navbar'

function RootLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="d-flex flex-row min-vh-100 w-100">
      {!isLoginPage && <Sidebar />}
      <div className="d-flex flex-column flex-grow-1 w-100">
        {!isLoginPage && <Navbar />}
        <App />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout />
    </BrowserRouter>
  </StrictMode>,
)
