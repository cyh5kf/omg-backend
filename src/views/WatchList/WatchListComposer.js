import React from 'react';
import {message,Tabs,Card,Select} from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import _ from 'underscore';
import LoginStore from '../../stores/LoginStore';
import {showStyle,hideStyle} from '../../utils/JSXRenderUtils';
import {stopMonitorRequest,getLoginUserWatchingListRequest,getAdminAllOperators,addMonitorUserRequest} from '../../api/WatchListApi';
import MyWatchListView from './MyWatchListView';
import OtherWatchListComposer from './OtherWatchListComposer';
import OtherWatchListTabTitle from './OtherWatchListTabTitle';
import WatchListView from './WatchListView';
import UserQueryComposerWrapper from './UserQueryComposerWrapper';


function getWatchListComposerConfig() {
    return {
        queryConditionIsOpen: true,
        isShowAddLiUser: true,
        isShowAssemblyTable:true,
        isShowEndTimeColumn:false,
        myListTitle: "My Watch List",
        myListOperation: "stop",
        viewEachOtherOperatorBtn: "View Each Staff's Watch List",
        viewEachOtherTabTitle :"Other Staff's Watch List"
    };
}

export default class WatchListComposer extends React.Component {

    constructor(props) {
        super(props);
        props = props || {};
        var config = getWatchListComposerConfig();
        config = _.extend(config, props.config);
        this.state = {
            config: config,
            loginUser: LoginStore.getLoginUserInfo(),
            isOpenAddLiUserDialog: false,
            dialogData_AddLiUserDialog: null,

            //都是My Watch List 的属性
            watchingListQueryCondition: {
                limit: 10,
                offset: 0
            },
            watchingListIsLoading: false,
            watchingListTotalCount: 0,
            watchingList: [],  //表格列表数据


            currentTabKey: "1",

            //Other Staff
            otherOperatorList: [],

            otherOperatorListLoading: false,

            //Other Staff Current Id
            otherWatcherCurId: "-1", // -1表示所有

            //当前浏览的被监听用户的记录
            userQueryViewCondition: null,
            isShowUserQueryView: false
        };

    }

    componentDidMount() {

        this.getLoginUserWatchingList(this.state.watchingListQueryCondition);

        if (LoginStore.isAdmin()) {
            var loginInfo = LoginStore.getLoginUserInfo();
            this.setState({otherOperatorListLoading: true});
            getAdminAllOperators().then(({data})=> {

                var activeOperatorList = data.rows || [];
                activeOperatorList = _.reject(activeOperatorList, function (m) {
                    //过滤掉当前用户
                    return m['operator_id'] === loginInfo['operator_id'];
                });

                this.setState({otherOperatorList: activeOperatorList,otherOperatorListLoading:false});
            },()=>{
                this.setState({otherOperatorList: [],otherOperatorListLoading:false});
            });
        }
    }

    handleWatchingListQueryCondition(condition) {
        var watchingListQueryCondition = this.state.watchingListQueryCondition;
        watchingListQueryCondition = Object.assign({}, watchingListQueryCondition, condition);
        this.setState({watchingListQueryCondition: watchingListQueryCondition});
        this.getLoginUserWatchingList(watchingListQueryCondition);
    }


    setWatchingListState(data) {

        data = data || {};

        var {rows,totalCount} = data;

        var watchingList = rows || [];

        for (var i = 0; i < watchingList.length; i++) {
            var w = watchingList[i];
            w._rowId = w.id || _.uniqueId();
        }

        this.setState({
            watchingList: watchingList,
            watchingListTotalCount: totalCount,
            watchingListIsLoading: false
        });
    }

    //获取列表
    getLoginUserWatchingList({limit,offset}) {
        this.setState({watchingListIsLoading: true});
        var config = this.state.config;
        return getLoginUserWatchingListRequest(config.queryConditionIsOpen, {limit, offset}).then(({data})=> {
            this.setWatchingListState(data);
        });
    }


    //添加用户
    handleAddLiUser = (dialogData)=> {
        this.setState({isOpenAddLiUserDialog: true,dialogData_AddLiUserDialog:dialogData});
    };


    //取消添加
    handleCancelLiUser = ()=> {
        this.setState({isOpenAddLiUserDialog: false,dialogData_AddLiUserDialog:null});
    };


    //确认添加
    handleSubmitLiUser = (values, finished)=> {
        var {phoneNumber,remark} = values;
        var that = this;
        addMonitorUserRequest({monitor_uid: phoneNumber, remark}).then(({data})=> {
            data = data || {};

            if (data.code === 1) {
                message.error("The user doesn't have a OMG account yet.");
                finished();
                return;
            }


            if (data.code === 2) {
                message.error("The country code is incorrect");
                finished();
                return;
            }

            if (data.code === 3) {
                message.error("The user has already been in your watch list.");
                finished();
                return;
            }


            this.getLoginUserWatchingList(that.state.watchingListQueryCondition).then(function () {
                finished();
                that.setState({isOpenAddLiUserDialog: false,dialogData_AddLiUserDialog:null});
            });


        });
    };


    //停止监控
    handleStopLI = (row)=> {
        this.setState({watchingListIsLoading: true});
        var monitor_uid = row.monitor_uid;
        stopMonitorRequest({monitor_uid: monitor_uid}).then(({data})=> {
            data  = data || {};
            if (data.status === 0) {
                this.getLoginUserWatchingList(this.state.watchingListQueryCondition);
            } else {
                message.error("Failed to stop the LI ");
            }
        });
    };

    handleRowFocus = (row, isFocus)=> {
        var watchingList = [].concat(this.state.watchingList);

        for (var i = 0; i < watchingList.length; i++) {
            var w = watchingList[i];
            if (w._rowId === row._rowId) {
                var w1 = Object.assign({}, w);
                w1._isRowFocus = isFocus;
                watchingList[i] = w1;
            }
        }

        this.setState({watchingList: watchingList});
    };


    handleTabsChange =(args)=>{
        //console.log("handleTabsChange",args);
        this.setState({currentTabKey:args});
    };

    handleChangeOtherWatcherCurId=(m)=>{
        this.setState({otherWatcherCurId:m});
    };


    //查看指定人员的记录
    goToTargetViewRecord = (row,cell)=>{
        this.setState({
            userQueryViewCondition:row,
            isShowUserQueryView:true
        });
    };


    handleUserQueryGoBack=()=>{
        this.setState({
            userQueryViewCondition:null,
            isShowUserQueryView:false
        });
    };

    render() {

        var {isShowUserQueryView,userQueryViewCondition,config} = this.state;


        return (
            <div className="WatchListComposerWrapper">

                <div className="UserQueryComposerWrapper" style={showStyle(isShowUserQueryView)} >

                    <UserQueryComposerWrapper
                        handleUserQueryGoBack={this.handleUserQueryGoBack}
                        userQueryViewCondition={userQueryViewCondition} />

                </div>

                <div className="WatchListViewWrapper"style={showStyle(!isShowUserQueryView)} >
                    <WatchListView actions={this} store={this.state} config={config}></WatchListView>
                </div>

            </div>
        );
    }

}
