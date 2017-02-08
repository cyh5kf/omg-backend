import AjaxUtils from '../utils/AjaxUtils';
import LoginStore from '../stores/LoginStore'


//获取激活账户列表
export const getActiveOperatorsRequest = function (arg) {
    var limit = arg.limit || 20,
        offset = arg.offset || 0;
    return AjaxUtils.doGetRequest(`/back/getAllOperators?active=1&limit=${limit}&offset=${offset}`);
};

//获取非激活账户列表
export const getInactiveOperatorsRequest = function (arg) {
    var limit = arg.limit || 20,
        offset = arg.offset || 0;
    return AjaxUtils.doGetRequest(`/back/getAllOperators?active=0&limit=${limit}&offset=${offset}`);
};

//停用账户
export const disableAccountRequest = function (operator_id) {
    return AjaxUtils.doDeleteRequest('/back/disablestaff/'+operator_id);
};

//添加账户
export const addOperator = function (values) {
    return AjaxUtils.doPutRequest('/back/addOperator', values);
};

//编辑账户
export const modifystaff = function (values) {

    return AjaxUtils.doPutRequest('/back/modifystaff', values).then((data)=>{

        var status = data.data.status;
        if (status === 0) { //添加成功
            //如果是当前登录用户,刷新全局LoginStore变量
            if (LoginStore.isEmailEqual(values['email'])) {
                LoginStore.mergeLoginUserInfo({
                    phone: values['phone'],
                    name: values['name']
                })
            }
        }

        //透传,不修改
        return data;
    });
};