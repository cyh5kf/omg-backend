import React, {PropTypes} from 'react';
import {message as antdMessage} from 'antd';
import uniqueId from 'lodash/uniqueId';
import pick from 'lodash/pick';
import assign from 'lodash/assign';
import UserQueryView from './UserQueryView';
import {getUserQueryInfo, getWatchedCallLogs, getHistoryCallLogs} from '../../api/UserQueryApi';
import LoginStore from '../../stores/LoginStore';

export default class UserQueryComposer extends React.Component {
    static propTypes = {
        uid: PropTypes.number,
        startTime: PropTypes.number,
        endTime: PropTypes.number,
        onBackClick: PropTypes.func,
        standalonePage: PropTypes.bool
    };

    state = {
        sessionList: [],
        monitorTimeInterval: [],
        watchedCallLogs: {
            totalCount: 0,
            pageSize: 10,
            pageNum: 1,
            callLogList: []
        },
        historyCallLogs: {
            totalCount: 0,
            pageSize: 10,
            pageNum: 1,
            callLogList: []
        },
        currentUid: null,
        msgsLoading: false,
        watchedCallsPaging: false,
        historyCallsPaging: false
    };

    refreshUserQueryInfo = (uid) => {
        const refreshWatchedMessagesAndCallLogs = () => {
            const msgsReqid = this._msgsReqid = uniqueId('msgs-request-');
            const {startTime, endTime} = this.props;
            this.setState({msgsLoading: true});
            return getUserQueryInfo({uid, startTime, endTime})
                .then(({data}) => {
                    const setDataEmpty = () => this.setState(state => ({
                        sessionList: [],
                        watchedCallLogs: {
                            ...state.watchedCallLogs,
                            totalCount: 0,
                            callLogList: []
                        }
                    }));
                    if (msgsReqid !== this._msgsReqid) {
                        return;
                    } else if (data.code === 1/*Not omg user*/) {
                        antdMessage.error('The user doesn\'t have a OMG account yet');
                        setDataEmpty();
                    } else if (data.code === 2/*Not same country*/) {
                        antdMessage.error('The user belongs to a different country');
                        setDataEmpty();
                    } else if (data.code === 3/*not watched*/) {
                        // antdMessage.error('There is no LI record for this user yet');
                        setDataEmpty();
                    } else {
                        const callLogInfo = data && data.callLogList || {};
                        this.setState(state => ({
                            monitorTimeInterval: data.monitorTimeInterval || [],
                            sessionList: (data && data.sessionList || []).map(session => ({
                                ...session,
                                chatMessageList: (session.chatMessageList || []).map(message => {
                                    let {messageData} = message;
                                    try {
                                        messageData = messageData && JSON.parse(messageData);
                                    } catch (e) {
                                        // pass
                                    }
                                    return {
                                        ...message,
                                        messageData: messageData
                                    };
                                })
                            })),
                            watchedCallLogs: {
                                ...state.watchedCallLogs,
                                totalCount: callLogInfo && callLogInfo.totalCount || 0,
                                pageNum: 1,
                                callLogList: (callLogInfo && callLogInfo.rows || [])
                            },
                            currentUid: uid
                        }));
                    }
                })
                .finally(() => {
                    if (msgsReqid === this._msgsReqid) {
                        this.setState({msgsLoading: false});
                    }
                });
        };

        return Promise.all([
            refreshWatchedMessagesAndCallLogs(),
            this.onPagingHistoryCalls(1, uid)
        ]);
    };

    onPagingWatchedCalls = (pageNum) => {
        const {currentUid, watchedCallLogs: {pageSize}, startTime, endTime} = this.state;
        const pagingWatchedCallsReqid = this._pagingWatchedCallsReqid = uniqueId('watched-calls-reqid-');
        this.setState(state => ({
            watchedCallLogs: assign({}, state.watchedCallLogs, {
                pageNum: pageNum
            }),
            watchedCallsPaging: true
        }));
        return getWatchedCallLogs({uid: currentUid, offset: pageSize * (pageNum - 1), limit: pageSize, startTime, endTime})
            .then(({data}) => {
                this.setState(state => ({
                    watchedCallLogs: assign({}, state.watchedCallLogs, {
                        totalCount: data.totalCount || 0,
                        callLogList: data.rows || []
                    })
                }));
            })
            .finally(() => {
                if (pagingWatchedCallsReqid === this._pagingWatchedCallsReqid) {
                    this.setState({watchedCallsPaging: false});
                }
            });
    }

    onPagingHistoryCalls = (pageNum, uid = this.state.currentUid) => {
        const {watchedCallLogs: {pageSize}, startTime, endTime} = this.state;
        const pagingHistoryCallsReqid = this._pagingHistoryCallsReqid = uniqueId('history-calls-reqid-');
        this.setState(state => ({
            historyCallLogs: assign({}, state.historyCallLogs, {
                pageNum: pageNum
            }),
            historyCallsPaging: true
        }));
        return getHistoryCallLogs({uid: uid, offset: pageSize * (pageNum - 1), limit: pageSize, startTime, endTime})
            .then(({data}) => {
                if (pagingHistoryCallsReqid === this._pagingHistoryCallsReqid) {
                    this.setState(state => ({
                        historyCallLogs: assign({}, state.historyCallLogs, {
                            totalCount: data.totalCount || 0,
                            callLogList: data.rows || []
                        })
                    }));
                }
            }, () => {
                if (pagingHistoryCallsReqid === this._pagingHistoryCallsReqid) {
                    this.setState(state => ({
                        historyCallLogs: assign({}, state.historyCallLogs, {
                            totalCount: 0,
                            callLogList: []
                        })
                    }));
                }
            })
            .finally(() => {
                if (pagingHistoryCallsReqid === this._pagingHistoryCallsReqid) {
                    this.setState({historyCallsPaging: false});
                }
            });
    }

    onCurrentUidChange = (newUid) => {
        if (newUid) {
            this.refreshUserQueryInfo(newUid);
        }
    };

    componentWillMount() {
        const currentUid = this.props.uid;
        if (currentUid) {
            this.setState({
                currentUid: currentUid
            });
            this.refreshUserQueryInfo(currentUid);
        }
        this.setState({
            loginUser: LoginStore.getLoginUserInfo()
        });
    }

    render() {
        return (
            <UserQueryView 
                refreshUserQueryInfo={this.refreshUserQueryInfo}
                onPagingWatchedCalls={this.onPagingWatchedCalls}
                onPagingHistoryCalls={this.onPagingHistoryCalls}
                onCurrentUidChange={this.onCurrentUidChange}
                {...this.state} {...this.props}/>
        );
    }

}

export class UserQueryPage extends React.Component {
    static propTypes = {
        location: PropTypes.shape({query: PropTypes.object}).isRequired
    };
    render() {
        const currentUidStr = this.props.location.query.uid,
            currentUid = currentUidStr ? parseInt(currentUidStr, 10) : null;
        return <UserQueryComposer uid={currentUid} standalonePage={true}/>;
    }
}
