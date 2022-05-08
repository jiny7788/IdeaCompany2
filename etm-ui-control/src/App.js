import React, {Component} from 'react';
import './App.css';
import Viewer from './viewer/Viewer';
import Viewer1 from './viewer/Viewer1';
import Viewer2 from './viewer/Viewer2';
import Viewer3 from './viewer/Viewer3';
import TDViewer from './viewer/Viewer4';

import GltfViewer from './viewer/GltfViewer';
import IterationSample from './component/IterationSample';
import GltfViewer1 from './viewer/GltfViewer1';
import Counter from './component/Counter';
import Counter1 from './component/Counter1';
import AlarmListContainer from './component/AlarmListContainer';

import { connect  } from "react-redux";
import * as imageActions from "./actions/ImageActions";
import * as postActions from "./actions/PostActions"
import * as mapActions from "./actions/MapActions";
import { bindActionCreators } from 'redux';
import AlarmsApi from './apis/AlarmApi';
import TestViewer from './viewer/TestViewer';

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
      //console.log(response);
    } catch (e) {
      //console.log(e);
    }
  }
  
  componentDidMount() {
    // this.loadData();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.props.number !== prevProps.number) {
      this.loadData();
    }
  }

  onMouseOver = (event, userData) => {  // 객체위에 마우스가 갔을 때...
    console.log(`onMouseOver assetsId:${userData.assetsId}, assetsName:${userData.assetsName}`);
  };

  onChange = (changeObject) => {        // 객체에 변화가 생겼을 때 ...
    console.log('onChange object:');
    console.log(changeObject);
  };

  onClick = (event, userData) => {  // 객체를 클릭했을 떄....
    console.log(`onMouseClick assetsId:${userData.assetsId}, assetsName:${userData.assetsName}`);
  };

  addFunc = () => {
    const { mapActions  } = this.props;

    mapActions.addAlarm('233');

  };

  delFunc = () => {
    const { mapActions  } = this.props;

    mapActions.removeAlarm('233');    
  }

  addAsset = () => {
    const { mapActions } = this.props;

    mapActions.addAsset({
      "iconId": "sel_icon21",                 // 필수 값
      "fileName": "cctv_render_camera.gltf",  // 필수 값
      "assetsName": "4dx_001_door_03",        
      "fileSeq": 3,                           // 필수 값
      "assetsId": "239",                      // 필수 값
      "typeCode": "A"                         // 필수 값 : 지도 링크면 "M", 자산이면 "A"
    });
    
  }

  delAsset = () => {
    const { mapActions } = this.props;

    mapActions.removeAsset({
        "iconId": "sel_icon21",                 // 필수 값
        "fileName": "cctv_render_camera.gltf",  // 필수 값
        "assetsName": "4dx_001_door_03",        
        "fileSeq": 3,                           // 필수 값
        "assetsId": "239",                      // 필수 값
        "typeCode": "A"                         // 필수 값 : 지도 링크면 "M", 자산이면 "A"
    });
  }

  addMap = () => {
    const { mapActions } = this.props;

    mapActions.addMap({
      "assetsId": "SEO_SITE1",  // 필수 값 (emapId랑 같은 걸로 설정)
      "emapId": "SEO_SITE1",    // 필수 값
      "emapVer": "SEO_SITE1",   // 필수 값
      "fileSeq": 4,             // 필수 값
      "fileName": "planet_building_8st.gltf"   // 필수 값
    });
    
  }

  delMap = () => {
    const { mapActions } = this.props;

    mapActions.removeMap({
      "assetsId": "SEO_SITE1",  // 필수 값 (emapId랑 같은 걸로 설정)
      "emapId": "SEO_SITE1",    // 필수 값
      "emapVer": "SEO_SITE1",   // 필수 값
      "fileSeq": 4,             // 필수 값
      "fileName": "planet_building_8st.gltf"   // 필수 값
    });
  }

  save = () => {
    const { mapActions } = this.props;

    mapActions.saveMap(true);
  }
  
  render() {
    const { loadImage, post, error, loading } = this.props;
    //console.log(this.props);

    return (
      <div id="App" className="App">
        {
          /*
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
          */  
        }
        <div>
          <button onClick={()=>this.addFunc()}>알람 설정</button>
          <button onClick={()=>this.delFunc()}>알람 제거</button>
          <button onClick={()=>this.addAsset()}>자산 추가</button>
          <button onClick={()=>this.delAsset()}>자산 삭제</button>
          <button onClick={()=>this.addMap()}>지도 추가</button>
          <button onClick={() => this.delMap()}>지도 삭제</button>
          <button onClick={() => this.save()}>저장</button>
        </div>    
        <div className='3DMap' style={{ width: '80%', height: '600px' }}>
          <TDViewer viewerid='Viewer01' emapInfo={{ emapId: "SEO_SITE1" }} editMode={false} onMouseOver={this.onMouseOver} onChange={this.onChange} onClick={this.onClick}/>
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