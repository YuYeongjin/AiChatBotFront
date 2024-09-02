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
  const [saveWordList, setSaveWordList] = useState([]);
  const [saveWordInfo, setSaveWordInfo] = useState();

  const [btnComponent, setBtnComponent] = useState('');
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
    var word = [];
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

    axios.post("/api/word/totalWordList")
      .then((response) => {
        for (var i = 0; i < response.data.wordLists.length; i++) {
          word.push({
            "id": response.data.wordLists[i].id,
            "wordList": response.data.wordLists[i].wordList,
            "name": response.data.wordLists[i].name,
            "createdAt": response.data.wordLists[i].createdAt
          })
          setSaveWordList(word);
        }
      })
      .catch((error) => {
        setSaveWordList(word);
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
          alert("다시 시도해주세요.");
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
        alert("다시 시도해주세요.");
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
        alert("다시 시도해주세요.");
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
        alert("다시 시도해주세요.");
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
            setChangeWord(true);
          }

          if (response.data.status === '0') {
            alert(response.data.error);
          }
        })
        .catch((error) => {
          alert("다시 시도해주세요.");
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

  function saveReview(saveWords) {
    const jsonData = saveWords.wordList
      .replace(/(\{|\[|\}|\,)\s*([a-zA-Z0-9_]+)\s*=/g, '$1"$2":')
      .replace(/:\s*([^",}\]]+?)(?=,|\}|$)/g, ': "$1"')
      .replace(/=(?=[^\"])/g, ':');

    const parsedData = JSON.parse(jsonData);

    // todo 
    // 이름, 클릭시 바로 저장하기가 가능하게

    const list = [];
    for (var i = 0; i < parsedData.length; i++) {
      list.push({
        "id": parsedData[i].id,
        "word": parsedData[i].word,
        "mean": parsedData[i].mean
      });
    }

    setOwnList(list);
    setCreateFinish(true);
  }

  return (

    <>
      {excelModal && <ExcelModal setChangeWord={setChangeWord} onClose={() => setExcelModal(false)} />}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50vw' }}>
          <Flex justify='space-evenly' h='5vh' align='center'>
            <Text fontSize='17px'>
              단어장
            </Text>
            {
              btnComponent === '' ?
                null
                :
                <Button my='auto' backgroundColor='green.300' color='white' onClick={() => setBtnComponent('')}>
                  다른 기능
                </Button>
            }
          </Flex>

          <Card border='2px solid' height='12vh' mb='3vh' align='center' borderColor='green.100' width='100%' mx='auto'>
            {
              btnComponent === 'create' ?
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
                btnComponent === 'insert' ?

                  <>
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
                  </>
                  :
                  <Flex width='100%' justify='space-around' align='center'>
                    <Box flex='1' >
                      <Button width='100%' backgroundColor='yellow.100' onClick={() => setBtnComponent('insert')}>
                        Insert
                      </Button>
                    </Box>
                    <Box flex='1'>
                      <Button width='100%' backgroundColor='yellow.100' onClick={() => setExcelModal(true)}>
                        Excel
                      </Button>
                    </Box>
                    <Box flex='1'>
                      <Button width='100%' backgroundColor='yellow.100' onClick={() => setBtnComponent('create')}>
                        Create
                      </Button>
                    </Box>
                  </Flex>
            }
          </Card>

          <Flex direction='column' maxH='40vh' h='40vh' backgroundColor='blue.200' overflowY='auto'>
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
          <Card
            direction='column' maxH='40vh' h='40vh' backgroundColor='green.100' overflowY='auto'

          >
            {
              saveWordList.length > 0 ?
                saveWordList.map((list, index) => (
                  <Card
                    key={index}
                    onClick={() => {
                      saveReview(list);
                    }}
                    mb="2px"
                    backgroundColor='orange.100'
                    width='90%'
                    mx='auto'
                  >
                    <Flex justify='space-around'>
                      <Text>
                        {index}
                      </Text>
                      <Text>
                        {list.name}
                      </Text>
                      <Text>
                        {(list.createdAt).replace('T', ' ').substring(0, 19)}
                      </Text>
                    </Flex>
                  </Card>
                ))
                :
                <Text>
                  저장된 리스트가 없습니다.
                </Text>
            }
          </Card>
        </div>


        <Flex ref={captureRef} direction='column'
          width="793.7px"
          height="1122.52px"
          border='1px solid gray'
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

      </div >
    </>

  );
}
