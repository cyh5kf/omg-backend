import React from 'react';
import {Table,Button,Spin,Popconfirm,Modal,Select,Icon} from 'antd';
const Option = Select.Option;
import AddLiUserDialog from './AddLiUserDialog';
import UserAvatar from '../../compontents/UserAvatar/UserAvatar';
import {getThumbUrl40} from '../../utils/ImageThumbUtils';
import {dateFormat} from '../../utils/DateFormatUtils';
import {Link} from 'react-router';


export default class OtherWatchListTabTitle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    handleSelectChange=(m)=>{
        var {actions} = this.props;
        actions.handleChangeOtherWatcherCurId(m);
    };

    render() {

        var {otherWatcherCurId,config,otherOperatorList,otherOperatorListLoading,currentTabKey} = this.props;

        return (
            <div className="viewEachOtherTabTitle">
                <span className="viewEachOtherTabTitleText">{config["viewEachOtherTabTitle"]}</span>

                {currentTabKey!=="2"?null:(
                    <div className="viewEachOtherTabTitleSelectW">


                        {otherOperatorListLoading?(


                            <Icon type="loading"></Icon>


                        ):(
                            <Select className="viewEachOtherTabTitleSelect" value={""+otherWatcherCurId} style={{ width: 110 }} onChange={this.handleSelectChange}>
                                <Option key="-1" value="-1" className="viewEachOtherTabTitleSelectALL">All</Option>

                                {
                                    otherOperatorList.map(function(d){
                                        var {operator_id,name} = d;
                                        return  (<Option key={""+operator_id} value={""+operator_id}>{name}</Option>);
                                    })
                                }
                            </Select>
                        )}

                    </div>
                )}
            </div>
        );


    };
}