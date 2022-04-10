import { combineReducers } from "redux";
import { counter } from "./CounterReducer";
import { imageLoader } from "./ImageReducer";
import { postReducer } from "./PostReducer";


export const rootReducer = combineReducers({
    counter, imageLoader, postReducer
});