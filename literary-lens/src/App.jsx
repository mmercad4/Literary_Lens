import './App.css';
import { useState, useEffect } from 'react';

import { getTest } from './functions/test';

function App() {
  const [data, setData] = useState('Hello World!');

  useEffect(() => {
    getTest()
      .then((response) => {
        setData(response.message);
      })
      .catch((err) => console.log(err));
  });

  return (
    <div className="App">
      <h1>Literary Lens</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
