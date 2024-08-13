// React
import React, { useState, useEffect, useRef } from "react";
// External Libraries
import axios from 'axios';
import { Box, Flex, Image, Button } from "@chakra-ui/react";
// Components

export default function ChatDashboard({ setViewComponent }) {
  const [inputs, setInputs] = useState({
    chat: "",
    word: "",
    mean: ""
  });
  const { chat, word, mean } = inputs;
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

  return (
    <>

    </>
  );
}