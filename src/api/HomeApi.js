import AjaxUtils from '../utils/AjaxUtils';


//获取数据
export const homeGetRequest = function () {
    return AjaxUtils.doGetRequest('/back/home');
};