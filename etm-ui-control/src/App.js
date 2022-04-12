import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import Viewer from './viewer/Viewer';
import GltfViewer from './viewer/GltfViewer';
import IterationSample from './component/IterationSample';
import GltfViewer1 from './viewer/GltfViewer1';
import Counter from './component/Counter';
import Counter1 from './component/Counter1';
import AlarmListContainer from './component/AlarmListContainer';

import { connect  } from "react-redux";
import * as imageActions from "./actions/ImageActions";
import * as postActions from "./actions/PostActions"
import { bindActionCreators } from 'redux';
import AlarmsApi from './apis/AlarmApi';


class App extends Component {

  // 방법 - 1 : then 사용
  // loadData = () => {
  //   const { postActions, number } = this.props;

  //   // Pending 상태로 바꾼다.
  //   postActions.getPostPending();

  //   // http API를 호출한다.
  //   AlarmsApi.getPostAPI(number).then((response) => {
  //     // 성공시 Success 상태로 바꾼다. 
  //     postActions.getPostSuccess(response);
  //   }).catch(error => {
  //     // 실패시 Failure 상태로 바꾼다. 
  //     postActions.getPostFailure();
  //     console.log(error);
  //   });    
  // }

  // 방법 - 2 : wait 사용
  /*
  loadData = async () => {
    const { postActions, number } = this.props;
    try {
      // Pending 상태로 바꾼다.
      postActions.getPostPending();

      // http API를 호출한다.
      const response = await AlarmsApi.getPostAPI(number);

      // Success 상태로 바꾼다. 
      postActions.getPostSuccess(response);
    } catch(e) {
      // Failure 상태로 바꾼다. 
      postActions.getPostFailure();
    }
  }
  */

  // 방법 - 3 : redux-thunk로 정의된 action 생성함수 호출
  // 이게 사용하는 입장에서는 가장 간단하다.
  loadData = async () => {
    const { postActions, number } = this.props;
    try {
      const response = await postActions.getPost(number);
    } catch(e) {
    }
  }
  
  componentDidMount() {
    this.loadData();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.props.number !== prevProps.number) {
      this.loadData();
    }
  }

  render() {
    const { loadImage, post, error, loading } = this.props;
    //console.log(this.props);

    return (
      <div id="App" className="App">
        <IterationSample onChangeFile={(fn) => loadImage(fn)} />
        <Counter />
        {
          loading ? (<h2>로딩중...</h2>)
          : (
            error ? (<h2>오류 발생</h2>)
            : (
              <div>
                <h2>{post.title}</h2>
                <h3>{post.body}</h3>
              </div>
            )
          )
        }
        {/* 
        <div className='AlarmList' style={{ textAlign: 'center', border: '1px solid blue'}} >
          <AlarmListContainer />
        </div>
        */}        
        <div className='3DMap' style={{ width: '50%', height: '600px' }}>
            <Viewer />
        </div> 
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  number: state.counter.number,
  post: state.postReducer.data,
  loading: state.postReducer.pending,
  error: state.postReducer.error
});

const mapDispatchToProps = (dispatch) => ({
  loadImage: (fileName) => dispatch(imageActions.loadImage(fileName)),
  postActions: bindActionCreators(postActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);