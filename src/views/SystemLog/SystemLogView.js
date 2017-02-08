import React from 'react';
import {Table, Input, DatePicker, Spin, Button} from 'antd';
import {dateFormat} from '../../utils/DateFormatUtils';
import './SystemLogView.less';

const Search = Input.Search;
const { RangePicker } = DatePicker;

export default class SystemLogView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            dateValue: []
        };
    }

    getColumns(){
        const columns = [
            {
                title: 'Log Time',
                dataIndex: 'time',
                key: 'time',
                width:400,
                render:function(cell){
                    if(!cell){
                        return '';
                    }
                    var date = new Date(cell);
                    return dateFormat(date,'yyyy-MM-dd hh:mm:ss');
                }
            },
            // {
            //     title: 'Staff Name',
            //     dataIndex: 'operationName',
            //     key: 'operationName'
            // },
            {
                title: 'Log Events',
                dataIndex: 'event',
                key: 'event'
            }
        ];

        return columns;
    }

    getPagination = (total)=> {
        var that = this;
        var {actions,store} = this.props;
        var systemLogCondition = store.systemLogCondition;
        var pageSize = systemLogCondition.limit;
        const pagination = {
            total: total,
            pageSize: pageSize,
            current: store.systemLogCondition.pageNumber,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize);
                actions.handleSystemLogConditon({
                    limit: pageSize,
                    offset: (current - 1) * pageSize,
                    pageNumber: current
                });
            },
            onChange: (current) => {
                var pageSize = systemLogCondition.limit;
                console.log('Current: ', current, '; PageSize: ', pageSize);
                actions.handleSystemLogConditon({
                    offset: (current - 1) * pageSize,
                    pageNumber: current
                });
            }
        };

        return pagination;
    };

   //选择时间
    onChange(date, dateString) {
        var filterContent = {
            startTime: dateString[0],
            endTime: dateString[1],
            limit: 20,
            offset: 0,
            pageNumber: 1
        };
        this.setState({dateValue: date});
        this.props.actions.handleSystemLogConditon(filterContent);
    }

    //改变搜索框的值
    onSearchChange(e) {
        var value = e.target.value;
        this.setState({searchValue: value});
    }

    //重置过滤条件
    onclickReset() {
        var filterContent = {
            startTime: '',
            endTime: '',
            searchText: '',
            limit: 20,
            offset: 0,
            pageNumber: 1
        };
        var actions = this.props.actions;
        actions.openResetLoading();
        actions.handleSystemLogConditon(filterContent);
        this.setState({
            searchValue: '',
            dateValue: []
        });

    }


    render() {
        var {actions, store} = this.props;
        var dataSource = store.systemLogList || [];
        var systemLogTotalCount = store.systemLogTotalCount;
        var loading = store.loading;
        var resetLoading = store.resetLoading;
        var columns = this.getColumns();
        var pagination = this.getPagination(systemLogTotalCount);

        return (
            <div className="SystemLogView">
                <div className="searchBox">
                    <span>Search:</span>&nbsp;&nbsp;
                    <Search value={this.state.searchValue} onChange={this.onSearchChange.bind(this)} placeholder="Search by log content" onSearch={value => actions.FilterByLogContent(value)} />
                </div>
                <div className="rangePicker">
                    <span>Select Date:</span>&nbsp;&nbsp;
                    <RangePicker value={this.state.dateValue} onChange={this.onChange.bind(this)} />
                </div>
                <Button className="btn_reset" type="primary" loading={resetLoading} onClick={this.onclickReset.bind(this)}>
                Reset
                </Button>
                <div className="line1">
                    <div className="clear"></div>
                </div>
                <Spin spinning={loading} tip="Loading...">
                    <Table dataSource={dataSource} columns={columns} pagination={pagination} />
                </Spin>
            </div>
        );
    }

}
