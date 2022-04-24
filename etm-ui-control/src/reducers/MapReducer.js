import {ADDALARM, REMOVEALARM, CHANGEOBJECT} from '../actions/MapActions';
import { handleActions } from 'redux-actions';

const initialState = {
    alarmList: [],
    changeObject: {}
};


export const mapchanger = handleActions({
    ADDALARM: (state, action) =>({
        ...state,
        alarmList: state.alarmList.concat(action.payload)
    }),
    REMOVEALARM: (state, action) => ({
        ...state,
        alarmList: state.alarmList.filter( (item) => (action.payload.findIndex( (element) => element === item ) ) < 0  )
    }),
    CHANGEOBJECT: (state, action) => ({
        ...state,
        changeObject: action.payload
    })
}, initialState);