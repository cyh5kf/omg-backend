import axios from 'axios';
import _ from 'underscore';
import AjaxUtils from '../utils/AjaxUtils';
import LoginStore from '../stores/LoginStore';
import {URL_PREFIX} from '../utils/AjaxUtils';

const doGetRequest = function(url){
    url = URL_PREFIX + url;
    return axios({ method: 'get', url: url});
};

//登录
export const loginRequest = function ({email,password}) {

    email = encodeURIComponent(email);
    password = encodeURIComponent(password);

    return doGetRequest('/back/login?email=' + email + '&passwd=' + password).then(function (d) {
        if (d.status == 200) {
            LoginStore.setLoginUserInfo(d.data);
        }else {
            LoginStore.setLoginUserInfo(null);
        }
        return d;
    });

};



//退出
export const logoutRequest = function () {
    LoginStore.setLoginUserInfo(null);
    return doGetRequest('/back/logout').then(function (d) {
        return d;
    });
};


//checkToken
export const checkTokenRequest = function () {
    return doGetRequest('/back/heartbeat').then(function (d) {
        if (d.status === 200) {
            return d;
        }
        return Promise.reject();
    });
};



//emailLogin
export const emailLoginRequest = function ({email,password}) {

    email = encodeURIComponent(email);
    password = encodeURIComponent(password);
    return doGetRequest('/back/emailLogin?email=' + email + '&passwd=' + password).then(function (d) {
        return d;
    });

};


//resendAuthcode
export const resendAuthCodeRequest = function (email) {
    email = encodeURIComponent(email);
    return doGetRequest(`/back/resendAuthcode?email=${email}`).then(function (d) {
        return d;
    });
};


//authCodeCheck
export const authCodeCheckRequest = function (email,authCode) {
    email = encodeURIComponent(email);
    authCode = encodeURIComponent(authCode);
    return doGetRequest(`/back/authCodeCheck?email=${email}&authCode=${authCode}`).then(function (d) {
        if (d.status == 200) {
            var userInfo = d.data.model;
            LoginStore.setLoginUserInfo(userInfo);
        }else {
            LoginStore.setLoginUserInfo(null);
        }
        return d;
    });
};







//修改客服信息
export const modifyStaffRequest = function (data) {//email,name,phone
    return AjaxUtils.doPutRequest('/back/modifystaff',data).then(function(resp){
        var userInfo = LoginStore.getLoginUserInfo();
        delete data.email;
        userInfo = Object.assign({},userInfo,data);
        LoginStore.setLoginUserInfo(userInfo);
        return resp;
    });
};

//修改密码
export const modifyPasswordRequest = function (data) {//email,passwd,changepasswd
    return AjaxUtils.doPutRequest('/back/modifypasswd',data);
};


//删除客服
export const deleteStaffRequest = function (id) {
    return AjaxUtils.doDeleteRequest(`/back/deletestaff/${id}`);
};