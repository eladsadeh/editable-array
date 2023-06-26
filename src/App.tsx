import { useState, useRef, useEffect} from 'react'
import { EditableText } from './components/EditableText'

function App() {
  return (
    <div className="App">
      <h1>Controlled content-editable text</h1>
      <EditableText />
    </div>
  )
}

export default App
