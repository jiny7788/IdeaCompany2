import {ADDALARM, REMOVEALARM, CHANGEOBJECT, ADDMAP, REMOVEMAP, ADDASSET, REMOVEASSET, SAVEMAP} from '../actions/MapActions';
import { handleActions } from 'redux-actions';

const initialState = {
    addAssetsId: '',
    removeAssetsId: '',
    changeObject: {},
    addMap: {},
    removeMap: {},
    addAsset: {},
    removeAsset: {},
    saveMap: false
};


export const mapchanger = handleActions({
    ADDALARM: (state, action) => ({
        ...initialState,
        addAssetsId: action.payload
    }),
    REMOVEALARM: (state, action) => ({
        ...initialState,
        removeAssetsId: action.payload
    }),
    CHANGEOBJECT: (state, action) => ({
        ...initialState,
        changeObject: action.payload
    }),
    ADDMAP: (state, action) => ({
        ...initialState,
        addMap: action.payload
    }),
    REMOVEMAP: (state, action) => ({
        ...initialState,
        removeMap: action.payload
    }),
    ADDASSET: (state, action) => ({
        ...initialState,
        addAsset: action.payload
    }),
    REMOVEASSET: (state, action) => ({
        ...initialState,
        removeAsset: action.payload
    }),
    SAVEMAP: (state, action) => ({
        ...initialState,
        saveMap: action.payload
    })
}, initialState);