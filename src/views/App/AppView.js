import React from 'react';
import AppHeaderView from './AppHeaderView';
import AppSidebarView from './AppSidebarView';
import AppBreadcrumbView from './AppBreadcrumbView';
import './AppView.less';

export default class AppView extends React.Component {


    render() {
        var actions = this.props.actions;
        var store = this.props.store;
        var routeInfo = this.props.routeInfo;
        var clientHeight = document.body.clientHeight;
        return (
            <div className="AppView">
                <AppHeaderView actions={actions} store={store}/>
                <div className="ant-layout-body">
                    <AppSidebarView actions={actions} store={store} />
                    <div className="ant-layout-main">
                        {/*<AppBreadcrumbView actions={actions} store={store} routeInfo={routeInfo} />*/}
                        <div className="ant-layout-content">
                            {this.props.children}
                            <div className="clear20"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
