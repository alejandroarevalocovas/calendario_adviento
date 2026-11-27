import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fredoka/400.css'
import '@fontsource/fredoka/500.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/great-vibes/400.css'
import '@fontsource/mountains-of-christmas/700.css'
import './estilos.css'
import './temas.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
