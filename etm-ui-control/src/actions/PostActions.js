import { createAction } from "redux-actions";
import AlarmApi from "../apis/AlarmApi";

export const GET_POST_PENDING = 'GET_POST_PENDING';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';

export const getPostPending = createAction(GET_POST_PENDING);
export const getPostSuccess = createAction(GET_POST_SUCCESS);
export const getPostFailure = createAction(GET_POST_FAILURE);

// redux-thunk를 이용해 객체가 아닌 함수를 dispath 한다
export const getPost = (postId) => dispatch => {
    dispatch(getPostPending());

    return AlarmApi.getPostAPI(postId).then((response) => {
        dispatch(getPostSuccess(response));
        return response;
    }).catch(error => {
        dispatch(getPostFailure(error));
        throw(error);
    });
}