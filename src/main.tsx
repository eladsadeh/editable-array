import React from 'react'
import ReactDOM from 'react-dom/client'
import EditableArray from './EditableArray.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EditableArray />
  </React.StrictMode>,
)
