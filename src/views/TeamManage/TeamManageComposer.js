import React from 'react';
import TeamManageView from './TeamManageView';
import {message} from 'antd';
import {getActiveOperatorsRequest, getInactiveOperatorsRequest, disableAccountRequest, addOperator, modifystaff} from '../../api/TeamManageApi';

export default class TeamManageComposer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inActiveLoading: false,
            activeLoading: false,
            saveLoading: false,
            isOpenAccountDialog: false,
            isAddOrEdit: '',
            activeOperatorList: [],
            disabledOperatorList: [],
            editAccountInfo: {},
            isReset: false,
            activeTotalCount: 0,
            InactiveTotalCount: 0,
            activeCondition:{
                limit: 20,
                offset: 0,
                pageNumber:1
            },
            InactiveCondition:{
                limit: 20,
                offset: 0,
                pageNumber:1
            }
        };
    }

    componentWillMount() {
        var {activeCondition, InactiveCondition} = this.state;
        this.getActiveOperators(activeCondition);
        this.getInactiveOperators(InactiveCondition);
    }

    handleActiveConditon(condition) {
        var activeCondition = this.state.activeCondition;
        activeCondition = Object.assign({}, activeCondition, condition);
        this.setState({activeCondition: activeCondition});
        this.getActiveOperators(activeCondition);
    }

    handleInActiveConditon(condition) {
        var InactiveCondition = this.state.InactiveCondition;
        InactiveCondition = Object.assign({}, InactiveCondition, condition);
        this.setState({InactiveCondition: InactiveCondition});
        this.getInactiveOperators(InactiveCondition);
    }

    //更新激活管理员账户列表
    getActiveOperators(arg) {
        this.setState({activeLoading: true});
        getActiveOperatorsRequest(arg).then(({data})=> {
            if(data.code === 0) {
                var activeOperatorList = data.rows || [];
                var activeTotalCount = data.totalCount;
                this.setState({
                    activeLoading: false,
                    activeOperatorList: activeOperatorList,
                    activeTotalCount: activeTotalCount
                });
            } else {
                this.setState({
                    activeLoading: false
                });
            }

        });
    }

    //更新非激活管理员账户列表
    getInactiveOperators(arg) {
        this.setState({inActiveLoading: true});
        getInactiveOperatorsRequest(arg).then(({data})=> {
            if(data.code === 0) {
                var disabledOperatorList = data.rows || [];
                var InactiveTotalCount = data.totalCount;
                this.setState({
                    inActiveLoading: false,
                    disabledOperatorList: disabledOperatorList,
                    InactiveTotalCount: InactiveTotalCount
                });
            } else {
                this.setState({
                    inActiveLoading: false
                });
            }

        });
    }

    //添加账号
    handleAddAccount =()=> {
        this.setState({
            isOpenAccountDialog: true,
            isAddOrEdit: 'Add'
        });
    };

    //取消添加编辑弹窗
    handleCancelDialog () {
        this.setState({
            isOpenAccountDialog: false,
            isAddOrEdit: '',
            isReset: false,
            editAccountInfo: {}
        });
    }

    //编辑账号
    handleEditAccout = (row)=> {
        this.setState({
            isOpenAccountDialog: true,
            isAddOrEdit: 'Edit',
            editAccountInfo: row
        });
    };

    //禁用账号
    handleDisableAccount(row) {
        this.setState({
            activeLoading: true,
            inActiveLoading: true
        });
        disableAccountRequest(row.operator_id).then(()=> {
            var {activeCondition, InactiveCondition} = this.state;
            this.getActiveOperators(activeCondition);
            this.getInactiveOperators(InactiveCondition);
        });
    }

    //重设密码
    handleResetPassword() {
        this.setState({isReset: true});
    }

    //打开save按钮loading
    openSaveLoading() {
        this.setState({saveLoading:true});
    }

    //提交添加账户
    submitAddAccount(values) {
        var addValues = {
            email: values.email,
            name: values.name,
            phone: values.phoneNumber,
            password: values.password
        };
        addOperator(addValues).then((data)=> {
            var status = data.data.status;
            if(status === 0) { //添加成功
                var {activeCondition} = this.state;
                this.getActiveOperators(activeCondition);
                this.handleCancelDialog();
                message.success('add staff success!');
            } else if(status === 2) { //email不能重复
                message.error('Email address already exists.');
            } else if(status === 4) { //name不能重复
                message.error('The name has already been used. Please try another one.');
            }
            this.setState({saveLoading:false});

        })
    }

    //提交编辑账户
    submitEditAccount(values) {
        var modifyInfo = {};
        modifyInfo.email = values.email;
        modifyInfo.name = values.name;
        modifyInfo.phone = values.phoneNumber;
        modifyInfo.passwd = values.password;

        modifystaff(modifyInfo).then((data)=> {
            var status = data.data.status;
            if(status === 0) { //添加成功
                var {activeOperatorList} = this.state;
                activeOperatorList.forEach((val, index)=> {
                    if(modifyInfo.email === val.email) {
                        activeOperatorList[index] = Object.assign({}, activeOperatorList[index], modifyInfo);
                    }
                });
                this.setState({activeOperatorList: activeOperatorList});
                this.handleCancelDialog();
                message.success('edit staff success!');
            } else if(status === 2) { //name不能重复
                message.error('The name has already been used. Please try another one.');
            }
            this.setState({saveLoading:false});
        })

    }



    render() {
        return (
            <TeamManageView actions={this} store={this.state}/>
        );
    }
}