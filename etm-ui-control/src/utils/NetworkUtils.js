export let session_expired_msg = true;

export const requestError = (status) => {
    console.debug('requestError - status: ' + status);
    
    // eslint-disable-next-line default-case
    switch(status) {
        case 401:
            if(session_expired_msg){
                session_expired_msg = false;
                alert("세션인증이 만료되었습니다.");
            }
            
            localStorage.clear();
            document.location.href = "/login";
            break;
    }
}


export function fetchHttp(url, params, body, header, method, errorHandler) {

    if(params) {
        let queryString = objToQueryString(params);
        url = url + "?" + queryString;        
    }

    if(!method) {
        method = 'POST';
    }

    if(method.toUpperCase() === 'GET') {
        body = null;
    }

    return fetch(url, {
        method: method,
        headers: header,
        body: body,
        credentials: 'include',
        timeout: 10000,
    })
    .then((response) => {

        if(response.status !== 200) {
            if(errorHandler) {
                errorHandler(response.status, response.statusText)
            } else {
                requestError(response.status); //default error handler
            }
        }        

        if(response.status !== 200) {
            new Error(response)
        }

        return response.json();
    })
    .then((responseData) => {

        return responseData;

    })
    .catch((error) => {
        console.error(error);
    });
}

export function fetchFileHttp(url, params, body, header, method, errorHandler) {

    if(params) {
        let queryString = objToQueryString(params);
        url = url + "?" + queryString;
    }

    let headers = {
        'Accept': 'application/json'
    };

    if(header) {
        headers = Object.assign(headers, header)
    }

    if(!method) {
        method = 'post';
    }

    return fetch(url, {
        method: method,
        headers: headers,
        body: body,
        credentials: 'include'
    })
    .then((response) => {

        if(response.status !== 200) {
            if(errorHandler) {
                errorHandler(response.status, response.statusText)
            } else {
                requestError(response.status); //default error handler
            }
        }

        if(response.status !== 200) {
            new Error(response)
        }

        return response;
    })
    .then((responseData) => {
        return responseData;

    })
    .catch((error) => {
        console.error(error);
    });


}

export function objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
}
