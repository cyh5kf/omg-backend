import React from 'react';
import UserQueryComposer from '../UserQuery/UserQueryComposer';

export default class UserQueryComposerWrapper extends React.Component {

    render(){

        var {userQueryViewCondition,handleUserQueryGoBack} = this.props;

        if(!userQueryViewCondition || !userQueryViewCondition.monitor_uid){
            return null;
        }

        return (
            <UserQueryComposer uid={userQueryViewCondition.monitor_uid}
                               onBackClick={handleUserQueryGoBack}
                               startTime={userQueryViewCondition.startTime}
                               endTime={userQueryViewCondition.endTime} />
        );

    }


}