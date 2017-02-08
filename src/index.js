import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route, IndexRedirect,browserHistory} from 'react-router';
import enUS from 'antd/lib/locale-provider/en_US';
import {LocaleProvider,message} from 'antd';
import './polyfill';
import LoginComposer from './views/Login/LoginComposer';
import AppComposer from './views/App/AppComposer';
import HomeComposer from './views/Home/HomeComposer';
import WatchListComposer from './views/WatchList/WatchListComposer';
import SystemLogComposer from './views/SystemLog/SystemLogComposer';
import TeamManageComposer from './views/TeamManage/TeamManageComposer';
import {UserQueryPage} from './views/UserQuery/UserQueryComposer';
import ClosedCaseComposer from './views/ClosedCase/ClosedCaseComposer';
import AccountInfoComposer from './views/AccountInfo/AccountInfoComposer';
import AjaxUtils from './utils/AjaxUtils';
import LoginStore from './stores/LoginStore';
import {checkTokenRequest} from './api/LoginApi';
import './views/index.less';




const history = browserHistory;


AjaxUtils.init(function(){
    checkTokenRequest().catch(function(){
        message.error("Login information has expired, please login again.");
        history.push('/login')
    });
});


const validateLogin = function (next, replace, callback) {
    var userInfo = LoginStore.getLoginUserInfo();
    if (!userInfo) {
        replace('/login')
    }
    callback()
};

const validateAdmin = function(next, replace, callback){
    if (!LoginStore.isAdmin()) {
        replace('/main/home')
    }
    callback()
};

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Router history={history}>
            <Route path="/">
                <Route path="login" component={LoginComposer}/>
                <Route path="main" component={AppComposer} onEnter={validateLogin}>
                    <Route path="home" component={HomeComposer}></Route>
                    <Route path="userQuery" component={UserQueryPage}></Route>
                    <Route path="watchList" component={WatchListComposer}></Route>
                    <Route path="systemLog" component={SystemLogComposer}></Route>
                    <Route path="teamManage" component={TeamManageComposer}  onEnter={validateAdmin}></Route>
                    <Route path="closedCase" component={ClosedCaseComposer}></Route>
                    <Route path="accountInfo" component={AccountInfoComposer}></Route>
                    <Route path="*" >
                        <IndexRedirect to="/main/home"></IndexRedirect>
                    </Route>
                </Route>
                <Route path="" >
                    <IndexRedirect to="/login"></IndexRedirect>
                </Route>
                <Route path="*" >
                    <IndexRedirect to="/login"></IndexRedirect>
                </Route>
            </Route>
        </Router>
    </LocaleProvider>
    ,
    document.getElementById('root')
);
