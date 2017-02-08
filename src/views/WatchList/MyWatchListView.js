import React from 'react';
import {Table,Button,Spin,Popconfirm,Modal} from 'antd';
import AddLiUserDialog from './AddLiUserDialog';
import UserAvatar from '../../compontents/UserAvatar/UserAvatar';
import {getThumbUrl40} from '../../utils/ImageThumbUtils';
import {dateFormat} from '../../utils/DateFormatUtils';
import WatchListTable from './WatchListTable';
import {Link} from 'react-router';
import './WatchListView.less';


export default class MyWatchListView extends React.Component {


    handleConfirmReopenLI=(row)=>{
        var {actions} = this.props;
        actions.handleAddLiUser({
            title:"Reopen LI User",
            record:row
        });
    };


    handleConfirmStopLI=(row)=>{
        var {actions} = this.props;

        actions.handleRowFocus(row,true);

        Modal.confirm({
            width:416,
            className:'confirm-dangerous',
            title: null,
            content: 'Are you sure you want to stop the LI to this user ?',
            okText: 'Yes',
            cancelText: 'No',
            onOk:function(){
                actions.handleRowFocus(row,false);
                actions.handleStopLI(row);
            },
            onCancel:function(){
                actions.handleRowFocus(row,false);
            }
        });

    };


    render() {
        var {actions,store} = this.props;

        var dataSource = store.watchingList || [];
        var watchingListTotalCount = store.watchingListTotalCount;
        var watchingListIsLoading = store.watchingListIsLoading;
        var watchingListQueryCondition = store.watchingListQueryCondition;
        var dialogData_AddLiUserDialog = store.dialogData_AddLiUserDialog;
        var config = store.config;

        return (
            <div className="WatchListView">
                <Spin tip="Loading..." spinning={watchingListIsLoading}>
                    <div className="line1">
                        <div className="total floatLeft myListTitle">{config.myListTitle}</div>
                        <div className="floatRight">
                            {config.isShowAddLiUser?(
                                <Button type="primary" onClick={()=>actions.handleAddLiUser({})}>Add LI User</Button>
                            ):null}
                        </div>
                        <div className="clear"></div>
                    </div>

                    <WatchListTable
                        actions={actions}
                        dataSource={dataSource}
                        operation={config.myListOperation}
                        isShowEndTimeColumn={config.isShowEndTimeColumn}
                        totalCount={watchingListTotalCount}
                        queryCondition={watchingListQueryCondition}
                        onChangeQueryCondition={(params)=>{actions.handleWatchingListQueryCondition(params)}}
                        handleStopLi={(params)=>this.handleConfirmStopLI(params)}
                        handleReopenLi={(params)=>this.handleConfirmReopenLI(params)}
                    />

                </Spin>

                <AddLiUserDialog actions={actions} visible={store.isOpenAddLiUserDialog} dialogData={dialogData_AddLiUserDialog} />
            </div>
        );
    }

}
