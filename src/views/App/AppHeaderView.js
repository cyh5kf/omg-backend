import React from 'react';
import {Icon,Modal} from 'antd';
import {Link} from 'react-router';
const confirm = Modal.confirm;
import {logoutRequest} from '../../api/LoginApi'
import './AppHeaderView.less';

export default class AppHeaderView extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    handleLogout = ()=> {
        var router = this.context.router;

        Modal.confirm({
            width:416,
            className:'confirm-dangerous',
            title: null,
            content: 'Are you sure you want to log out of the system?',
            okText: 'Yes',
            cancelText: 'No',
            onOk:function(){
                logoutRequest();
                router.push('/login');
            }
        });

    };

    render() {
        var actions = this.props.actions;
        var store = this.props.store;
        var userInfo = store.userInfo;


        return (
            <div className='ant-layout-header'>
                <div className="header-left floatLeft">

                    <div className="header-name">Internal Data Analysis System</div>
                </div>
                <div className="header-right">
                    <Link className="link-userName" to="/main/accountInfo">
                        <i className="ic-person"></i>
                        <span className="userName">
                            {userInfo ? (userInfo.name||userInfo.email) : 'Not logged in'}
                        </span>
                    </Link>
                    <div className="logout" onClick={this.handleLogout}>
                        <i className="ic_logout"></i>
                        <span className="logout-text">Logout</span>
                    </div>
                </div>
            </div>
        );
    }

}
