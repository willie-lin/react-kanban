import React, { Component } from 'react';
import KanBanBoard from "./KanBanBoard";
import update from 'react-addons-update';
import 'whatwg-fetch';
import 'babel-polyfill';

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

    addTask(cardId, taskName) {

        //
        let prevState = this.state;

        // find the index of the card
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        // create new task with the given name and a temporary ID
        let newTask = {id: Date.now(), name: taskName, done: false};

        // create a new object and push the new task to the array of  tasks
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$push: [newTask]}
            }
        });
        //  set component state to the mutated object
        this.setState({cards: nextState});
        // call the api to add the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(newTask)
        }).then((response) => {
            if (response.ok) {
                return response.json()
            }else {
                throw new Error("server response wasn't OK")
            }
        }).then((responseData) => {
                newTask.id = responseData.id
                this.setState({cards: nextState})
            }).catch((error) => {
                this.setState(prevState);
        });
    }


    deleteTask(cardId, taskId, taskIndex){

        let prevState = this.state;

        // find the index of the card
        let cardIndex = this.state.cards.findIndex((card) =>card.id === cardId);

        // create a new object without thw task
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex,1]] }
            }
        });

        //  set component state to the mutated object
        this.setState({cards: nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'delete',
            headers: API_HEADERS
        }).then((response) => {
            if (response.ok){
                throw new Error("Server response wasn't OK")
            }
        }).catch((error) => {
            console.error("Fetch error:", error);
            this.setState(prevState);
        });
    }

    toggleTask(cardId, taskId, taskIndex) {

        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        // save a reference to the task's 'done' value
        let newDoneValue;
        // using the $apply command . you will change the down value to its opposite.
        let nextState = update(
            this.state.cards, {
                [cardIndex]: {
                    tasks: {
                        [taskIndex]: {
                            done: { $apply: (done) => {
                                    newDoneValue = !done
                                    return newDoneValue;
                                }
                            }
                        }
                    }
                }
            });
        // set the component state to the mutated object
        this.setState({cards: nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({done: newDoneValue})
        }).then((response) => {
            if (response.ok){
                throw new Error("Server response wasn't OK");
            }
        }).catch((error) => {
            console.error("Fetch errors:", error);
            this.setState(prevState);
        });
    }

    updateCardStatus(cardId, listId){
        let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

        let card = this.state.cards[cardIndex];

        if (card.state !== listId) {
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: { $set: listId}
                    }
                }
            }))
        }
    }


    updateCardPosition(cardId, afterId){

        if (cardId !== afterId){

            let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

            let card = this.state.cards[cardIndex];

            let afterIndex = this.state.cards.findIndex((card) => card.id === afterId);

            this.setState(update(this.state, {
                cards:{
                    $splice: [
                        [cardIndex, 1],
                        [afterIndex, 0, card]
                    ]
                }
            }));
        }
    }
    render() {
        return (
            <div>
                <KanBanBoard cards = { this.state.cards }
                taskCallbacks={{
                    toggle: this.toggleTask.bind(this),
                    delete: this.deleteTask.bind(this),
                    add: this.addTask.bind(this)
                }}
                             cardCallbacks={{
                                 updateStatus: this.updateCardStatus.bind(this),
                                 updatePosition: this.updateCardPosition.bind(this)
                             }}
                />
            </div>
        );
    }
}
export default KanBanBoardContainer;
