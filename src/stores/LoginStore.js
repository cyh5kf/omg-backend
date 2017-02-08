import {EventBus} from '../utils/EventBus';

const LOCAL_STORAGE_KEY = 'loginUserInfo';
const EVENVT_LoginStore_onChange = "LoginStore_onChange";
/**
 * 登录用户的信息,是全局性信息.单独存储.
 * 界面各自的数据,直接使用State存储
 */
class LoginStore {

    constructor(props) {
        var json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if(json) {
            this.loginUserInfo = JSON.parse(json);
        }else {
            this.loginUserInfo = null;
        }
    }

    getLoginUserInfo(){
        return this.loginUserInfo;
    }

    isAdmin(){
        var loginUserInfo = this.loginUserInfo || {};
        return !!loginUserInfo.is_admin;
    }

    isEmailEqual(email){
        var loginUserInfo = this.loginUserInfo || {};
        return loginUserInfo['email']===email;
    }

    setLoginUserInfo(loginUserInfo) {
        var json = JSON.stringify(loginUserInfo);
        localStorage.setItem(LOCAL_STORAGE_KEY, json);
        this.loginUserInfo = loginUserInfo;
        EventBus.emit(EVENVT_LoginStore_onChange, loginUserInfo);
    }

    mergeLoginUserInfo(changeInfo) {
        var oldInfo = this.getLoginUserInfo() || {};
        var mergeInfo = Object.assign({}, oldInfo, changeInfo);
        this.setLoginUserInfo(mergeInfo);
    }


    onChange(callback) {
        EventBus.on(EVENVT_LoginStore_onChange, callback);
    }

    offChange(callback) {
        EventBus.off(EVENVT_LoginStore_onChange, callback);
    }

}

export default new LoginStore();