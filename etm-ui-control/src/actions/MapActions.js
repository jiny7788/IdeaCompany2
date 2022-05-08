import { createAction } from "redux-actions";

// Action Type 정의
export const ADDALARM = 'ADDALARM';
export const REMOVEALARM = 'REMOVEALARM';
export const CHANGEOBJECT = 'CHANGEOBJECT';
export const ADDMAP = 'ADDMAP';
export const REMOVEMAP = 'REMOVEMAP';
export const ADDASSET = 'ADDASSET';
export const REMOVEASSET = 'REMOVEASSET';
export const SAVEMAP = 'SAVEMAP';

// Action 함수 등록
export const addAlarm = createAction(ADDALARM);             // 알람 자산을 등록한다. array [1,2 ...]
export const removeAlarm = createAction(REMOVEALARM);       // 알람에서 뺄 자산을 등록한다. array [1,2 ...]
export const changeObject = createAction(CHANGEOBJECT);     // 자산을 이동, 확대, 회전시킬때 호출한다. 
export const addMap = createAction(ADDMAP);                 // Map 파일을 추가한다.
export const removeMap = createAction(REMOVEMAP);           // Map 파일을 삭제한다.
export const addAsset = createAction(ADDASSET);             // Asset을 추가한다.
export const removeAsset = createAction(REMOVEASSET);       // Asset을 삭제한다. 
export const saveMap = createAction(SAVEMAP);               // Map을 저장한다.