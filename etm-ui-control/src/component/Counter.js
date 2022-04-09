import React from "react";
import PropTypes from 'prop-types';
import './Counter.css';

import { connect, useSelector, useDispatch  } from "react-redux";
import * as counterActions from "../actions/CounterActions";

//const Counter = ({ number, onIncrement, onDecrement }) => {
const Counter = () => {
    
    // Subscribe 방법 - 2 : useSelector, useDispatch Hook 사용 - function으로 만든 경우 사용
    // useSelector는 리덕스 스토어의 상태를 조회하는 Hook입니다.
    // state의 값은 store.getState() 함수를 호출했을 때 나타나는 결과물과 동일합니다.
    const { number } = useSelector(state => ({
        number: state.counter.number
    }));
    
    // useDispatch 는 리덕스 스토어의 dispatch 를 함수에서 사용 할 수 있게 해주는 Hook 입니다.
    const dispatch = useDispatch();
    // 각 액션들을 디스패치하는 함수들을 만드세요
    const onIncrement = () => dispatch(counterActions.increment(1));
    const onDecrement = () => dispatch(counterActions.decrement(1));

    return (
        <div className="Counter"
            onClick={onIncrement}
            onContextMenu={(e) => {
                e.preventDefault();
                onDecrement();
            }}
            style={{
                backgroundColor:'black'
            }}
        >
            {number}
        </div>
    );
};

Counter.propTypes = {
    number: PropTypes.number,
    onIncrement: PropTypes.func,
    onDecrement: PropTypes.func
};

Counter.defaultProps = {
    number: 0,
    onIncrement: () => console.warn('onIncrement not defined'),
    onDecrement: () => console.warn('onDecrement not defined')
};


// 방법 - 1 : Action 생성 함수를 직접 만든 경우
// const mapStateToProps = (state) => ({
//     number: state.number
// });

// const mapDispatchToProps = (dispatch) => ({
//     onIncrement: () => dispatch(actions.increment(1)),
//     onDecrement: () => dispatch(actions.decrement(1))
// });

// 방법 - 2 : createAction으로 Action 생성 함수를 만든 경우 - payload로 값이 온다. 
// const mapDispatchToProps = (dispatch) => ({
//     onIncrement: () => dispatch(actions.increment1(1)),
//     onDecrement: () => dispatch(actions.decrement1(1))
// });


// subscribe 방법 - 1 : connect 함수를 사용 - class / function으로 만든 경우 사용
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Counter);

// Subscribe 방법 - 2 : useSelector, useDispatch Hook 사용 - function으로 만든 경우 사용
export default Counter;