// React
import React, { useState, useEffect } from "react";
// External Libraries
import axios from 'axios';
import { Box, Flex, Button, Input } from "@chakra-ui/react";
// Components

export default function ChatDashboard() {
  const [inputs, setInputs] = useState({
    chat: ""
  });
  const { chat } = inputs;
  const [returnChat, setReturnChat] = useState();
  function communication(e) {
    axios.post("/api/chatbot/message", {
      chat: chat,
    }).then((response) => {
      setReturnChat(response.data.text);
      setReturnChat(response.data.text);
    })
      .catch((error) => {
        alert(error);
      })
  }
  useEffect(() => {
    axios.post("/api/chatbot/getChat")
      .then((response) => {

      })
      .catch((error) => {

      })

  }, [])

  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  useEffect(() => {
    axios.post("/api/chatbot/getChat")
      .then((response) => {

      })
      .catch((error) => {

      })

  }, [])

  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  return (
    <>
      <Flex direction='column'
        w='90vw'
        height='90vh'
        mx='auto'
        my='5vh'>
        <Box width='100%' height='100%'>

          <Box width='100%' height='90%' border='1px solid green'>
            {
              returnChat ?
                returnChat
                :
                null
            }
          </Box>

          <Box width='100%'
            border='1px solid red'
            mt='auto'
            height='10%'
          >
            <Flex height='100%'>
              <Input
                h='100%'
                width='90%'
                id='chat'
                name='chat'
                value={chat}
                autoComplete='false'
                placeholder='무엇을 도와드릴까요?'
                onChange={(e) => onChange(e)}
              >

              </Input>
              <Button width='10%'
                h='100%'
                backgroundColor='green'
                textColor='white'
                borderRadius='0'
                onClick={(e) => communication(e)}
              >
                전송
              </Button>
            </Flex>
          </Box>


        </Box>
      </Flex>
    </>
  );
}