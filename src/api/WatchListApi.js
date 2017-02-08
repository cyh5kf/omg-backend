import AjaxUtils from '../utils/AjaxUtils';


//添加成员
export const addMonitorUserRequest = function ({monitor_uid,remark}) {
    return AjaxUtils.doPostRequest('/back/watchList/add', {monitor_uid, remark});
};



//获取成员
export const getLoginUserWatchingListRequest = function (isOpen,{limit, offset}) {
    var open = isOpen ? 1 : 0; //open 1表示正在被监控，0代表没有被监控
    return AjaxUtils.doGetRequest(`/back/watchList?open=${open}&limit=${limit}&offset=${offset}`);
};



//停止监控
export const stopMonitorRequest = function ({monitor_uid}) {
    return AjaxUtils.doPostRequest('/back/watchList/stop', {monitor_uid});
};


//获取Admin用户的下级员工
export const getAdminAllOperators = function () {
    return AjaxUtils.doGetRequest(`/back/getAllOperators?active=1&limit=100000`);
};


//批量获取下级员工的监控列表
export const batchGetWatchRecordRequest = function (isOpen,limit,targetOperatorsArray) {
    var open = isOpen ? 1 : 0; //open 1表示正在被监控，0代表没有被监控
    var targetOperators = targetOperatorsArray.join(',');
    targetOperators = encodeURIComponent(targetOperators);
    return AjaxUtils.doGetRequest(`/back/watchList/batchGetWatchRecord?targetOperators=${targetOperators}&limit=${limit}&open=${open}`);
};


//获取下级员工的监控列表
export const targetOperatorRequest = function (isOpen,limit,offset,targetOperator) {
    var open = isOpen ? 1 : 0; //open 1表示正在被监控，0代表没有被监控
    return AjaxUtils.doGetRequest(`/back/watchList/targetOperator?open=${open}&limit=${limit}&offset=${offset}&targetOperator=${targetOperator}`);
};


//获取下级员工的汇聚列表
export const getAssemblyStaffsWatchListRequest = function(limit,offset){
    return AjaxUtils.doGetRequest(`/back/watchList/getOtherStaffsWatchList?limit=${limit}&offset=${offset}`);
};


//https://sss.itsomg.com/api/v1/back/watchList/getOtherStaffsWatchListNotCompound?limit=10&offset=0&status=0


//获取所有下级员工的监控列表,平铺
export const getAllStaffsWatchListRequest = function(isOpen,limit,offset){
    var open = isOpen ? 1 : 0; //open 1表示正在被监控，0代表没有被监控
    return AjaxUtils.doGetRequest(`/back/watchList/getOtherStaffsWatchListNotCompound?status=${open}&limit=${limit}&offset=${offset}`);
};