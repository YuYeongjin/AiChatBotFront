// React
import React, { useState, useEffect } from "react";
// External Libraries
import axios from 'axios';
import { Button, Card, Input, Text, Flex, Box } from "@chakra-ui/react";

export default function WordDashboard({ }) {
  const [wordList, setWordList] = useState([]);
  const [excelModal, setExcelModal] = useState(false);
  const [changeWord, setChangeWord] = useState(false);
  const [inputs, setInputs] = useState({
    word: "",
    mean: ""
  });
  const { word, mean } = inputs;

  // When the user enters data, the value is changed to the entered value.      
  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  useEffect(() => {
    var list = [];
    axios.post("/api/word/getAll")
      .then((response) => {
        for (var i = 0; i < response.data.wordList.length; i++) {
          list.push({
            "word": response.data.wordList[i].word,
            "mean": response.data.wordList[i].mean
          })
          setWordList(list);
        }
      })
    if (changeWord) {
      setChangeWord(false);
    }
  }, [changeWord])


  function saveWord() {
    if (word && mean) {
      axios.post("/api/word/insert", {
        word: word,
        mean: mean
      }).then((response) => {
        setChangeWord(true);
        setInputs({
          word: "",
          mean: ""
        })
      })
        .catch((error) => {
          alert(error);
        })
    }
  }




  return (

    <>
      <div style={{ display: 'flex' }}>
        <div>
          <Flex my='10px' justify='space-evenly'>
            <Text fontSize='17px'>
              단어장
            </Text>
            <Button width='30%' height='30px' my='auto' backgroundColor='green.300' color='white' onClick={() => setExcelModal(true)}>
              엑셀자료로 넣기
            </Button>
          </Flex>

          <Card border='2px solid' borderColor='green.100' width='90%' mx='auto'>
            <Flex justify='space-evenly' align='center' mb='10px'>
              <label style={{ marginRight: '8px' }}>Word:</label>
              <Input
                mx='10px'
                id='word'
                name='word'
                value={word}
                autoComplete='false'
                onChange={(e) => onChange(e)}
              />
              <label style={{ marginRight: '8px' }}>Mean:

              </label>
              <Input
                mx='10px'
                id='mean'
                name='mean'
                value={mean}
                autoComplete='false'
                onChange={(e) => onChange(e)}
              />
            </Flex>
            <Button width='100%' backgroundColor='green.200' color='white' onClick={() => saveWord()}>
              입력
            </Button>
          </Card>

          <Flex direction='column' maxH='50vh' h='50vh' backgroundColor='green.100' overflowY='auto'>
            {
              wordList && wordList.length > 0 ? (
                wordList.map((word, index) => (
                  <div
                    style={{ color: 'black', display: 'flex', width: "100%", justifyContent: 'space-around' }}
                    key={index}
                  >
                    <p>단어: {word.word}</p>
                    <p>의미: {word.mean}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'black' }}>
                  단어를 추가하세요.
                </p>
              )
            }

          </Flex>
          <Flex align='center' border='1px solid' borderColor='blue.200' justify='space-evenly'
            position='fixed'
            bottom='5%'
            left='1%'
            width='50%'
          >
            <Button backgroundColor='blue.200' color='white'>
              무작위 문제 생성
            </Button>
            <Button backgroundColor='blue.200' color='white'>
              단어 가리기
            </Button>
            <Button backgroundColor='blue.200' color='white'>
              뜻 가리기
            </Button>
          </Flex>
        </div>


        <Flex direction='column' width='50vw' height='100vh' backgroundColor='gray.200'>
          <Box width='100%' borderBottom='1px solid'>
            <Text mt='20px' align='center'>
              단어시험
            </Text>
          </Box>


        </Flex>

      </div>
    </>

  );
}