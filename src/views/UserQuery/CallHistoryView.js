import React, {PropTypes} from 'react';
import {Row, Col, Icon} from 'antd';
import padStart from 'lodash/padStart';
import {dateFormat} from '../../utils/DateFormatUtils';
import UserAvatar from './UserAvatar';
import AudioPlayer from './AudioPlayer';

import './CallHistoryView.less';

const VOIP_TYPE_VOICE = 0;

export default class CallHistoryView extends React.Component {
    static propTypes = {
        callLogList: PropTypes.array.isRequired,
        currentUid: PropTypes.number,
        showCallDetails: PropTypes.bool
    };
    static defaultProps = {
        showCallDetails: true
    };
    render() {
        const {callLogList, currentUid, showCallDetails} = this.props,
            now = Date.now(),
            renderCallLogResouce = callLog => {
                if (showCallDetails && callLog.playUrl) {
                    return <AudioPlayer fileurl={callLog.playUrl} playduration={callLog.duration * 1000}/>;
                } else if (!showCallDetails && callLog.duration) {
                    const durationText = `${Math.floor(callLog.duration / 60)}:${padStart(callLog.duration % 60, 2, '0')}`;
                    return <span className="audio-player-placeholder text-right">{durationText}</span>;
                } else {
                    let showNotConnected = false;
                    switch (callLog.status) {
                        case 1:
                        case 2:
                        case 6:
                            // 最终状态，直接显示为未连接
                            showNotConnected = true;
                            break;
                        case 0:
                        case 3:
                        case 5:
                            // 中间状态，可能由于异常无法跳转到最终状态，延迟5分钟显示
                            showNotConnected = !callLog.beginTime || (now - callLog.beginTime) > 5*60*1000;
                            break;
                        case 4: // 接通中
                            // 忽略接通中状态（即使异常中断，最终也会有资源上传）
                            break;
                    }
                    return showNotConnected ? <span className="audio-player-placeholder text-right">Not Connected</span> : null;
                }
            };
        return (
            <div className="call-history-view">
                {callLogList.map((callLog, idx) => {
                    const isCallOut = callLog.fromUid === currentUid,
                        otherUid = isCallOut ? callLog.toUid : callLog.fromUid,
                        otherName = isCallOut ? callLog.toName : callLog.fromName,
                        otherAvatar = isCallOut ? callLog.toAvatar : callLog.fromAvatar,
                        resourceDisplay = renderCallLogResouce(callLog);
                    if (!resourceDisplay) {
                        return null;
                    } else {
                        return (
                            <Row key={idx} className="call-history-item">
                                <span className="call-timestamp">{dateFormat(new Date(callLog.beginTime), 'yyyy-MM-dd hh:mm')}</span>
                                <Icon className={`call-dir-icon ${isCallOut ? 'call-out' : 'call-in'}`} type="arrow-left"/>
                                <span>{callLog.voipType === VOIP_TYPE_VOICE ? 'Voice Call' : 'Video Call'}</span>
                                <div className="user-item">
                                    <UserAvatar name={otherName || otherUid.toString()} avatar={otherAvatar}/>
                                    <div className="chat-user-info">
                                        <div>{otherName}</div>
                                        <div>{otherUid}</div>
                                    </div>
                                </div>
                                {resourceDisplay}
                            </Row>
                        );
                    }
                })}
                {(!callLogList || !callLogList.length) && <div className="no-data-tip">No data</div>}
            </div>
        );
    }
}
