import React, { useState, useEffect } from 'react'
import {useHistory} from "react-router";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import BoardService from "../services/BoardService"

const ReadBoardComponent = ({ match }) => {
  const {no, pageno} = match.params;
  const [data, setData] = useState({
    no: no,
    pageNo: pageno,
    board: {},
  });

  useEffect(() => {
    BoardService.getOneBoard(data.no).then((res) => {
      setData({
        ...data,
        board: res.data 
      });
    });
    return () => {
      //console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

  const history = useHistory();

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
    history.push(`/base/tables/${data.pageNo}`);
  };

  const goToUpdate = () => {
    history.push(`/create-board/${data.no}&${data.pageNo}`);
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
          history.push(`/base/tables/${data.pageNo}`);
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>게시판 읽기</strong>
          </CCardHeader>
          <CCardBody>
            <div>
              <CForm>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input1">Board Type</CFormLabel>
                  <CFormInput
                    type="text"
                    id="Input1"
                    value={returnBoardType(data.board.type)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input2">Title</CFormLabel>
                  <CFormInput
                    type="text"
                    id="Input2"
                    value={data.board.title}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input3">Contents</CFormLabel>
                  <CCard className="mb-4">
                    <CCardBody>
                      <Viewer content={data.board.contents}/>  
                    </CCardBody>
                  </CCard>                  
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input4">Member No</CFormLabel>
                  <CFormInput
                    type="text"
                    id="Input4"
                    value={data.board.memberNo}
                    readOnly
                  />
                </div>
              </CForm>
              <CButton color="info" onClick={() => goToList() }>글 목록으로 이동</CButton>{" "}
              <CButton color="info" onClick={() => goToUpdate() }>글 수정</CButton>{" "}
              <CButton color="info" onClick={() => deleteView()}>글 삭제</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>  
    </CRow>
  )
}

export default ReadBoardComponent
