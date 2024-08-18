import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DrumMachine  from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DrumMachine  />
  </StrictMode>
)
