import React from 'react';
import {Table,Button,Spin,Popconfirm,Modal} from 'antd';
import {getAssemblyStaffsWatchListRequest,targetOperatorRequest,getAllStaffsWatchListRequest} from '../../api/WatchListApi';
import UserAvatar from '../../compontents/UserAvatar/UserAvatar';
import {getThumbUrl40} from '../../utils/ImageThumbUtils';
import {dateFormat} from '../../utils/DateFormatUtils';
import WatchListTable from './WatchListTable';
import ActionColumnView from './ActionColumnView';
import LoginStore from '../../stores/LoginStore';
import {Link} from 'react-router';
import './WatchListView.less';


var isShowAssemblyView = false;

export default class OtherWatchListComposer extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            queryCondition_limit: 10,
            queryCondition_offset: 0,
            queryCondition_operatorId: "-1",

            result_tableDataSource: [],
            result_totalCount: 0
        };

        this.isInited = false;

    }


    getEachStaffColumns = (config, actions)=> {
        var isShowEndTimeColumn = config['isShowEndTimeColumn'];

        const columns = [];
        columns.push({
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: function (avatar, {name}) {
                return <UserAvatar avatar={avatar} name={name}/>
            }
        });
        columns.push({
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        });
        columns.push({
            title: 'Phone Number',
            dataIndex: 'monitor_uid',
            key: 'monitor_uid'
        });
        columns.push({
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark'
        });
        columns.push({
            title: 'LI Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: function (cell) {
                if (!cell) {
                    return '';
                }
                var date = new Date(cell);
                return dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
            }
        });

        if (isShowEndTimeColumn) {
            columns.push({
                title: 'LI End Time',
                dataIndex: 'endTime',
                key: 'endTime',
                render: function (cell) {
                    if (!cell) {
                        return '';
                    }
                    var date = new Date(cell);
                    return dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
                }
            });
        }

        columns.push({
            title: 'Watched by',
            dataIndex: 'operatorName',
            key: 'operatorName'
        });

        columns.push({
            title: 'Records',
            dataIndex: 'monitor_uid',
            key: 'Records',
            render: function (cell, row) {
                //var toLink = '/main/userQuery?uid=' + row.monitor_uid;
                //return <Link to={toLink}>View</Link>
                return <ActionColumnView row={row} cell={cell} actions={actions} />
            }
        });

        return columns;
    };


    getAssemblyStaffColumns = (config, actions)=> {
        var that = this;
        const columns = [
            {
                title: 'Avatar',
                dataIndex: 'avatar',
                key: 'avatar',
                render: function (avatar, {name}) {
                    return <UserAvatar avatar={avatar} name={name}/>
                }
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Watched by',
                dataIndex: 'watchedByList',
                key: 'watchedByList'
            },
            {
                title: 'Records',
                dataIndex: 'monitor_uid',
                key: 'Records',
                render: function (cell, row) {
                    //var toLink = '/main/userQuery?uid=' + row.phone;
                    //return <Link to={toLink}>View</Link>
                    return <ActionColumnView row={row} cell={cell} actions={actions} />
                }
            }
        ];

        return columns;
    };


    getPagination = ()=> {

        var that = this;
        var state = this.state;

        var pageSize = state.queryCondition_limit;
        var onChangeQueryCondition = this.onChangeQueryCondition;
        var totalCount = state.result_totalCount;

        const pagination = {
            total: totalCount,
            pageSize: pageSize,
            showSizeChanger: true,
            showTotal: function (total, range) {
                return `${range[0]}-${range[1]} of ${total} items`;
            },
            onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize);
                onChangeQueryCondition({
                    limit: pageSize,
                    offset: (current - 1) * pageSize
                });
            },
            onChange: (current) => {
                var pageSize = that.state.queryCondition_limit;
                console.log('Current: ', current, '; PageSize: ', pageSize);
                onChangeQueryCondition({
                    offset: (current - 1) * pageSize
                });
            }
        };

        return pagination;
    };


    doQuery = (limit, offset, operatorId)=> {

        var callback = (d)=> {
            var data = d.data;
            var {rows,totalCount} = data || {};
            this.setState({
                isLoading: false,
                result_tableDataSource: rows || [],
                result_totalCount: totalCount || 0
            });
        };

        this.setState({
            isLoading: true,
            queryCondition_limit: limit,
            queryCondition_offset: offset,
            queryCondition_operatorId:operatorId
        });

        var config = this.props.config;
        if (operatorId !== "-1") {
            return targetOperatorRequest(config.queryConditionIsOpen, limit, offset, operatorId).then(callback);
        } else {

            if(isShowAssemblyView){
                //查询汇聚的表格
                return getAssemblyStaffsWatchListRequest(limit, offset).then(callback);
            }

            //查询平铺的表格
            return getAllStaffsWatchListRequest(config.queryConditionIsOpen,limit, offset).then(callback);
        }
    };


    onChangeQueryCondition = (params)=> {
        var state = this.state;
        var limit = params.limit || state.queryCondition_limit;
        var offset = params.offset|| state.queryCondition_offset;
        if(params.offset===0){
            offset = 0;
        }
        var operator_id = "" + this.props.otherWatcherCurId;
        this.doQuery(limit, offset, operator_id);
    };

    componentWillReceiveProps(nextProps) {
        var operator_id0 = "" + this.props.otherWatcherCurId;
        var operator_id1 = "" + nextProps.otherWatcherCurId;

        var currentTabKey0 = "" + this.props.currentTabKey;
        var currentTabKey1 = "" + nextProps.currentTabKey;
        console.log(operator_id1,currentTabKey1);

        if(currentTabKey1=='2'){
            if(operator_id0!==operator_id1 || this.isInited === false){
                this.doQuery(10, 0, operator_id1);
                console.log("componentWillReceiveProps"," this.doQuery(10, 0, operator_id1);");
                this.isInited = true;
            }
        }
    }


    componentDidMount() {
        console.log('componentDidMount',this.props);
        var operator_id0 = "" + this.props.otherWatcherCurId;
        this.doQuery(10, 0, operator_id0);
        this.isInited = true;
    }


    render() {

        var otherOperatorList = this.props.otherOperatorList || [];
        var otherWatcherCurId = "" + this.props.otherWatcherCurId;
        var currentTabKey = "" + this.props.currentTabKey;
        var actions = this.props.actions;


        var isLoading = this.state.isLoading;
        var result_tableDataSource = this.state.result_tableDataSource;
        var config = this.props.config;

        var columns;
        if (otherWatcherCurId === "-1") {
            if(isShowAssemblyView){
                columns = this.getAssemblyStaffColumns(config, actions);
            }else {
                columns = this.getEachStaffColumns(config, actions);
            }
        } else {
            columns = this.getEachStaffColumns(config, actions);
        }
        var pagination = this.getPagination();


        return (
            <div className="OtherWatchListView">
                <Spin tip="Loading..." spinning={isLoading}>
                    <Table
                        dataSource={result_tableDataSource}
                        columns={columns}
                        pagination={pagination}/>
                </Spin>
            </div>
        );
    }

}