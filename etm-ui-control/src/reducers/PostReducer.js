import { GET_POST_PENDING, GET_POST_SUCCESS, GET_POST_FAILURE } from "../actions/PostActions";
import { handleActions } from 'redux-actions';

const initialState = {
    pending: false,
    error: false,
    data: {
        title:'',
        body:''
    }
}

export const postReducer = handleActions({
    GET_POST_PENDING: (state, action) => ({
        ...state,
        pending: true,
        error: false
    }),
    GET_POST_SUCCESS: (state, action) => {
        const {title, body} = action.payload.data;
        return ({
            ...state,
            pending: false,
            error: false,
            data: {
                title,
                body
            }
        });
    },
    GET_POST_FAILURE: (state, action) => ({
        ...state,
        pending: false,
        error: true
    })
}, initialState);