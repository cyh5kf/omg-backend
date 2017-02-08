import React, { PropTypes } from 'react';

export default class UserAvatar extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string,
        avatar: PropTypes.string
    }

    render() {
        const {className, name, avatar} = this.props;
        return <div className={`user-avatar ${className || ''}`} style={avatar ? {backgroundImage: `url(${avatar})`} : null}>{!avatar ? name && name[0] : ''}</div>;
    }
}