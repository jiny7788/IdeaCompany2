import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import BoardService from "../../apis/BoardService"
import TextEditor from '../TextEditor';
import {Container, Box, Card, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateKnowledge = () => {
    let {no, pageno} = useParams();
    if(!no) {
        no = "_create";
        pageno = 0;
    }
    const [data, setData] = useState({
        no: no,
        pageNo: pageno,
        board: {},
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (data.no === "_create") {
            //console.log('생성');
          } else {
            BoardService.getOneBoard(data.no).then((res) => {
                setData({
                    ...data,
                    board: res.data 
                });
                console.log('Start!!!');
                console.log(res.data);
                console.log(data);
            });            
        }

        return () => {
          //console.log('컴포넌트가 화면에서 사라짐');
        };
      }, []);

    const handleTypeChange = (event) => {
        console.log(event.target.value);
        setData({
            ...data,
                board: {
                    ...data.board,
                    type: event.target.value
                }
        });
    };
    
    const handleTitleChange = (event) => {
        setData({
            ...data,
                board: {
                    ...data.board,
                    title: event.target.value
                }
        });
        console.log('handleTitleChange');
        console.log(event.target.value);
    }
    
    const onContentsChange = (update) => {
        setData({
              ...data,
              board: {
                  ...data.board,
                  contents: update
              }
        });
        console.log('onContentsChange');
        console.log(data);
    };

    const createBoard = () => {
        let board = {
            type: data.board.type,
            title: data.board.title,
            contents: data.board.contents,
            memberNo: data.board.memberNo,
        };
        console.log("board => " + JSON.stringify(board));

        if (data.no === "_create") {
        BoardService.createBoard(board).then((res) => {
            navigate(`/knowledges`);
        });
        } else {
        BoardService.updateBoard(data.no, board).then((res) => {
            navigate(`/knowledges/${data.pageNo}`);
        });
        }
    }

    const cancel = () => {
        navigate(`/knowledges/${data.pageNo}`);
    }

    return (
        <Container maxWidth={false}>
            <FormControl fullWidth>
            <Box sx={{ mt: 3 }}>
                <InputLabel id="select-label">Board Type</InputLabel>
                <Select
                    labelId="select-label"
                    id="select-label"
                    value={data.board.type}
                    label="Board Type"
                    onChange={handleTypeChange}
                >
                    <MenuItem value={"1"}>자유게시판</MenuItem>
                    <MenuItem value={"2"}>질문과 답변</MenuItem>
                </Select>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Card>
                    <TextField
                        required
                        id="outlined-required"
                        label="제목"
                        defaultValue="제목"
                        value={data.board.title}
                        onChange={handleTitleChange}
                    />
                </Card>      
            </Box> 
            <Box sx={{ mt: 3 }}>
                <TextEditor value={data.board.contents} onChange={onContentsChange} readOnly={false} />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={createBoard} >저장</Button>
                <Button variant="outlined" onClick={cancel}>취소</Button>
            </Box>
            </FormControl>
        </Container>            
    );
};

export default CreateKnowledge;

