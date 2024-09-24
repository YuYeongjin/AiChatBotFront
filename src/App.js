import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import WordDashboard from './component/word';
import ChatDashboard from './component/chat';
import { Button } from "@chakra-ui/react";


function App() {
  const [mainComponent, setMainComponent] = useState('');


  window.addEventListener('unload', function (e) {
    fetch('http://localhost:8000/api/use/close', { method: 'POST' })
      .then(() => {
        console.log('Application will be closed.');
      })
      .catch(err => console.error(err));
  });


  return (

    mainComponent === 'word' ?
      <WordDashboard />
      :
      mainComponent === 'chat' ?
        <ChatDashboard />
        :
        <>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />

              <flex style={{ width: '50vw' }}>

                <Button style={{ width: '50%' }}
                  backgroundColor='green.400'
                  color='white'
                  onClick={() => setMainComponent('word')}
                >
                  단어장
                </Button>

                <Button style={{ width: '50%' }}
                  backgroundColor='gray.400'
                  color='white'
                // onClick={() => setMainComponent('chat')}
                >
                  챗봇 (개발중)
                </Button>


              </flex>
            </header >
          </div >
        </>
  );
}

export default App;
