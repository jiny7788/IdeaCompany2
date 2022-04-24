import { createAction } from "redux-actions";

// Action Type 정의
export const ADDALARM = 'ADDALARM';
export const REMOVEALARM = 'REMOVEALARM';
export const CHANGEOBJECT = 'CHANGEOBJECT';

// Action 함수 등록
export const addAlarm = createAction(ADDALARM);             // 알람 자산을 등록한다. array [1,2 ...]
export const removeAlarm = createAction(REMOVEALARM);       // 알람에서 뺄 자산을 등록한다. array [1,2 ...]
export const changeObject = createAction(CHANGEOBJECT);