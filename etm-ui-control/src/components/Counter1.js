import React from "react";
import PropTypes from 'prop-types';
import './Counter.css';

import { connect  } from "react-redux";
import * as counterActions from "../actions/CounterActions";
import { bindActionCreators } from "redux";

//import {increment1, decrement1} from "../actions";

class Counter1 extends React.Component {

    // state = {
    //     number: 1,
    //     onIncrement: () => console.warn('OnIncrement not defined'),
    //     onDecrement: () => console.warn('OnDecrement not defined')
    // };

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.number !== prevState.number) {
    //         console.log("Changed Props");
    //         return {
    //             number: nextProps.number
    //         };
    //     }
    // }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.number && nextProps.number !== this.props.number) {
    //        // this.init(nextProps.number)
    //         console.log("componentWillReceiveProps: " + nextProps.number);
    //         this.setState({
    //             number: nextProps.number
    //         });
    //     }
    // }

    render() {
        const { increment, decrement } = this.state.Actions;
        
        return (
            <div className="Counter"
                onClick={()=>increment(1)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    decrement(1);
                }}
                style={{
                    backgroundColor:'black'
                }}
            >
                {this.props.number}
            </div>
        );
    }

}


// 방법 - 1 : Action 생성 함수를 직접 만든 경우
const mapStateToProps = (state) => ({
    number: state.counter.number
});

// const mapDispatchToProps = (dispatch) => ({
//     onIncrement: () => dispatch(counterActions.increment(1)),
//     onDecrement: () => dispatch(counterActions.decrement(1))
// });

// 방법 - 2
// const mapDispatchToProps = {
//     onIncrement: () => counterActions.increment1(1),
//     onDecrement: () => counterActions.decrement1(1)
//   };

// 방법 - 3
// const mapDispatchToProps = (dispatch) => ({
//     onIncrement: bindActionCreators(counterActions.increment1, dispatch),
//     onDecrement: bindActionCreators(counterActions.decrement1, dispatch)
// });
  
// 방법 - 4 : 한꺼번에 전체를 다 정의
const mapDispatchToProps = (dispatch) => ({
    Actions: bindActionCreators(counterActions, dispatch),
  });


// subscribe 방법 - 1 : connect 함수를 사용 - class / function으로 만든 경우 사용
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter1);