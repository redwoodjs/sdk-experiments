import { Button } from 'dummy-tree-shake-test'
import './App.css'

function App() {
  const handleClick = () => {
    alert('Button clicked!')
  }

  return (
    <div className="App">
      <h1>Tree Shaking Test - Vanilla Vite</h1>
      <p>
        This project imports only the Button component from dummy-tree-shake-test.
        Other components (Card, Input, Modal, Badge) should be tree-shaken out.
      </p>
      
      <div className="button-showcase">
        <Button onClick={handleClick} variant="primary">
          Primary Button
        </Button>
        
        <Button onClick={handleClick} variant="secondary">
          Secondary Button
        </Button>
        
        <Button onClick={handleClick} variant="danger">
          Danger Button
        </Button>
        
        <Button onClick={handleClick} variant="primary" disabled>
          Disabled Button
        </Button>
      </div>
    </div>
  )
}

export default App
