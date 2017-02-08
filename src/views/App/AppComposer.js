import React from 'react';
import AppView from './AppView';
import _ from 'underscore';
import LoginStore from '../../stores/LoginStore';

const menuList = [
    {path: '/main/home', name: 'Home', icon: 'home'},
    {path: '/main/watchList', name: 'Watch List', icon: 'watchlist'},
    {path: '/main/userQuery', name: 'User Query', icon: 'userquery'},
    {path: '/main/closedCase', name: 'Closed Case', icon: 'closedcases'},
    {path: '/main/systemLog', name: 'System Log', icon: 'systemlogs'},
    {path: '/main/teamManage', name: 'Team Management', icon: 'teammanagement'},
    {path: '/main/accountInfo', name: 'Account Information', isMenu: false}
];

const getMenuItem = function (path) {
    var menu = _.find(menuList, function (m) {
        if (m.path === path) {
            return m;
        }
    });
    return menu || {};
};


const getMenuItemByRoute = function (routes) {
    var paths = _.map(routes, function (r) {
        if (r.path === '/') {
            return '';
        }
        return r.path;
    });
    var path = paths.join('/');
    return getMenuItem(path);
};

export default class AppComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSideBarFold: false, //左侧菜单是否折叠
            userInfo: LoginStore.getLoginUserInfo()
        };
    }

    componentWillMount() {
        LoginStore.onChange(this.handleLoginUserInfoChange);
    }

    componentWillUnmount() {
        LoginStore.offChange(this.handleLoginUserInfoChange);
    }

    handleLoginUserInfoChange = ()=> {
        this.setState({userInfo: LoginStore.getLoginUserInfo()});
    };

    handleChangeMenu = (e)=> {
        //nothing
    };

    toggleMenuFold=()=>{
        var isSideBarFold = this.state.isSideBarFold;
        this.setState({isSideBarFold:!isSideBarFold});
    };

    render() {

        var routes = this.props.routes;
        var routeInfo = getMenuItemByRoute(routes);

        var menuList1 = menuList;
        if(!LoginStore.isAdmin()){
            //非管理员,看不到teamManage页面
            menuList1 = _.reject(menuList,function(m){
                return '/main/teamManage'===m.path;
            });
        }

        var store = _.extend({
            menuList: menuList1,
            menuCurrent: routeInfo.path
        },this.state);

        return (
            <AppView actions={this} store={store} routeInfo={routeInfo}>{this.props.children}</AppView>
        );
    }

}
