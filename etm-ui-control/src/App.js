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

class App extends Component {
  render() {
    const { gltfFile, loadImage } = this.props;
    console.log(this.props);

    return (
      <div id="App" className="App">
        <IterationSample onChangeFile={(fn) => loadImage(fn)} />
        <Counter />
        <div className='AlarmList' style={{ textAlign: 'center', border: '1px solid blue'}} >
          <AlarmListContainer />
        </div>        
        <div className='3DMap' style={{ width: '80%', height: '500px' }}>
            <GltfViewer1 />
        </div> 
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gltfFile: state.imageLoader.gltfFile
});

const mapDispatchToProps = (dispatch) => ({
  loadImage: (fileName) => dispatch(imageActions.loadImage(fileName))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);