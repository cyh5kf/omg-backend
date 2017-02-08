import React from 'react';
import {Table,Button,Spin,Popconfirm,Modal} from 'antd';
import AddLiUserDialog from './AddLiUserDialog';
import ActionColumnView from './ActionColumnView';
import UserAvatar from '../../compontents/UserAvatar/UserAvatar';
import {getThumbUrl40} from '../../utils/ImageThumbUtils';
import {dateFormat} from '../../utils/DateFormatUtils';
import {Link} from 'react-router';


export default class WatchListTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    getTableRowClassName = (row)=> {
        if (row._isRowFocus) {
            return "rowFocus";
        }
        return "";
    };


    getColumns = (operation, handleStopLi, handleReopenLi, isShowEndTimeColumn,actions)=> {
        //var that = this;

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
            title: 'Operation',
            dataIndex: 'monitor_uid',
            key: 'Operation',
            render: function (cell, row) {
                if (operation === 'stop') {
                    return ( <Button type="primary" onClick={()=>{handleStopLi(row)}}>Stop LI</Button>);
                }
                if (operation === 'reopen') {
                    var isDisabled = (row['currentStatus']===1);
                    return ( <Button type="primary" disabled={isDisabled} onClick={()=>{handleReopenLi(row)}}>Reopen LI</Button>);
                }
                return '--';
            }
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


    getPagination = ()=> {

        var {dataSource,totalCount,queryCondition,onChangeQueryCondition} = this.props;

        var pageSize = queryCondition.limit;
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
                var pageSize = queryCondition.limit;
                console.log('Current: ', current, '; PageSize: ', pageSize);
                onChangeQueryCondition({
                    offset: (current - 1) * pageSize
                });
            }
        };

        return pagination;
    };

    render() {

        var {dataSource,operation,totalCount,queryCondition,onChangeQueryCondition,isShowEndTimeColumn,handleStopLi,handleReopenLi,actions} = this.props;
        var columns = this.getColumns(operation, handleStopLi, handleReopenLi,isShowEndTimeColumn,actions);
        var pagination = this.getPagination();

        return (
            <div>
                <Table
                    rowClassName={this.getTableRowClassName}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={pagination}/>
            </div>
        );


    };
}