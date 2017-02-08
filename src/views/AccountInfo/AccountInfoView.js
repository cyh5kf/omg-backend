import React from 'react';
import {Card,Input} from 'antd';
import ModifyNameDialog from './ModifyNameDialog';
import ModifyPasswordDialog from './ModifyPasswordDialog';
import './AccountInfoView.less';

export default class AccountInfoItem extends React.Component {
    render() {
        var {title,children} = this.props;
        return (
            <div className="AccountInfoItem">
                <div className="title">{title} : </div>
                <div className="content">{children}</div>
            </div>
        );
    }
}



export default class AccountInfoView extends React.Component {

    handleModifyPassword=()=>{
        var {actions} = this.props;
        actions.toggleDialog('ModifyPassword',true);
    };

    handleModifyName=()=>{
        var {actions} = this.props;
        actions.toggleDialog('ModifyName',true);
    };


    render() {
        var {actions,store} = this.props;
        var userInfo = store.userInfo || {};

        return (
            <div className="AccountInfoView">
                <Card>
                    <div className="clear20"></div>


                    <AccountInfoItem title="Email">
                        {userInfo.email}
                    </AccountInfoItem>

                    <AccountInfoItem title="Password">
                        <span className="itemValue">********</span>
                        <a onClick={this.handleModifyPassword}>Modify</a>
                    </AccountInfoItem>

                    <AccountInfoItem title="Name">
                        <span className="itemValue">{userInfo.name}</span>
                        <a onClick={this.handleModifyName}>Modify</a>
                    </AccountInfoItem>

                    <AccountInfoItem title="Phone">
                        <span className="itemValue"> {userInfo.phone? `+${userInfo.phone}`: ''}</span>
                    </AccountInfoItem>

                </Card>


                <ModifyNameDialog name={userInfo.name} actions={actions} visible={store.isOpenDialog_ModifyName}/>
                <ModifyPasswordDialog actions={actions} visible={store.isOpenDialog_ModifyPassword}/>

            </div>
        );
    }
}
