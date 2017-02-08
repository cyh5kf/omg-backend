import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {dateFormat} from '../../utils/DateFormatUtils';
import UserAvatar from './UserAvatar';
import AudioPlayer from './AudioPlayer';

import './ChatHistoryView.less';

class SessionList extends React.Component {
    static propTypes = {
        sessionList: PropTypes.array.isRequired,
        onSelectedSessionIdChange: PropTypes.func.isRequired,
        selectedSessionId: PropTypes.number
    };
    handleSessionItemClick = e => {
        const sessionId = parseInt(e.currentTarget.dataset.sessionId, 10);
        if (sessionId !== this.props.selectedSessionId) {
            this.props.onSelectedSessionIdChange(sessionId);
        }
    };
    render() {
        const {sessionList, selectedSessionId} = this.props,
            noData = !sessionList || !sessionList.length;
        return (
            <div className={`chat-user-list ${noData ? 'no-data' : ''}`}>
                {sessionList.map(session => {
                    const {sessionId, sessionType} = session;
                    if (sessionType === 0) { // p2p chat
                        return (
                            <div key={sessionId} data-session-id={sessionId} onClick={this.handleSessionItemClick}
                                 className={`session-item ${sessionId === selectedSessionId ? 'selected' : ''}`}>
                                <UserAvatar name={session.sessionName} avatar={session.sessionAvatar}/>
                                <div className="session-info">
                                    <div className="session-name">{session.sessionName}</div>
                                    <div>{sessionId}</div>
                                </div>
                            </div>
                        );
                    } else if (sessionType === 1) { // group chat
                        return (
                            <div key={sessionId} data-session-id={sessionId} onClick={this.handleSessionItemClick}
                                 className={`session-item ${sessionId === selectedSessionId ? 'selected' : ''}`}>
                                <UserAvatar name={session.sessionName} avatar={session.sessionAvatar}/>
                                <div className="session-info">
                                    <div className="session-name">{session.sessionName}</div>
                                    <div>{session.groupMemberCount} Members</div>
                                </div>
                            </div>
                        );
                    }
                })}
                {noData && <div className="no-data-tip">No data</div>}
            </div>
        );
    }
}

