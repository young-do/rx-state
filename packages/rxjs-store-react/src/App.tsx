import { useState } from 'react';
import { useRxValue } from './hooks/useRxState';
import { count$ } from './store/states';
import { dispatch } from 'rxjs-store-core';
import { Increase } from './store/actions';

function App() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
        <button onClick={toggle}>toggle counter</button>
        {show && <Counter />}
      </header>
    </div>
  );
}

function Counter() {
  const count = useRxValue(count$);
  const up = () => dispatch(Increase);

  return (
    <p>
      <button type="button" onClick={up}>
        count is: {count}
      </button>
    </p>
  );
}

export default App;
