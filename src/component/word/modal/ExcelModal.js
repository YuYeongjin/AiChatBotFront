// React
import React, { useState } from 'react';
// External Libraries
import axios from 'axios';
import { Flex, ModalOverlay, Box, Text, useColorModeValue, Modal, Button, ModalContent, Card } from "@chakra-ui/react";
// Components
// Assets
/**
 * 
 * Props list
 *  - titleText           : 모달버튼 상단 텍스트
 */
export default function ExcelModal({ onClose, setChangeWord }) {

  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const [wordList, setWordList] = useState('');
  const [parsedWords, setParsedWords] = useState([]);

  const handleInputChange = (e) => {
    setWordList(e.target.value);
    parseWords(e.target.value);
  };

  const parseWords = (input) => {
    const rows = input.split('\n');  // 줄 단위로 분리
    const formattedData = [];

    rows.forEach(row => {
      const [word, ...meanParts] = row.split('\t'); // ...meanParts로 나머지 부분을 배열로 받기
      const mean = meanParts.join('\t').trim(); // 여러 탭 구분을 처리

      if (word && mean) {  // 빈 값이 아닌 경우에만 처리
        formattedData.push({ word: word.trim(), mean: mean.trim() });
      }
    });

    setParsedWords(formattedData);
  };

  function saveWords(e) {
    e.preventDefault();
    axios.post("/api/word/insertList", {
      parsedWords: parsedWords
    }).then((response) => {
      alert("저장됐습니다.");
      setChangeWord(true);
      setParsedWords([]);
      onClose();
    })
      .catch((error) => {
        alert(error);
      })

  }



  return (
    <div className='modal'>
      <Modal isOpen={true} onClose={onClose} isCloseOnOverlayClick={true}>
        <ModalOverlay />
        <ModalContent
          my='auto'
          className='sirenOrderModal'
          border='1px solid'
          borderColor='white'
          backgroundColor='rgba(229, 244, 255, 1)'
          textColor='black'
        >
          <Flex
            className='modalMainCloseText'
            my='5%'
            align='center'
            direction='column'
          >
            <Text
            >
              [ 엑셀로 단어장에 단어 넣기 ]
            </Text>
          </Flex>

          <Flex
            className='modalMainInsideDefaultText'
            justifyContent='space-between'
          >
            <Box width='100%' height='100%'
            >
              <div>
                <textarea
                  style={{
                    backgroundColor: 'gray.200',
                    border: '1px solid gray',
                    width: '100%'
                  }}
                  value={wordList}
                  onChange={handleInputChange}
                  placeholder="엑셀에서 단어와 뜻을 드래그한 후 여기에 붙여넣기하세요."
                  rows={10}
                  cols={50}
                />
                <Flex
                  mt='auto'
                  justify='space-around'
                >
                  {
                    parsedWords.length > 0 ?
                      <Button
                        className='modalMainSmallBtn'
                        _focus={{ backgroundColor: 'rgba(22, 204, 234, 1)' }}
                        _active={{ backgroundColor: 'rgba(22, 204, 234, 1)' }}
                        _hover={{ backgroundColor: 'rgba(22, 204, 234, 1)' }}
                        shadow={shadow}
                        backgroundColor='rgba(22, 204, 234, 1)'
                        border='1px solid rgba(217, 217, 217, 1)'
                        textColor='white'
                        align='center'
                        onClick={(e) => { saveWords(e) }}
                      >
                        < Text
                          className='modalMainSmallBtnText'
                          mx='auto'
                        >
                          저장하기
                        </Text>
                      </Button>
                      :
                      <Button
                        className='modalMainSmallBtn'
                        _focus={{ backgroundColor: 'rgba(22, 204, 234, 1)' }}
                        _active={{ backgroundColor: 'rgba(22, 204, 234, 1)' }}
                        _hover={{ backgroundColor: 'rgba(22, 204, 234, 1)' }}
                        shadow={shadow}
                        backgroundColor='rgba(22, 204, 234, 1)'
                        border='1px solid rgba(217, 217, 217, 1)'
                        textColor='white'
                        align='center'
                        onClick={() => { onClose() }}
                      >
                        < Text
                          className='modalMainSmallBtnText'
                          mx='auto'
                        >
                          닫기
                        </Text>
                      </Button>
                  }

                </Flex>
                <Card>
                  {
                    parsedWords.length > 0 ?
                      <>
                        <Text align='center'>
                          분류된 단어 목록
                        </Text>
                        <hr />
                      </>
                      :
                      null
                  }
                  {parsedWords.length > 0 ? (
                    parsedWords.map((entry, index) => (
                      <Flex key={index} justify='space-between'>
                        <Text>단어:</Text> {entry.word} <Text>뜻:</Text> {entry.mean}
                      </Flex>
                    ))
                  ) :
                    null
                  }
                </Card>
              </div>
            </Box>

          </Flex>



        </ModalContent>
      </Modal>
    </div>
  );
}