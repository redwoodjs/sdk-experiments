import { Button } from "dummy-tree-shake-test";
import "./App.css";

function App() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div className="App">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
