import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {

  const [inputs, setInputs] = useState({
    chat: ""
  });
  const { chat } = inputs;

  // When the user enters data, the value is changed to the entered value.      
  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function communication() {
    axios.post("/api/chatbot/message", {
      chat: chat,
    }).then((response) => {
      alert(response)
    })
      .catch((error) => {
        alert(error)
      })
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          챗봇 대화 시작해볼까?
        </p>
        <flex>

          <input
            id='chat'
            name='chat'
            value={chat}
            onChange={(e) => onChange(e)}
          >

          </input>
          <button
          onClick={()=>communication()}
          >
            go
          </button>
        </flex>
        <div>



        </div>
      </header>
    </div>
  );
}

export default App;
