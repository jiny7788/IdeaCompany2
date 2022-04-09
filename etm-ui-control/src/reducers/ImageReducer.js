import { LOADIMAGE } from '../actions/ImageActions';
import { handleActions } from 'redux-actions';

const initialState = {
    gltfFile: 'models/gltf/Flower/Flower.glb'
};

// 방법 - 1 : Action 생성 함수를 직접 만든 경우
// export function counter(state = initialState, action) {
//     switch (action.type) {
//         case LOADIMAGE:
//             console.log("LOADIMAGE:", action)
//             return { gltfFile: action.payload };
//         default:
//             return state;
//     }
// }

// 방법 - 2 : handleActions로 reducer 만들기
//  switch 문 대신 handleActions 사용하기
export const imageLoader = handleActions({    
    LOADIMAGE: (state, action) => {
        //console.log("LOADIMAGE:", action);
        return ({...state,
            gltfFile: action.payload
        });
    } 
}, initialState);


