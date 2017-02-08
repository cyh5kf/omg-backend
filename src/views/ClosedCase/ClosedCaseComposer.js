import React from 'react';
import WatchListComposer from '../WatchList/WatchListComposer';

export default class ClosedCaseComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    getWatchListComposerConfig() {

        return {
            queryConditionIsOpen: false,
            isShowAddLiUser: false,
            isShowAssemblyTable:false,
            isShowEndTimeColumn:true,
            myListTitle: "My Closed Case",
            myListOperation: "reopen",
            viewEachOtherOperatorBtn:"View Each Staff's Closed Cases",
            viewEachOtherTabTitle:"Other Staff's Closed Cases"
        };

    }


    render() {
        var config = this.getWatchListComposerConfig();
        return (
            <WatchListComposer config={config}/>
        );
    }

}
