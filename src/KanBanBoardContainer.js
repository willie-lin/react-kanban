import React, { Component } from 'react';
import KanBanBoard from "./KanBanBoard";
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    /*
     * Change the Authorization to any string you like. It can be your pet's name,
     * your middle name, your favorite animal, your superpower of choice...
     * An unique authorization will allow you to have your own environment for cards and tasks
     */
    Authorization: 'CHANGE THIS VALUE'
};



class KanBanBoardContainer extends Component{

    constructor(){
        super(...arguments);
        this.state = {
            cards:[],
        };
    }

    componentDidMount(){
        fetch(API_URL+'/cards', {headers: API_HEADERS})
        //
        // fetch('KanBan.json')
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({cards: responseData});
            })
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            });
    }

    render() {
        return (
            <div>
                <KanBanBoard cards = { this.state.cards } />
            </div>
        );
    }
}
export default KanBanBoardContainer;
