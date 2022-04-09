import { INCREMENT, DECREMENT } from '../actions/CounterActions';
import { handleActions } from 'redux-actions';

const initialState = {
    number: 1
};

// 방법 - 1 : Action 생성 함수를 직접 만든 경우
// export function counter(state = initialState, action) {
//     switch (action.type) {
//         case INCREMENT:
//             console.log(action);
//             return { number: state.number + action.payload };
//         case DECREMENT:
//             return { number: state.number - action.payload };
//         default:
//             return state;
//     }
// }

// 방법 - 2 : handleActions로 reducer 만들기
//  switch 문 대신 handleActions 사용하기
export const counter = handleActions({    
    INCREMENT: (state, action) => ({
        ...state,
        number: state.number + action.payload
    }),
    DECREMENT: (state, action) => ({
        ...state,
        number: state.number - action.payload
    })
}, initialState);


