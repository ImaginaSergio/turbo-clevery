import React from "react";
import { Link } from "ui";
import { Button } from '@chakra-ui/react'

import "./App.css";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Campus</h1>
        <img src={logo} className="App-logo" alt="logo" />
        
   


          <Button rounded="20px" bg="red">Hola mundo!</Button>

        <Link className="App-link" href="https://reactjs.org">
          Learn React
        </Link>
      </header>
    </div>
  );
}

export default App;
