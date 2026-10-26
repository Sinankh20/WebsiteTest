import { useState } from 'react'
import './App.css'
import Routines from './components/Routines'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routines/>
    </>
  )
}

export default App
