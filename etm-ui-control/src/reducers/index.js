import { combineReducers } from "redux";
import { counter } from "./CounterReducer";
import { imageLoader } from "./ImageReducer";


export const rootReducer = combineReducers({
    counter, imageLoader
});