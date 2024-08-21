// React
import React, { useState, useEffect, useRef } from "react";
// External Libraries
import axios from 'axios';
import { Button, Card, Input, Text, Flex, Box, IconButton } from "@chakra-ui/react";
import ExcelModal from "./modal/ExcelModal";
import { BsFillPencilFill, BsFillXOctagonFill } from "react-icons/bs";
import html2canvas from 'html2canvas';

export default function WordDashboard() {
  //  modal
  const [excelModal, setExcelModal] = useState(false);
  const [problemModal, setProblemModal] = useState(false);

  // status 
  const [changeWord, setChangeWord] = useState(false);
  const [createFinish, setCreateFinish] = useState(false);

  // valuable
  const [wordList, setWordList] = useState([]);
  const [wordInfo, setWordInfo] = useState();
  const [problemList, setProblemList] = useState([]);
  const [ownList, setOwnList] = useState([]);

  const [inputs, setInputs] = useState({
    word: "",
    mean: "",
    updateWord: "",
    updateMean: "",
    amount: "",
    name: ""
  });
  const { word, mean, updateWord, updateMean, amount, name } = inputs;

  // When the user enters data, the value is changed to the entered value.      
  function onChange(e) {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    if (name === 'amount') {
      setCreateFinish(false);
    }
  }
  useEffect(() => {
    var list = [];
    axios.post("/api/word/getAll")
      .then((response) => {
        for (var i = 0; i < response.data.wordList.length; i++) {
          list.push({
            "id": response.data.wordList[i].id,
            "word": response.data.wordList[i].word,
            "mean": response.data.wordList[i].mean
          })
          setWordList(list);
        }
      })
      .catch((error) => {
        setWordList(list);
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

  function deleteWord(word) {
    axios.post("/api/word/delete", {
      id: word.id
    }).then((response) => {
      setChangeWord(true);
    })
      .catch((error) => {
        alert(error);
      })
  }
  function cancelUpdate() {
    setWordInfo();
  }

  function createProblem() {
    var list = [];
    axios.post("/api/word/createProblem", {
      amount: amount
    }).then((response) => {
      for (var i = 0; i < response.data.wordList.length; i++) {
        list.push({
          "id": response.data.wordList[i].id,
          "word": response.data.wordList[i].word,
          "mean": response.data.wordList[i].mean
        })
      }
      setOwnList(list);
      setCreateFinish(true);
    })
      .catch((error) => {
        alert(error);
      })
  }

  function updateWordMethod(word) {
    axios.post("/api/word/updateWord", {
      id: word.id,
      word: updateWord,
      mean: updateMean
    }).then((response) => {
      setChangeWord(true);
      setWordInfo();
    })
      .catch((error) => {
        alert(error);
      })
  }

  function hideMean() {
    var list = [];
    ownList.forEach(element => {
      list.push({
        'id': element.id,
        'mean': '',
        'word': element.word
      })
    });

    setProblemList(list);
  }

  function hideWord() {
    var list = [];
    ownList.forEach(element => {
      list.push({
        'id': element.id,
        'mean': element.mean,
        'word': ''
      })
    });

    setProblemList(list);
  }

  function retry() {
    setCreateFinish(false);
  }

  const captureRef = useRef();
  function captureProblem() {
    html2canvas(captureRef.current).then(canvas => {

      axios.post('/api/word/saveList', {
        ownList: ownList,
        name: name
      })
        .then((response) => {
          if (response.data.status === '1') {
            alert("저장 완료!");
          }

          if (response.data.status === '0') {
            alert(response.data.error);
          }
        })
        .catch((error) => {
          alert(error);
        })
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name + '.png'; // 저장할 파일 이름
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // 메모리 해제
      });
    });
  }

  return (

    <>
      {excelModal && <ExcelModal setChangeWord={setChangeWord} onClose={() => setExcelModal(false)} />}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50vw' }}>
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
                  <Flex
                    style={{ color: 'black', display: 'flex', width: "100%", justifyContent: 'space-around' }}
                    key={index}
                    align='center'
                  >
                    {
                      wordInfo && wordInfo.id === word.id ?
                        <>
                          <Input
                            mx='10px'
                            id='updateWord'
                            name='updateWord'
                            value={updateWord}
                            autoComplete='false'
                            onChange={(e) => onChange(e)}
                            placeholder={word.word}
                          />
                          <Input
                            mx='10px'
                            id='updateMean'
                            name='updateMean'
                            value={updateMean}
                            autoComplete='false'
                            onChange={(e) => onChange(e)}
                            placeholder={word.mean}
                          />
                          <Button onClick={() => updateWordMethod(word)}>
                            저장
                          </Button>
                          <Button
                            onClick={() => cancelUpdate()}
                          >
                            취소
                          </Button>
                        </>
                        :
                        <>
                          <Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {word.word}
                          </Text>
                          <Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {word.mean}
                          </Text>
                          <IconButton as={BsFillPencilFill} color='green'
                            size='100%'
                            onClick={() => {
                              setWordInfo(word);
                            }} />
                          <IconButton as={BsFillXOctagonFill} color='red'
                            size='100%'
                            onClick={() => {
                              setWordInfo(word);
                              deleteWord(word);
                            }}
                          />
                        </>
                    }
                  </Flex>
                ))
              ) : (
                <Text style={{ color: 'black' }}>
                  단어를 추가하세요.
                </Text>
              )
            }

          </Flex>
          <Flex align='center' border='1px solid' borderColor='blue.200' justify='space-evenly'
            position='fixed'
            bottom='5%'
            left='1%'
            // width='100%'
            direction='column'
          >
            {
              problemModal ?
                <>
                  <Flex>
                    <Input
                      id='name'
                      name='name'
                      value={name}
                      autoComplete='false'
                      placeholder='시험지 제목'
                      onChange={(e) => onChange(e)}
                    />
                    <Input
                      id='amount'
                      name='amount'
                      value={amount}
                      autoComplete='false'
                      placeholder='몇 문제를 만들까요?'
                      onChange={(e) => onChange(e)}
                    />
                  </Flex>
                  {
                    createFinish ?
                      <>
                        <Flex justify='space-evenly'>
                          <Button backgroundColor='blue.200' color='white' onClick={() => setProblemList([])}>
                            원본
                          </Button>
                          <Button backgroundColor='blue.200' color='white' onClick={() => hideMean()}>
                            단어 가리기
                          </Button>
                          <Button backgroundColor='blue.200' color='white' onClick={() => hideWord()}>
                            뜻 가리기
                          </Button>
                          <Button backgroundColor='blue.200' color='white' onClick={() => retry()}>
                            다시 생성하기
                          </Button>
                        </Flex>
                        <Flex>
                          <Button backgroundColor='blue.200' color='white' onClick={() => captureProblem()}>
                            저장하기
                          </Button>
                        </Flex>
                      </>
                      :
                      <Button backgroundColor='blue.200' color='white' onClick={() => createProblem()}>
                        생성하기
                      </Button>
                  }
                </>
                :
                <>
                  <Button backgroundColor='blue.200' color='white' onClick={() => setProblemModal(true)}>
                    무작위 문제 생성
                  </Button>
                </>
            }
          </Flex>
        </div>


        <Flex ref={captureRef} direction='column' width="793.7px"
          height="1122.52px" backgroundColor='gray.200'>
          <Box width='100%' borderBottom='1px solid'>
            <Text my='10px' align='center'>
              영어 단어시험
            </Text>
          </Box>
          <Flex
            direction='column'
          >
            <Flex justify='space-between'>
              <Flex align='center' width='200px' height='50px' border='1px solid black'>
                <Box borderRight='1px solid black' width='50%' height='100%' >
                  <Text height='100%' align='center' p='10px'>
                    이름
                  </Text>
                </Box>
                <Text>

                </Text>
              </Flex>

              <Flex align='center' width='200px' height='50px' border='1px solid black'>
                <Box borderRight='1px solid black' width='50%' height='100%'>
                  <Text height='100%' align='center' p='10px'>
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
              problemList && problemList.length > 0 ?
                problemList.map((problem, index) => (
                  <Box
                    key={index}
                  >
                    <Flex justify='space-around'>
                      <Text>
                        {index}
                      </Text>
                      <Text borderBottom={problem.word ? 'none' : '1px solid black'}>
                        {problem.word ?
                          problem.word
                          :
                          "　　　　　　　"
                        }
                      </Text>
                      <Text borderBottom={problem.mean ? 'none' : '1px solid black'}>
                        {problem.mean ?
                          problem.mean
                          :
                          "　　　　　　　"
                        }
                      </Text>
                    </Flex>

                  </Box>
                ))

                :
                ownList && ownList.length > 0 ?
                  ownList.map((originWord, index) => (
                    <Box
                      key={index}
                    >
                      <Flex justify='space-around'>
                        <Text>
                          {index}
                        </Text>
                        <Text>
                          {originWord.word}
                        </Text>
                        <Text>
                          {originWord.mean}
                        </Text>
                      </Flex>

                    </Box>
                  ))
                  :
                  <Text>
                    {ownList.length}
                  </Text>
            }
          </Flex>

        </Flex>

      </div >
    </>

  );
}
