import React, { PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import sortBy from 'lodash/sortBy';
import first from 'lodash/first';
import last from 'lodash/last';
import {Tooltip, Form, Select, Option, Input, Icon, Card, Spin, Pagination} from 'antd';
import {dateFormat} from '../../utils/DateFormatUtils';
import ChatHistoryView from './ChatHistoryView';
import CallHistoryView from './CallHistoryView';

import './UserQueryView.less';

const FormItem = Form.Item;
const CallLogInfoType = PropTypes.shape({
    totalCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageNum: PropTypes.number.isRequired,
    callLogList: PropTypes.array.isRequired
});

class TimeRange extends React.Component {
    static propTypes = {
        timeRanges: PropTypes.arrayOf(PropTypes.shape({
            startTime: PropTypes.number.isRequired,
            endTime: PropTypes.number
        })).isRequired
    }
    normalizeTimeRanges(timeRanges) {
        timeRanges = timeRanges.map(range => {
            return {
                startTime: range.startTime || 0,
                endTime: range.endTime || Date.now(),
                notEnd: !range.endTime,
            };
        }).filter(range => range.startTime < range.endTime);
        timeRanges = sortBy(timeRanges, 'startTime');
        let lastRange = null;
        timeRanges = timeRanges.reduce((newRanges, range) => {
            if (lastRange && lastRange.endTime >= range.startTime) {
                if (lastRange.endTime < range.endTime) {
                    lastRange.endTime = range.endTime;
                    if (range.notEnd) {
                        lastRange.notEnd = true;
                    }
                }
            } else {
                lastRange = range;
                newRanges.push(lastRange);
            }
            return newRanges;
        }, []);
        return timeRanges;
    }
    getRenderBlocks(normalizedRanges) {
        const MIN_BLOCK_WIDTH = 8;
        const firstTime = first(normalizedRanges) && first(normalizedRanges).startTime || 0,
            lastTime = last(normalizedRanges) && last(normalizedRanges).endTime || Date.now(),
            totalDuration = lastTime - firstTime,
            getTooltip = (startTime, endTime) => {
                return dateFormat(new Date(startTime), 'yyyy-MM-dd hh:mm:ss')
                    + ' - '
                    + (endTime ? dateFormat(new Date(endTime), 'yyyy-MM-dd hh:mm:ss') : 'Now');
            };
        let lastRange = null;
        return normalizedRanges.reduce((blocks, range) => {
            if (lastRange) {
                blocks.push({
                    fill: false,
                    percent: (range.startTime - lastRange.endTime) / totalDuration,
                    tooltip: null
                });
            }
            blocks.push({
                fill: true,
                percent: (range.endTime - range.startTime) / totalDuration,
                tooltip: getTooltip(range.startTime, range.notEnd ? null : range.endTime)
            });
            lastRange = range;
            return blocks;
        }, []);
    }
    render() {
        let {timeRanges} = this.props;
        timeRanges = this.normalizeTimeRanges(timeRanges);
        return (
            <div className="time-ranges">
                {this.getRenderBlocks(timeRanges).map((block, idx) => {
                    return (
                        <Tooltip title={block.tooltip} placement="bottom">
                            <div className={`time-range-block ${block.fill ? 'fill-block' : 'blank-block'}`} style={{width: `${block.percent * 100}%`}}></div>
                        </Tooltip>
                    );
                })}
            </div>
        );
    }
}

export default class UserQueryView extends React.Component {
    static propTypes = {
        startTime: PropTypes.number,
        endTime: PropTypes.number,
        onBackClick: PropTypes.func,
        standalonePage: PropTypes.bool,
        loginUser: PropTypes.object.isRequired,
        currentUid: PropTypes.number,
        monitorTimeInterval: PropTypes.array.isRequired,
        sessionList: PropTypes.array.isRequired,
        watchedCallLogs: CallLogInfoType.isRequired,
        msgsLoading: PropTypes.bool.isRequired,
        onCurrentUidChange: PropTypes.func.isRequired
    };

    state = {
        searchPhoneInput: null
    };

    handleUidInputChange = e => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) {
            this.setState({
                searchPhoneInput: value
            });
        }
    };

    handleUidInputKeyDown = e => {
        if (e.keyCode === 13/*Enter*/ && this.state.searchPhoneInput) {
            this.props.onCurrentUidChange(parseInt(`${this.props.loginUser.countrycode}${this.state.searchPhoneInput}`, 10));
        }
    };

    handleSearchClick = () => {
        if (this.state.searchPhoneInput) {
            this.props.onCurrentUidChange(parseInt(`${this.props.loginUser.countrycode}${this.state.searchPhoneInput}`, 10));
        }
    };

    componentWillMount() {
        const {loginUser: {countrycode}, currentUid} = this.props;
        this.setState({
            searchPhoneInput: currentUid && currentUid.toString().replace(new RegExp(`^${countrycode}`), '')
        });
    }

    render() {
        const {
            loginUser: {countrycode}, sessionList, currentUid, msgsLoading, watchedCallsPaging, historyCallsPaging, watchedCallLogs, historyCallLogs,
            onPagingWatchedCalls, onPagingHistoryCalls, standalonePage, onBackClick, monitorTimeInterval, startTime, endTime
        } = this.props;
        return (
            <div className="UserQueryView">
                {standalonePage ? (
                    <FormItem className="li-number-label" label="LI User Number" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                        <Input ref="uid-input" addonBefore={`+${countrycode}`} addonAfter={<Icon type="search" onClick={this.handleSearchClick}/>}
                            placeholder="Please enter LI User Number"
                            value={this.state.searchPhoneInput} onChange={this.handleUidInputChange} onKeyDown={this.handleUidInputKeyDown}/>
                    </FormItem>
                ) : (
                    <div className="li-number-label-fixed">
                        <div className="back-btn" onClick={onBackClick}><Icon type="left"/>Back</div>
                        Record Details: +{countrycode}{this.state.searchPhoneInput}
                    </div>
                )}
                {!!monitorTimeInterval.length && <TimeRange timeRanges={startTime ? [{startTime, endTime}] : monitorTimeInterval}/>}
                {!!monitorTimeInterval.length && <div className="time-ranges-guide">Note: Green indicates the interval period the user is monitored.</div>}
                <Spin className="user-query-page-loading" spinning={msgsLoading} tip="Loading...">
                    <Card title="LI Chat Records">
                        <ChatHistoryView sessionList={sessionList} currentUid={currentUid}/>
                    </Card>

                    <div className="clear20"></div>

                    <Spin spinning={!msgsLoading && watchedCallsPaging} tip="Loading...">
                        <Card title="LI Call Records">
                            <CallHistoryView callLogList={watchedCallLogs.callLogList} currentUid={currentUid}/>
                            {watchedCallLogs.totalCount > 0 && <Pagination current={watchedCallLogs.pageNum} total={watchedCallLogs.totalCount} pageSize={watchedCallLogs.pageSize} onChange={onPagingWatchedCalls}/>}
                        </Card>
                    </Spin>

                    <div className="clear20"></div>

                    <Spin spinning={!msgsLoading && historyCallsPaging} tip="Loading...">
                        <Card title="All Call History">
                            <CallHistoryView callLogList={historyCallLogs.callLogList} currentUid={currentUid} showCallDetails={false}/>
                            {historyCallLogs.totalCount > 0 && <Pagination current={historyCallLogs.pageNum} total={historyCallLogs.totalCount} pageSize={historyCallLogs.pageSize} onChange={onPagingHistoryCalls}/>}
                        </Card>
                    </Spin>
                </Spin>
                
            </div>
        );
    }

}
