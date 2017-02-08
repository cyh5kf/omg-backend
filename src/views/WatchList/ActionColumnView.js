import React from 'react';


export default class ActionColumnView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClick =()=>{
        var {row,cell,actions} = this.props;
        actions.goToTargetViewRecord(row,cell);
    };

    render () {
        return <div className="linkStyle" onClick={this.handleClick}> View </div>
    }

}