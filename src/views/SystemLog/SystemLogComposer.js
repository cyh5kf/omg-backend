import React from 'react';
import {getSystemLogListRequest} from '../../api/SystemLogListApi';
import SystemLogView from './SystemLogView';

export default class SystemLogComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            systemLogList: [],
            loading: false,
            resetLoading: false,
            systemLogTotalCount: 0,
            systemLogCondition:{
                limit: 20,
                offset: 0,
                pageNumber:1
            },
        };
    }

    componentWillMount() {
        var systemLogCondition = this.state.systemLogCondition;
        this.getSystemlogList(systemLogCondition);
    }

    handleSystemLogConditon(condition) {
        var systemLogCondition = this.state.systemLogCondition;
        systemLogCondition = Object.assign({}, systemLogCondition, condition);
        this.setState({systemLogCondition: systemLogCondition});
        this.getSystemlogList(systemLogCondition);
    }

    //获取系统日志列表
    getSystemlogList(arg) {
        this.setState({loading: true});
        getSystemLogListRequest(arg).then(({data})=> {
            var systemLogList = data.rows || [];
            var systemLogTotalCount = data.totalCount;
            this.setState({
                systemLogList: systemLogList,
                loading: false,
                resetLoading: false,
                systemLogTotalCount: systemLogTotalCount
            });
        });
    }

    //按起始日期过滤日志
    FilterLogsByDate(filterContent) {
        this.handleSystemLogConditon(filterContent);
    }

    //按日志内容过滤日志
    FilterByLogContent(value) {
        var filterContent = {
            searchText: value,
            limit: 20,
            offset: 0,
            pageNumber:1
        }
        this.handleSystemLogConditon(filterContent);
    }

    //打开resetLoading状态
    openResetLoading() {
        this.setState({resetLoading: true})
    }


    render() {
        return (
            <SystemLogView actions={this} store={this.state}/>
        );
    }

}
