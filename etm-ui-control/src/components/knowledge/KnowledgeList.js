import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import BoardService from '../../apis/BoardService';
import {useNavigate} from "react-router-dom";

export const KnowledgeList = (props) => {
  let {pageno} = props;
  if( pageno===undefined ) pageno=1;

  const [limit, setLimit] = useState(10);
  const [pageInfo, setPageInfo] = useState({
    p_num: pageno,
    paging: {
      "currentPageNum": 1,
      "objectCountTotal": 37,
      "objectCountPerPage": 15,
      "objectStartNum": 0,
      "objectEndNum": 15,
      "pageNumCountTotal": 3,
      "pageNumCountPerPage": 10,
      "pageNumStart": 1,
      "pageNumEnd": 3,
      "prev": false,
      "next": true
    },
    boards: [],
  });

  useEffect(() => {
    // console.log('컴포넌트가 화면에 나타남');
    BoardService.getBoards(pageInfo.p_num).then((res) => {
      setPageInfo({
        p_num: res.data.pagingData.currentPageNum,
        paging: res.data.pagingData,
        boards: res.data.list,
      });
    });

    return () => {
    //  console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

  const handleLimitChange = (event) => {
    console.log(`LimitChange : ${event.target.value}`);
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    // console.log(`PageChange : ${newPage}`);
    BoardService.getBoards(newPage+1).then((res) => {
      setPageInfo({
        p_num: res.data.pagingData.currentPageNum,
        paging: res.data.pagingData,
        boards: res.data.list,
      });
    });
  };

  const navigate = useNavigate();
  const readKnowledge = (no) => {
    //console.log(`readKnowledge(${no}&${pageInfo.p_num})`);
    navigate(`/read-knowledge/${no}&${pageInfo.p_num}`);
  };


  return (
    <Card >
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  번호
                </TableCell>
                <TableCell>
                  타입
                </TableCell>
                <TableCell>
                  타이틀
                </TableCell>
                <TableCell>
                  작성자ID
                </TableCell>
                <TableCell>
                  작성날짜
                </TableCell>
                <TableCell>
                  좋아요
                </TableCell>
                <TableCell>
                  조회수
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageInfo.boards.map((item) => (
                <TableRow
                  hover
                  key={item.no}
                  onClick={()=>readKnowledge(item.no)}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >                      
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {item.no}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.type}
                  </TableCell>
                  <TableCell>
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {item.memberNo}
                  </TableCell>
                  <TableCell>
                    {item.createdTime}
                  </TableCell>
                  <TableCell>
                    {item.likes}
                  </TableCell>
                  <TableCell>
                    {item.counts}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={pageInfo.paging.objectCountTotal}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={pageInfo.p_num-1}
        rowsPerPage={pageInfo.paging.objectCountPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Card>
  );
};

