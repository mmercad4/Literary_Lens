import './App.css';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button'

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
      <Button variant='contained'> Material UI connected</Button>
    </div>
  );
}

export default App;
