import { createAction } from "redux-actions";

// Action Type 정의
export const LOADIMAGE = 'LOADIMAGE' ;

/*
 방법 1 - Action 생성 함수 정의 : Action을 좀 더 사용하기 편하게 함수로 만든다.
    원래 Action은 type을 필수값으로 하는 Object로 정의되는데 Action 생성 함수는 Action을 리턴한다.
    추가되는 param의 이름을 payload로 통일 - createAction을 Action 생성 함수를 만들면 무조건 payload로 추가되므로 호환성 유지 차원에서 payload로 통일
*/
// export const loadImage = (image) => ({
//     type: LOADIMAGE, 
//     payload: image
// });

/*
 방법 2 - 아래와 같이 createAction을 사용해서 Action 생성 함수를 정의할 수도 있다.
    사전 작업 : npm install redux-actions
    추가로 주어지는 data는 payload 밑에 붙게 된다.
    예) increment(1); 로 호출하면 { type: INCREMENT, payload: 1 }로 Action이 전달된다.  따라서 reducer에 변경이 필요하다.
*/
export const loadImage = createAction(LOADIMAGE);