class MessageList extends React.Component {
    static propTypes = {
        chatMessageList: PropTypes.array.isRequired,
        currentUid: PropTypes.number
    };
    isSysMsg(messageType) {
        return messageType >= 50 && messageType < 60;
    }
    _getMessageGroups() {
        const MESSAGE_TIME_GROUP_INTERVAL = 10 * 60 * 1000, // 消息合并的时间间隔 (10分钟)
            {chatMessageList} = this.props,
            msgTimeGroups = [];
        let currTimeGrp = null,
            currUserGrp = null;
        chatMessageList.forEach(msg => {
            const timeLine = msg.sendTime,
                handleNewGroupMsg = () => {
                    if (this.isSysMsg(msg.messageType)) {
                        currTimeGrp.msgUserGroups.push({
                            isSysMsg: true,
                            message: msg
                        });
                        currUserGrp = null;
                    } else {
                        currUserGrp = {
                            userFirstMsg: msg,
                            messages: [msg]
                        };
                        currTimeGrp.msgUserGroups.push(currUserGrp);
                    }
                };
            if (currTimeGrp && currTimeGrp.timeLine + MESSAGE_TIME_GROUP_INTERVAL >= timeLine) { // 同一时间分组
                if (!this.isSysMsg(msg.messageType) && currUserGrp && currUserGrp.userFirstMsg.fromUid === msg.fromUid) { // 同一用户分组
                    currUserGrp.messages.push(msg);
                } else { // 不同用户分组
                    handleNewGroupMsg();
                }
            } else { // 不同时间分组
                currTimeGrp = {
                    timeLine: timeLine,
                    msgUserGroups: []
                };
                msgTimeGroups.push(currTimeGrp);
                handleNewGroupMsg();
            }
        });

        return msgTimeGroups;
    }
    renderMessage(message, key) {
        const baseCls = 'message-item',
            {messageData} = message,
            renderWithContent = (extraCls, content) => {
                const msgTimeLabel = dateFormat(new Date(message.sendTime), 'hh:mm');
                return (
                    <div key={key} className={`${baseCls} ${extraCls}`}>
                        {content}
                        <span className="msg-time-status">{msgTimeLabel}</span>
                        {extraCls === 'text-msg' && <span className="msg-time-status time-placeholder">{msgTimeLabel}</span>}
                    </div>
                );
            };
        switch (message.messageType) {
            // [2, 2, 1, 3, 15, 27]
            case 2: // text
            case 25: // group text
                return renderWithContent('text-msg', typeof messageData === 'string' ? messageData : messageData.text);
            case 1: // audio
                return renderWithContent('audio-msg', <AudioPlayer fileurl={messageData.fileurl} playduration={messageData.playduration}/>);
            case 3: // image
                return renderWithContent('img-msg', <img src={messageData.imgurl} height={`${messageData.imgheight}px`}/>);
            case 15: // origin image
                return renderWithContent('img-msg', <img src={messageData.origimgurl} height={`${messageData.imgheight}px`}/>);
            case 27: // location
                return renderWithContent('text-msg', `[Location] ${messageData.poiname}`);
            case 26: { // contact card
                let contactLabel = null;
                try {
                    const {firstName, lastName, middleName, phones} = messageData.contactJson ? JSON.parse(messageData.contactJson) : {},
                        hasValue = val => !!val,
                        contactName = [firstName, middleName, lastName].filter(hasValue).join(' '),
                        contactPhone = phones && phones.length && phones[0].number;
                    contactLabel = [contactName, contactPhone].filter(hasValue).join(', ');
                } catch (e) {
                    // pass
                }
                return renderWithContent('text-msg', `[Contact Card] ${contactLabel}`);
            }
            case 28: // video
                return renderWithContent('video-msg', <video controls src={messageData.videourl}/>);
            case 29: // voip
                return renderWithContent('text-msg', '[Voip Call]');
            case 17: // web page share
                return renderWithContent('text-msg', <span>[Web Clip] <a href={messageData.url}>{messageData.url}</a></span>)
            default:
                return renderWithContent('text-msg', '[Unknown Message]');
        }
    }
    renderSysMsg(message) {
        const {fromName, fromUid, messageData} = message,
            operatorName = fromName || (fromUid && fromUid.toString()),
            getName = user => user.nickName || (user.uid && user.uid.toString());
        switch (message.messageType) {
            case 51: { // group member enter
                const usersAdd = messageData.usersAdd || [];
                if (usersAdd.length === 1 && usersAdd[0].uid === fromUid) {
                    return `${operatorName} joined the group`;
                } else {
                    return `${operatorName} added ${(messageData.usersAdd || []).map(getName).map(n=>`${n}`).join(', ') || 'someone'} to the group`;
                }
            }
            case 52: // group member leave
                return fromUid === (messageData.userLeave && messageData.userLeave.uid) ?
                    `${operatorName} left the group` :
                    `${getName(messageData.userLeave)} has been removed from the group by ${operatorName}`;
            case 53: // group rename
                return `${operatorName} renamed the group to "${messageData.gname}"`;
            case 55: // group leader change
                return `${getName(messageData.leader)} are now an admin`;
            case 56: // group create
                return `${operatorName} created the group`;
            default: return `${operatorName} performed an unknown action` + (__DEV__ ? ` with type ${message.messageType}` : '');
        }
    }
    renderMessageList() {
        const msgTimeGroups = this._getMessageGroups(),
            {currentUid} = this.props,
            content = [];
        msgTimeGroups.forEach(msgTimeGrp => {
            const {timeLine, msgUserGroups} = msgTimeGrp;
            content.push(
                <div key={`tl-${timeLine}`} className="msg-timeline-wrapper">
                    <span className="msg-timeline-label">{dateFormat(new Date(timeLine), 'yyyy-MM-dd hh:mm')}</span>
                </div>
            );
            msgUserGroups.forEach((msgUserGrp, idx) => {
                if (msgUserGrp.isSysMsg) {
                    content.push(
                        <div key={`sys-msg-${msgUserGrp.message.sendTime}-${idx}`} className="system-msg">
                            <span className="system-msg-text">{this.renderSysMsg(msgUserGrp.message)}</span>
                        </div>
                    );
                } else {
                    const {userFirstMsg, messages} = msgUserGrp,
                        isSelf = userFirstMsg.fromUid === currentUid,
                        senderNameLabel = userFirstMsg.fromName || (userFirstMsg.fromUid && userFirstMsg.fromUid.toString());
                    content.push(
                        <div key={`ug-${userFirstMsg.sendTime}-${idx}`}
                                className={`user-msgs-container ${isSelf ? 'own-msgs' : ''}`}>
                            <div className="msg-sender-name">{senderNameLabel}</div>
                            <div className="user-msg-list">
                                {messages.map((msg, idx) => this.renderMessage(msg, `msg-${idx}`))}
                            </div>
                            <UserAvatar className="msg-sender-logo" name={senderNameLabel} avatar={userFirstMsg.fromAvatar}/>
                        </div>
                    );
                }
            });
        });

        return content;
    }
    render() {
        const {chatMessageList} = this.props,
            noData = !chatMessageList || !chatMessageList.length;
        return (
            <div className={`chat-message-list ${noData ? 'no-data' : ''}`}>
                {this.renderMessageList()}
                {noData && <div className="no-data-tip">No data</div>}
            </div>
        );
    }
}

export default class ChatHistoryView extends React.Component {
    static propTypes = {
        sessionList: PropTypes.array.isRequired,
        currentUid: PropTypes.number
    };
    state = {
        selectedSessionId: null
    };

    onSelectedSessionIdChange = (newSelectedId) => {
        this.setState({
            selectedSessionId: newSelectedId
        });
    };

    _updateSelectedSessionId(selectedSessionId, sessionList) {
        let newSelectedId = selectedSessionId;
        if (sessionList.length === 0) {
            newSelectedId = null;
        } else {
            if (!sessionList.find(session => session.sessionId === selectedSessionId)) {
                newSelectedId = sessionList[0].sessionId;
            }
        }

        if (newSelectedId !== selectedSessionId) {
            this.setState({
                selectedSessionId: newSelectedId
            });
        }
    }

    componentWillMount() {
        this._updateSelectedSessionId(this.state.selectedSessionId, this.props.sessionList);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sessionList !== nextProps.sessionList) {
            this._updateSelectedSessionId(this.state.selectedSessionId, nextProps.sessionList);
        }
    }

    render() {
        const {sessionList, currentUid} = this.props,
            {selectedSessionId} = this.state,
            selectedSession = selectedSessionId && sessionList.find(session => session.sessionId === selectedSessionId),
            noData = !sessionList || !sessionList.length;
        return (
            <div className={`chat-history-view ${noData ? 'no-data' : ''}`}>
                {!noData && <SessionList sessionList={sessionList} selectedSessionId={selectedSessionId} onSelectedSessionIdChange={this.onSelectedSessionIdChange}/>}
                {!noData && <MessageList chatMessageList={selectedSession && selectedSession.chatMessageList || []} currentUid={currentUid}/>}
                {noData && 'No data'}
            </div>
        );
    }
}
