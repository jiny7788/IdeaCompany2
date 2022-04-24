import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import Viewer from './viewer/Viewer';
import Viewer1 from './viewer/Viewer1';
import Viewer4 from './viewer/Viewer4';
import GltfViewer from './viewer/GltfViewer';
import IterationSample from './component/IterationSample';
import GltfViewer1 from './viewer/GltfViewer1';
import Counter from './component/Counter';
import Counter1 from './component/Counter1';
import AlarmListContainer from './component/AlarmListContainer';

import { connect  } from "react-redux";
import * as imageActions from "./actions/ImageActions";
import * as postActions from "./actions/PostActions";
import * as mapActions from "./actions/MapActions";
import { bindActionCreators } from 'redux';
import AlarmsApi from './apis/AlarmApi';


class App extends Component {

  state = {
    position: {},
    scale: {},
    rotation: {}
  };

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

  onMouseOver = (event, userData) => {  // 객체위에 마우스가 갔을 때...
    console.log(`onMouseOver assetsId:${userData.assetsId}, assetsName:${userData.name}`);
  };

  onChange = (changeObject) => {        // 객체에 변화가 생겼을 때 ...
    console.log('onChange object:');
    console.log(changeObject);
  };

  addFunc = () => {
    const { mapActions  } = this.props;

    mapActions.addAlarm([1, 2]);
    // mapActions.changeObject({
    //   assetsId:1, 
    //   position: {
    //     x: this.state.position.x,
    //     y: this.state.position.y,
    //     z: this.state.position.z
    //   }
    // });
  };

  delFunc = () => {
    const { mapActions  } = this.props;

    mapActions.removeAlarm([1]);    
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      position: {
        ...this.state.position,
        [e.target.name]: e.target.value
      }
    });

    console.log(this.state.position);
  }

  render() {
    const { loadImage, post, error, loading } = this.props;
    //console.log(this.props);

    return (
      <div id="App" className="App">
        {/* 
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
        <div className='AlarmList' style={{ textAlign: 'center', border: '1px solid blue'}} >
          <AlarmListContainer />
        </div>
        */}
        <div>
          <button onClick={()=>this.addFunc()}>추가</button>
          <button onClick={()=>this.delFunc()}>제거</button>
        </div>        
        <div className='3DMap' style={{ width: '80%', height: '800px' }}>
            <Viewer4 onMouseOver={this.onMouseOver} onChange={this.onChange} />
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
  postActions: bindActionCreators(postActions, dispatch),
  mapActions: bindActionCreators(mapActions, dispatch)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);