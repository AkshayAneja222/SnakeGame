import './App.css';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Snake Game
      </header>
      <section className='App-body'>
        <SnakeGame />
      </section>
    </div>
  );
}

export default App;
