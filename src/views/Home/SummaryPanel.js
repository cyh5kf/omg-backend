import React from 'react';
import './SummaryPanel.less';

export default class SummaryPanel extends React.Component {
    render() {
        var {actions,title,value} = this.props;
        return (
            <div className="SummaryPanel" onClick={actions.handleClick}>
                <div className="number">{value}</div>
                <div className="name">{title}</div>
            </div>
        );
    }
}
