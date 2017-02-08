import React from 'react';
import {message,Tabs,Card,Select} from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import AddLiUserDialog from './AddLiUserDialog';
import ActionColumnView from './ActionColumnView';
import UserAvatar from '../../compontents/UserAvatar/UserAvatar';
import {getThumbUrl40} from '../../utils/ImageThumbUtils';
import {dateFormat} from '../../utils/DateFormatUtils';
import LoginStore from '../../stores/LoginStore';
import {Link} from 'react-router';
import UserQueryComposer from '../UserQuery/UserQueryComposer';
import MyWatchListView from './MyWatchListView';
import OtherWatchListComposer from './OtherWatchListComposer';
import OtherWatchListTabTitle from './OtherWatchListTabTitle';


export default class WatchListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }



    render(){

        var {config,store,actions} = this.props;

        var is_admin = LoginStore.isAdmin();

        if(!is_admin){
            return (
                <div className="WatchListComposer">
                    <MyWatchListView actions={actions} store={store} />
                </div>
            );
        }


        var otherOperatorList = store.otherOperatorList;
        var otherOperatorListLoading = store.otherOperatorListLoading;

        var currentTabKey = store.currentTabKey;
        var otherWatcherCurId = store.otherWatcherCurId;

        var otherTabTitle = (<OtherWatchListTabTitle config={config}
                                                     actions={actions}
                                                     currentTabKey={currentTabKey}
                                                     otherWatcherCurId={otherWatcherCurId}
                                                     otherOperatorListLoading={otherOperatorListLoading}
                                                     otherOperatorList={otherOperatorList} />);
        return (

            <div className="WatchListComposer">
                <Card>
                    <Tabs defaultActiveKey={"1"} className="WatchListComposerTab" onChange={actions.handleTabsChange}>
                        <TabPane tab={config.myListTitle} key="1">
                            <MyWatchListView actions={actions} store={store} />
                        </TabPane>
                        <TabPane tab={otherTabTitle} key="2">
                            <OtherWatchListComposer config={config}
                                                    actions={actions}
                                                    currentTabKey={currentTabKey}
                                                    otherWatcherCurId={otherWatcherCurId}
                                                    otherOperatorList={otherOperatorList} />
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );

    }


}