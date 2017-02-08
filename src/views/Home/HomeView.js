import React from 'react';
import './HomeView.less';
import SummaryPanel from './SummaryPanel';
import {Spin} from 'antd';

export default class HomeView extends React.Component {

    render() {
        var actions = this.props.actions;
        var store = this.props.store;
        var loading = store.loading;
        return (
            <Spin spinning={loading} tip="Loading...">
                <div className="HomeView">
                    <SummaryPanel actions={actions} title="People In Watch List" value={store.peopleInWatch} />
                    <SummaryPanel actions={actions} title="Outgoing Messages" value={store.outGoingMessages} />
                    <SummaryPanel actions={actions} title="Incoming Messages" value={store.incomingMessages} />
                    <SummaryPanel actions={actions} title="Outgoing Calls" value={store.outgoingCalls} />
                    <SummaryPanel actions={actions} title="Incoming Calls" value={store.incomingCalls} />
                    <div className="clear"></div>
                </div>
            </Spin>
        );
    }

}
