import React from 'react';
import {message} from 'antd';
import {modifyStaffRequest,modifyPasswordRequest} from '../../api/LoginApi';
import AccountInfoView from './AccountInfoView';
import LoginStore from '../../stores/LoginStore';

export default class AccountInfoComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: LoginStore.getLoginUserInfo(),
            isOpenDialog_ModifyName: false,
            isOpenDialog_ModifyPassword: false
        };
    }

    //显示/隐藏dialog
    toggleDialog(dialogName,isOpen){
        var state = {};
        state['isOpenDialog_'+dialogName] = isOpen;
        this.setState(state);
    }


    //确认修改name
    handleSubmitModifyName = (values, finished, dialogName)=> {
        var userInfo = LoginStore.getLoginUserInfo();
        modifyStaffRequest({
            email: userInfo.email,
            name: values.name
        }).then(()=> {
            finished();
            this.toggleDialog(dialogName, false);
            this.setState({userInfo: LoginStore.getLoginUserInfo()});
            message.success('modified successfully.');
        },()=>{
            finished();
        });
    };

    //确认修改password
    handleSubmitModifyPassword = (values, finished, dialogName)=> {
        var userInfo = LoginStore.getLoginUserInfo();
        modifyPasswordRequest({
            email: userInfo.email,
            passwd: values.oldPassword,
            changepasswd:values.password
        }).then(()=> {
            finished();
            this.toggleDialog(dialogName, false);
            this.setState({userInfo: LoginStore.getLoginUserInfo()});
            message.success('modified successfully.');
        },({data})=>{
            var {status} = data;
            if(status===207){
                message.error('The old password is wrong.');
            }
            finished();
        });
    };


    render() {
        return (
            <AccountInfoView actions={this} store={this.state}/>
        );
    }

}
