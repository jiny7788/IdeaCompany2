import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import BoardService from "../../apis/BoardService"
import TextEditor from '../TextEditor';
import {Container, Box, Card, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateKnowledge = () => {
    const { no, pageno } = useParams();    

    const [type, setType] = useState("1");
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [memberNo, setMebmerNo] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (!no) {
            //console.log('생성');
          } else {
            BoardService.getOneBoard(no).then((res) => {
                setType(res.data.type);
                setTitle(res.data.title);
                setContents(res.data.contents);
            });            
        }

        return () => {
          //console.log('컴포넌트가 화면에서 사라짐');
        };
      }, []);

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    
    const onContentsChange = (update) => {
        setContents(update);
    };

    const createBoard = () => {
        let board = {
            type: type,
            title: title,
            contents: contents,
            memberNo: memberNo,
        };
        console.log("board => " + JSON.stringify(board));

        if (!no) {
            BoardService.createBoard(board).then((res) => {
                navigate(`/knowledges`);
            });
        } else {
            BoardService.updateBoard(no, board).then((res) => {
                navigate(`/knowledges/${pageno}`);
        });
        }
    }

    const cancel = () => {
        navigate(`/knowledges/${pageno}`);
    }

    return (
        <Container maxWidth={false}>
            <Box sx={{ mt: 3 }}>
                <InputLabel id="select-label">Board Type</InputLabel>
                <Select
                    labelId="select-label"
                    id="select-label"
                    value={type}
                    label="Board Type"
                    onChange={handleTypeChange}
                >
                    <MenuItem value={"1"}>자유게시판</MenuItem>
                    <MenuItem value={"2"}>질문과 답변</MenuItem>
                </Select>
            </Box>
            <Box sx={{ mt: 3 }}>
                <TextField
                    required
                    id="outlined-required"
                    label="제목"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth 
                />
            </Box> 
            <Box sx={{ mt: 3 }}>
                <TextEditor value={contents} onChange={onContentsChange} readOnly={false} />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={createBoard} >저장</Button>{" "}
                <Button variant="outlined" onClick={cancel}>취소</Button>
            </Box>
        </Container>            
    );
};

export default CreateKnowledge;
