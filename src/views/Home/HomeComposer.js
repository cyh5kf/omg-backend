import React from 'react';
import HomeView from './HomeView';
import {homeGetRequest} from '../../api/HomeApi';

export default class HomeComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "peopleInWatch": 0,
            "outGoingMessages": 0,
            "incomingMessages": 0,
            "outgoingCalls": 0,
            "incomingCalls": 0,
            loading: true
        };
    }

    componentDidMount() {
        homeGetRequest().then(({data})=> {
            this.setState(data);
            this.setState({loading: false});
        });
    }

    handleClick = (e)=> {
        //alert('AA');
    };

    render() {
        return (
            <HomeView actions={this} store={this.state}/>
        );
    }

}
