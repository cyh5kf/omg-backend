import React from 'react';
import {Icon} from 'antd';

export default class AppBreadcrumbView extends React.Component {


    render() {
        var routeInfo = this.props.routeInfo || {};
        var actions = this.props.actions;
        var store = this.props.store;
        var isSideBarFold = store.isSideBarFold;
        return (
            <div className="ant-breadcrumb">
                <div className="header-menu-fold" onClick={actions.toggleMenuFold}>
                    {isSideBarFold?<Icon type="menu-unfold" title="unfold"/>:<Icon type="menu-fold" title="fold"/> }
                </div>
                <div className="item">
                    {routeInfo.name}
                </div>
            </div>
        );
    }

}
