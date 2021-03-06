import { REST_API_URL } from "../config/api-config";
import { fetchHttp } from "../utils/NetworkUtils"; 
import axios from 'axios';


const CONTEXT_PATH = '/alarms';
const API = {
    GET_ALARM_LIST: '/getAlarmList',
};

function getAlarmList(bodyFormData) {
//    console.log("getAlarmList called");

    let url = REST_API_URL + CONTEXT_PATH + API.GET_ALARM_LIST ;
    let header = {
        'Accept': 'application/json',
    };
    // let body = JSON.stringify({
    // });

    return fetchHttp(url, null, bodyFormData, header ).then(response => {
        if(!response.status) {
            return response;
        } else {
            return null;
        }
    });
}

const AxiosAPI = axios.create({
//    baseURL: REST_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const getAlarmList2 = async (bodyFormData) => {
    let url = REST_API_URL + CONTEXT_PATH + API.GET_ALARM_LIST ;

    try {
        const {data} = await AxiosAPI.post(url, bodyFormData);
        return data;
    } catch {
        console.log("Error!!!");
        return null;
    }
};

function getPostAPI(postId) {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

function getTDMapDetail(param) {

    let url = REST_API_URL + '/api/v2/locationInfo/get3DMapDetail';

    let header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    let body = JSON.stringify({
        emapId: param
    });

    return fetchHttp(url, null, body, header, 'POST').then(response => response);
}

function setTDMapMapping(param) {

    let url = REST_API_URL + '/api/v2/locationInfo/set3DMapMapping';

    let header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    let body = JSON.stringify(param);

    return fetchHttp(url, null, body, header, 'POST').then(response => response);
}

export default { getAlarmList, getAlarmList2, getPostAPI, getTDMapDetail, setTDMapMapping }; 