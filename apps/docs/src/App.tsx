import React from 'react';
import { Button } from '@chakra-ui/react';

import './App.css';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Campus</h1>
        <img src={logo} className="App-logo" alt="logo" />

        <Button rounded="20px" bg="red">
          Hola mundo!
        </Button>
      </header>
    </div>
  );
}

export default App;
