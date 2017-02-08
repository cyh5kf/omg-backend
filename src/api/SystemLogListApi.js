import AjaxUtils from '../utils/AjaxUtils';


//获取系统日志列表
export const getSystemLogListRequest = function (arg) {
    var searchText = arg.searchText || '',
    startTime = arg.startTime || '',
    endTime = arg.endTime || '',
    limit = arg.limit || 20,
    offset = arg.offset || 0;
    return AjaxUtils.doGetRequest('/back/systemlog?searchText='+searchText+'&startTime='+startTime+'&endTime='+endTime+'&limit='+limit+'&offset='+offset);
};