import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import WordDashboard from './component/word';
import ChatDashboard from './component/chat';


function App() {
  const [mainComponent, setMainComponent] = useState('');

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

                <button style={{ width: '50%' }}
                  onClick={() => setMainComponent('word')}
                >
                  단어장
                </button>

                <button style={{ width: '50%' }}
                  onClick={() => setMainComponent('chat')}

                >
                  챗봇
                </button>


              </flex>
            </header >
          </div >
        </>
  );
}

export default App;
