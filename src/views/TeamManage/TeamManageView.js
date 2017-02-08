import React from 'react';
import {Table, Spin, Button, Modal, Card} from 'antd';
import './TeamManageView.less';
import AccountDialog from './AccountDialog';

export default class TeamManageView extends React.Component {

    handleConfirmDisableAccount=(row)=> {
        var {actions} = this.props;

        Modal.confirm({
            width:416,
            className:'confirm-dangerous',
            title: null,
            content: 'Are you sure you want to stop this account ?',
            okText: 'Yes',
            cancelText: 'No',
            onOk:function(){
                actions.handleDisableAccount(row);
            },
            onCancel:function(){

            }
        });
    }

    getActiveColumns() {
        const columns = [
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Country Code',
                dataIndex: 'countrycode',
                key: 'countrycode'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Operation',
                key: 'Operation',
                render: (text,row) => {
                    var {actions} = this.props;
                    var that = this;
                    return (
                        <span>
                          <a href="javascript:;" onClick={()=>{actions.handleEditAccout(row)}}>Edit</a>
                          <span className="ant-divider"/>
                          {
                              text.is_admin?
                              <a href="javascript:;" className="disableClick" >Disable Account</a>:
                              <a href="javascript:;" onClick={()=>{that.handleConfirmDisableAccount(row)}}>Disable Account</a>
                          }
                        </span>
                    )
                }
            }
        ];

        return columns;
    }

    getActivePagination = (total)=> {
        var that = this;
        var {actions,store} = this.props;
        var activeCondition = store.activeCondition;
        var pageSize = activeCondition.limit;
        const pagination = {
            total: total,
            pageSize: pageSize,
            current: store.activeCondition.pageNumber,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize);
                actions.handleActiveConditon({
                    limit: pageSize,
                    offset: (current - 1) * pageSize,
                    pageNumber: current
                });
            },
            onChange: (current) => {
                var pageSize = activeCondition.limit;
                console.log('Current: ', current, '; PageSize: ', pageSize);
                actions.handleActiveConditon({
                    offset: (current - 1) * pageSize,
                    pageNumber: current
                });
            }
        };

        return pagination;
    };


    getInActiveColumns() {
        const columns = [
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Country Code',
                dataIndex: 'countrycode',
                key: 'countrycode'
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone'
            }
        ];

        return columns;
    }

    getInActivePagination = (total)=> {
        var that = this;
        var {actions,store} = this.props;
        var InactiveCondition = store.InactiveCondition;
        var pageSize = InactiveCondition.limit;
        const pagination = {
            total: total,
            pageSize: pageSize,
            current: store.InactiveCondition.pageNumber,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize);
                actions.handleInActiveConditon({
                    limit: pageSize,
                    offset: (current - 1) * pageSize,
                    pageNumber: current
                });
            },
            onChange: (current) => {
                var pageSize = InactiveCondition.limit;
                console.log('Current: ', current, '; PageSize: ', pageSize);
                actions.handleInActiveConditon({
                    offset: (current - 1) * pageSize,
                    pageNumber: current
                });
            }
        };

        return pagination;
    };


    render() {
        const {actions, store} = this.props;
        const {activeLoading, inActiveLoading, isOpenAccountDialog, activeTotalCount, InactiveTotalCount} = store;
        const activeDataSource = store.activeOperatorList || [];
        const activeColumns = this.getActiveColumns();
        const activePagination = this.getActivePagination(activeTotalCount);
        const inActiveDataSource = store.disabledOperatorList || [];
        const inActiveColumns = this.getInActiveColumns();
        const inActivePagination = this.getInActivePagination(InactiveTotalCount);

        return (
            <div className="TeamManageView">
                <Spin tip="Loading..." spinning={activeLoading}>
                    <div className="line1">
                        <div className="total floatLeft">In total: {activeTotalCount}</div>
                        <div className="floatRight">
                            <Button type="primary" onClick={actions.handleAddAccount}>Add LI User</Button>
                        </div>
                        <div className="clear"></div>
                    </div>
                    <Card title="Active Account" style={{}}>
                        <Table dataSource={activeDataSource} columns={activeColumns} pagination={activePagination}
                               bordered={false}/>
                    </Card>
                </Spin>
                <div className="clear20"/>
                {
                    inActiveDataSource.length !== 0 && (
                        <Spin tip="Loading..." spinning={inActiveLoading}>
                            <Card title="Inactive Account" style={{}}>
                                <Table dataSource={inActiveDataSource} columns={inActiveColumns} pagination={inActivePagination}
                                       bordered={false}/>
                            </Card>
                        </Spin>
                    )
                }

                {
                    isOpenAccountDialog && (
                            <AccountDialog actions={actions} store={store}/>
                        )
                }

            </div>
        );
    }

}
