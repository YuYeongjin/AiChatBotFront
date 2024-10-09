// React
import React from 'react';
// External Libraries
import { Flex, ModalOverlay, Box, Text, useColorModeValue, Modal, ModalContent } from "@chakra-ui/react";
// Components
// Assets
/**
 * 
 * Props list
 *  - titleText           : 모달버튼 상단 텍스트
 */
export default function PreviewModal({ onClose, problemList, ownList, name }) {

  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );



  return (
    <div className='modal'>
      <Modal isOpen={true} onClose={onClose} isCloseOnOverlayClick={true}>
        <ModalOverlay />
        <ModalContent
          my='auto'
          mx='auto'
          border='1px solid'
          borderColor='white'
          textColor='black'
        >

          <Flex
            direction='column'
            width="793.7px"
            height="1122.52px"
            border='1px solid gray'
            textColor='black !important'
            backgroundColor='rgba(229, 244, 255, 1)'
            style={{ color: 'black !important' }}
            overflowY='auto'>
            <Box width='100%' borderBottom='1px solid'>
              <Text my='10px' align='center'>
                영어 단어시험
              </Text>
            </Box>
            <Flex
              direction='column'
            >
              <Flex justify='space-between'>
                <Flex align='center' width='200px' height='40px' borderLeft='1px solid black' borderRight='1px solid black' borderBottom='1px solid black'>
                  <Box borderRight='1px solid black' width='50%' height='100%' >
                    <Text height='100%' align='center'>
                      이름
                    </Text>
                  </Box>
                  <Text>

                  </Text>
                </Flex>

                <Flex align='center' width='200px' height='40px' borderLeft='1px solid black' borderRight='1px solid black' borderBottom='1px solid black'>
                  <Box borderRight='1px solid black' width='50%' height='100%'>
                    <Text height='100%' align='center' >
                      점수
                    </Text>
                  </Box>
                  <Text>

                  </Text>
                </Flex>
              </Flex>

              <Text mx='auto' my='20px'>
                {name}
              </Text>
              {
                problemList && problemList.length > 30 ?
                  <Flex wrap="wrap" justify="space-around">
                    {problemList.map((problem, index) => (
                      <Box
                        key={index}
                        width="45%"
                        mb="2px"
                      >
                        <Flex justify="space-between" textColor='black'>
                          <Text width='20%' align='left'>
                            {index + 1}
                          </Text>
                          <Text borderBottom={problem.word ? 'none' : '1px solid black'} width='40%' align='left'>
                            {problem.word ?
                              problem.word
                              :
                              "　　　　　"
                            }
                          </Text>
                          <Text borderBottom={problem.mean ? 'none' : '1px solid black'} width='40%' align='right'>
                            {problem.mean ?
                              problem.mean
                              :
                              "　　　　　"
                            }
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                  :
                  problemList && problemList.length > 0 ?
                    problemList.map((problem, index) => (
                      <Box
                        key={index}
                        mb="2px"
                      >
                        <Flex justify='space-around' textColor='black'>
                          <Text width='20%' align='left' ml='10px'>
                            {index + 1}
                          </Text>
                          <Text borderBottom={problem.word ? 'none' : '1px solid black'} width='40%' align='left'>
                            {problem.word ?
                              problem.word
                              :
                              "　　　　　"
                            }
                          </Text>
                          <Text borderBottom={problem.mean ? 'none' : '1px solid black'} width='40%' align='right'>
                            {problem.mean ?
                              problem.mean
                              :
                              "　　　　　"
                            }
                          </Text>
                        </Flex>

                      </Box>
                    ))
                    :
                    ownList && ownList.length > 30 ?
                      <Flex wrap="wrap" justify="space-around">
                        {ownList.map((originWord, index) => (
                          <Box
                            key={index}
                            width="45%"
                            mb="2px"
                          >
                            <Flex justify='space-between' textColor='black'>
                              <Text width='20%' align='left'>
                                {index + 1}
                              </Text>
                              <Text width='40%' align='left'>
                                {originWord.word}
                              </Text>
                              <Text width='40%' align='right'>
                                {originWord.mean}
                              </Text>
                            </Flex>
                          </Box>
                        ))}
                      </Flex>
                      :
                      ownList && ownList.length > 0 ?
                        ownList.map((originWord, index) => (
                          <Box
                            key={index}
                            mb="2px"
                          >
                            <Flex justify='space-around' textColor='black'>
                              <Text width='20%' align='left' ml='10px'>
                                {index + 1}
                              </Text>
                              <Text width='40%' align='left'>
                                {originWord.word}
                              </Text>
                              <Text width='40%' align='right'>
                                {originWord.mean}
                              </Text>
                            </Flex>

                          </Box>
                        ))
                        :
                        <Text>
                          단어를 넣고 문제를 생성하세요.
                        </Text>
              }
            </Flex>
          </Flex>



        </ModalContent>
      </Modal>
    </div>
  );
}