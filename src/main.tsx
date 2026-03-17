import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

registerSW({
  immediate: true,
  onNeedRefresh() {
    // When an update is found and installed, instantly perform a clean reload
    // to prevent the old React DOM from rendering alongside the new CSS/JS chunks 
    // which causes layout distortions.
    window.location.reload();
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
