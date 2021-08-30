import React, { useState, useEffect } from 'react'
import {useHistory} from "react-router";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CButton,
} from '@coreui/react'
import { DocsCallout, DocsExample } from 'src/components'
import BoardService from 'src/services/BoardService'


const Tables = ({ match }) => {
  const {pageno} = match.params;

  const [data, setData] = useState({
    p_num: 1,
    paging: {},
    boards: [],
  });

  useEffect(() => {
    if(pageno) {
      //console.log("case 1");
      listBoard(pageno);
    } else {
      //console.log("case 2");
      listBoard(data.p_num);
    }
    return () => {
      //console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

  
  const history = useHistory();
  
  const listBoard = (p_num) => {
    //console.log(": " + p_num);
    BoardService.getBoards(p_num).then((res) => {
      setData({
        p_num: res.data.pagingData.currentPageNum,
        paging: res.data.pagingData,
        boards: res.data.list,
      });
      // console.log(res.data.pagingData);
    });
  };

  const change_date = (published_at) => {
    var moment = require('moment');

    const publish_date = moment(published_at).format('YYYY-MM-DD hh:mm:ss');

    return publish_date;
  }

  const viewList = () => (
    data.boards.map(item => (
      <CTableRow>
        <CTableHeaderCell scope="row">{item.no}</CTableHeaderCell>
        <CTableDataCell onClick={() => readBoard(item.no, data.p_num)}>{item.title}</CTableDataCell>
        <CTableDataCell>{item.memberNo}</CTableDataCell>
        <CTableDataCell>{item.createdTime && change_date(item.createdTime)}</CTableDataCell>
        <CTableDataCell>{item.updatedTime && change_date(item.updatedTime)}</CTableDataCell>
        <CTableDataCell>{item.likes}</CTableDataCell>
        <CTableDataCell>{item.counts}</CTableDataCell>
      </CTableRow>
    ))
  );

  const readBoard = (no, pageno) => {
    //console.log("Call readBoard : " + pageno);
    history.push(`/read-board/${no}&${pageno}`);
  }

  const viewPaging = () => {
    const pageNums = [];

    for (
      let i = data.paging.pageNumStart;
      i <= data.paging.pageNumEnd;
      i++
    ) {
      pageNums.push(i);
    }

    return pageNums.map((page) => {
      if(page==data.p_num)
        return (<CPaginationItem active>{page}</CPaginationItem>);
      else
        return (<CPaginationItem onClick={() => listBoard(page)}>{page}</CPaginationItem>);
    });
  };

  const viewPrev = () => {
    if (data.p_num > 1) { 
      return (<CPaginationItem onClick={() => { listBoard(data.paging.currentPageNum - 1)  }}>Previous</CPaginationItem>);
    } else {
      return (<CPaginationItem disabled>Previous</CPaginationItem>);
    }
  }

  const viewNext = () => {
    if (data.paging.next) { 
      return (<CPaginationItem onClick={() => { if (data.paging.next) { listBoard(data.paging.currentPageNum + 1) } }}>Next</CPaginationItem>);
    } else {
      return (<CPaginationItem disabled>Next</CPaginationItem>);
    }
  }

  const createBoard = () => {
    history.push("/create-board/_create&1");
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
              <div align="right"><CButton color="info" onClick={()=>createBoard()}>새글</CButton></div>
          </CCardHeader>
          <CCardBody>
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">글 번호</CTableHeaderCell>
                  <CTableHeaderCell scope="col">타이틀</CTableHeaderCell>
                  <CTableHeaderCell scope="col">작성자</CTableHeaderCell>
                  <CTableHeaderCell scope="col">작성일</CTableHeaderCell>
                  <CTableHeaderCell scope="col">갱신일</CTableHeaderCell>
                  <CTableHeaderCell scope="col">좋아요수</CTableHeaderCell>
                  <CTableHeaderCell scope="col">조회수</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {viewList()}
              </CTableBody>
            </CTable>
            <CPagination className="justify-content-end" aria-label="Page navigation example">
              {viewPrev()}
              {viewPaging()}
              {viewNext()}
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tables
