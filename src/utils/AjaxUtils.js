import _ from 'underscore';
import axios from 'axios';
import {message} from 'antd';

var URL_PREFIX_INNER = '/api/v1';

//if(__DEV__){
//    URL_PREFIX_INNER = 'https://beta.itsomg.com/api/v1';
//}

export const URL_PREFIX = URL_PREFIX_INNER;

class AjaxUtils {

    init(checkTokenRequest) {
        //用于遇到异常情况后检查Token是否已过期
        this.checkTokenRequest = checkTokenRequest;
    }

    doGetRequest(url) {
        return this._doRequest('get', url, null);
    }

    doPostRequest(url, data) {
        return this._doRequest('post', url, data);
    }

    doPutRequest(url, data){
        return this._doRequest('put', url, data);
    }

    doDeleteRequest(url, data){
        return this._doRequest('delete', url, data);
    }

    _doRequest(method, url, data) {

        url = URL_PREFIX + url;

        var checkTokenRequest = this.checkTokenRequest;
        return axios({
            method: method,
            url: url,
            data: data
        }).then(function (response) {
            if (response.status !== 200) {
                return Promise.reject(response);
            }
            return response;
        }, function ({response}) {
            var status = response.status;
            if (status === 404) {
                message.error("404 URL  :  " + url);
            }
            else if (status === 401) {
                //用户token不合法
                checkTokenRequest();
            }
            else {
                message.error("Error Code :" + status);
            }
            response.data = null;
            return Promise.reject(response);
        });

    }

}


export default new AjaxUtils();