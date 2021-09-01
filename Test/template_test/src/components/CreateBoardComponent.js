import React, { Component } from 'react'
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
  CFormSelect,
} from '@coreui/react'
import BoardService from "../services/BoardService"
import TextEditor from './TextEditor';


class CreateBoardComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      no: this.props.match.params.no,
      pageNo: this.props.match.params.pageno,
      board: {},
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.changeContentsHandler = this.changeContentsHandler.bind(this);
    this.createBoard = this.createBoard.bind(this);
  }

  componentDidMount() {
    if (this.state.no === "_create") {
        this.setState( prev => ({
          ...prev,
          board: {
            type:"1",
            title:"",            
            contents:"",
            memberNo:1,
          }
        }));
    } else {
        BoardService.getOneBoard(this.state.no).then((res) => {
          this.setState( prev => ({
            ...prev,
            board: res.data,
            }));
        });
    }
  }

  cancel() {
    this.props.history.push(`/base/tables/${this.state.pageNo}`);
  }

  changeHandler = (event) => {
    const {name, value} = event.target;
    this.setState( prev => ({
      ...prev,
      board: {
        ...prev.board,
        [name]:value
      }
    }));
  };

  // changeContentsHandler = (event, editor) => {
  //   const content = editor.getData();
  //   this.setState(prev => ({
  //       ...prev,
  //       board: {
  //         ...prev.board,
  //         contents:content,
  //       }
  //     }));
  // };

  changeContentsHandler = (data) => {
    console.log(data);
    this.setState(prev => ({
           ...prev,
           board: {
             ...prev.board,
             contents:data,
           }
         }));
  }

  createBoard = (event) => {
    //console.log("board => " + JSON.stringify(this.state.board));
    if (this.state.no === "_create") {
      BoardService.createBoard(this.state.board).then((res) => {
        this.props.history.push(`/base/tables/${this.state.pageNo}`);
      });
    } else {
      BoardService.updateBoard(this.state.no, this.state.board).then((res) => {
        this.props.history.push(`/base/tables/${this.state.pageNo}`);
      });
    }
  };
  
  render() {
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
                  <CFormSelect aria-label="Default select example "
                    name="type" 
                    value={this.state.board.type}
                    onChange={this.changeHandler}
                  >
                    <option value="1">자유게시판</option>
                    <option value="2">질문과 답변</option>
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input2">Title</CFormLabel>
                  <CFormInput
                    name="title"
                    type="text"
                    id="Input2"
                    value={this.state.board.title}
                    onChange={this.changeHandler}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input3">Contents</CFormLabel>
                  <TextEditor
                    value={this.state.board.contents}
                    onChange={this.changeContentsHandler}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="Input4">Member No</CFormLabel>
                  <CFormInput
                    type="text"
                    name="memberNo"
                    id="Input4"
                    value={this.state.board.memberNo}
                    onChange={this.changeHandler}
                    readOnly
                  />
                </div>
              </CForm>
              <CButton color="info" onClick={this.createBoard}>Save</CButton>{" "}
              <CButton color="info" onClick={this.cancel.bind(this)}>Cancel</CButton>{" "}
            </div>
          </CCardBody>
        </CCard>
      </CCol>  
    </CRow>
    );
    }
}

export default CreateBoardComponent
