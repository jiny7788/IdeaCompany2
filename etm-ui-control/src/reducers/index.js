import { combineReducers } from "redux";
import { counter } from "./CounterReducer";
import { imageLoader } from "./ImageReducer";
import { postReducer } from "./PostReducer";
import { mapchanger } from "./MapReducer";


export const rootReducer = combineReducers({
    counter, imageLoader, postReducer, mapchanger
});