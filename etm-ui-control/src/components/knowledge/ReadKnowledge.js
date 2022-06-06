import React, { useState, useEffect } from 'react'
import BoardService from "../../apis/BoardService"
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Container, Typography, Button } from '@mui/material';
import TextEditor from '../../components/TextEditor';



const ReadKnowledge = () => {
  const {no, pageno} = useParams();
  const [data, setData] = useState({
    no: no,
    pageNo: pageno,
    board: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    BoardService.getOneBoard(data.no).then((res) => {
      setData({
        ...data,
        board: res.data 
      });
//      console.log(data);
    });    

    return () => {
      //console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

  const returnBoardType = (typeNo) => {
    let type = null;
    if (typeNo == 1) {
      type = "자유게시판";
    } else if (typeNo == 2) {
      type = "질문과 답변 게시판";
    } else {
      type = "타입 미지정";
    }

    return String(type);
  };

  const goToList = () => {
    //console.log(data);
    navigate(`/knowledges/${data.pageNo}`);
  };

  const goToUpdate = () => {
    navigate(`/create-knowledge/${data.no}&${data.pageNo}`);
  };

  const deleteView = async () => {
    if (
      window.confirm(
        "정말로 글을 삭제하시겠습니까?\n삭제된 글은 복구 할 수 없습니다."
      )
    ) {
      BoardService.deleteBoard(data.no).then((res) => {
        //console.log("delete result => " + JSON.stringify(res));
        if (res.status == 200) {
          //history.push(`/base/tables/${data.pageNo}`);
          navigate(`/knowledges/${data.pageNo}`);
        } else {
          alert("글 삭제가 실패했습니다.");
        }
      });
    }
  };  

  const Viewer = ({content}) => (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );

  const onChange = (data) => {
    //console.log(data);
  };

  return (
      <Container maxWidth={false}>
        <Box sx={{ mt: 3 }}>
          <Card>
            <Typography variant="h5" component="div">
              {returnBoardType(data.board.type)}
            </Typography>
          </Card>          
        </Box> 
        <Box sx={{ mt: 3 }}>
          <Card>
            <Typography variant="h5" component="div">
              제목 : {data.board.title}
            </Typography>
          </Card>          
        </Box>  
          {
            /*
              < Viewer content = {data.board.contents} />
            */
            //console.log(data.board)
          }
          <TextEditor value={data.board.contents} readOnly={true} onChange={onChange} /> 
        <Box sx={{ mt: 3 }}>   
          <Container maxWidth={false}>
            <Button variant="outlined" onClick={() => goToList() }>글 목록으로 이동</Button>{" "}
            <Button variant="outlined" onClick={() => goToUpdate() }>글 수정</Button>{" "}
            <Button variant="outlined" onClick={() => deleteView()}>글 삭제</Button>     
          </Container>          
        </Box>
      </Container>
  );
};

export default ReadKnowledge;
