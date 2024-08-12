import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {

  const [inputs, setInputs] = useState({
    chat: "",
    word: "",
    mean: ""
  });
  const { chat, word, mean } = inputs;

  // When the user enters data, the value is changed to the entered value.      
  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
///////////////////////////////////////////////////
  useEffect(() => {
    var list = [];
    axios.post("/api/word/getAll")
      .then((response) => {
        for (var i = 0; i < response.data.wordList.length; i++) {
          list.push({

          })
        }
      })
  }, [])
//////////////////////////////////////////////////
  function communication() {
    axios.post("/api/chatbot/message", {
      chat: chat,
    }).then((response) => {
      alert(response.data.text);
    })
      .catch((error) => {
        alert(error)
      })
  }

  function saveWord() {
    if (word && mean) {
      axios.post("/api/word/insert", {
        word: word,
        mean: mean
      }).then((response) => {
        alert(response.data.status);
      })
        .catch((error) => {
          alert(error);
        })
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          <flex direction='column'>
            <flex>
              <text>
                Word :
              </text>
              <input
                id='word'
                name='word'
                value={word}
                onChange={(e) => onChange(e)}
              />
            </flex>
            <flex>
              <text>
                Mean :
              </text>
              <input
                id='mean'
                name='mean'
                value={mean}
                onChange={(e) => onChange(e)}
              />
            </flex>
            <button
              onClick={() => saveWord()}
            >
              go
            </button>
          </flex>
        </div>

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
            onClick={() => communication()}
          >
            go
          </button>
        </flex>
      </header >
    </div >
  );
}

export default App;
