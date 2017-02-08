import AjaxUtils from '../utils/AjaxUtils';

export function getUserQueryInfo({uid, startTime = null, endTime = null}) {
    return AjaxUtils.doGetRequest(`/back/userQuery?monitor_id=${uid}${startTime ? `&startTime=${startTime}`:''}${endTime ? `&endTime=${endTime}`:''}`);
}

export function getWatchedCallLogs({uid, offset, limit = 10, startTime = null, endTime = null}) {
    return AjaxUtils.doGetRequest(`/back/userQuery/queryCallLogList?monitor_id=${uid}&limit=${limit}&offset=${offset}${startTime ? `&startTime=${startTime}`:''}${endTime ? `&endTime=${endTime}`:''}`);
}

export function getHistoryCallLogs({uid, offset, limit = 10, startTime = null, endTime = null}) {
    return AjaxUtils.doGetRequest(`/back/userQuery/historyCallLog?monitor_id=${uid}&limit=${limit}&offset=${offset}${startTime ? `&startTime=${startTime}`:''}${endTime ? `&endTime=${endTime}`:''}`);
}
