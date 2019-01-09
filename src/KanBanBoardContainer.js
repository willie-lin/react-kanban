import React, { Component } from 'react';
import KanBanBoard from "./KanBanBoard";
import update from 'react-addons-update';
import { throttle} from "./utils";
import 'whatwg-fetch';
import 'babel-polyfill';
import './App.css'


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

    constructor() {
        super(...arguments);
        this.state = {
            cards: [],
        };
        this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
        this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 500);
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

    persistCardDrag (cardId, status){
        let cardIndex = this.state.cards.findIndex((card) => cardId === card.id);
        let card = this.state.cards[cardIndex];

        fetch(`${API_URL}/cards/${cardId}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify({status: card.status, row_order_position: cardIndex})
        })
            .then((response) => {
                if (response.ok){
                    throw new Error("Server response wasn't OK ")
                }
            }).catch((error) => {
                console.error("Fetch error:", error);
                this.setState(
                    update(this.state, {
                        cards: {
                            [cardIndex]: {
                                status: { $set: status }
                            }
                        }
                    })
                );
        });
    }

    addCard(card){

        // let prevstate

        let prevState = this.state;

        if (card.id === null){
            let card = Object.assign({}, card, {id: Date.now()});
        }

        let nextState = update(this.state.cards,{$push: {card}});

        this.setState({cards: nextState});

        fetch(`${API_URL}/cards`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(card)
        }).then((response) => {
            if (response.ok){
                return response.json();
            } else {
                throw new Error("Server response wasn't OK")
            }
        }).then((responseData) => {
            card.id = responseData.id
            this.setState({cards: nextState});
        })
            .catch((error) => {
                this.setState(prevState);
            });
    }


    updateCard(card){

        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((c) => c.id === card.id);

        let nextState = update(this.state.cards, {
            [cardIndex]: {$set: card}
        });

        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${card.id}`, {
            method: 'put',
            headers: API_HEADERS,
            body: JSON.stringify(card)
        }).then((response) => {
            if (!response.ok){
                throw new Error("Server response wasn't OK");
            }
        }).catch((error) =>
        {
            console.error("Fetch Error:", error);
            this.setState(prevState);
        });
    }


//     render() {
//         // return (
//                 let kanbanBoard = this.props.children && React.cloneElement(
//                 this.props.children, {
//
//
//                 // {/*<KanBanBoard cards = { this.state.cards }*/}
//
//                 cards: this.state.cards,
//                 // taskCallbacks={{
//                 taskCallbacks: {
//                     toggle: this.toggleTask.bind(this),
//                 delete: this.deleteTask.bind(this),
//                 add: this.addTask.bind(this)
//             },
//                 // }}
//                 // cardCallbacks={{
//                 cardCallbacks:{
//                     addCard: this.addCard.bind(this),
//                 updateCard: this.updateCard.bind(this),
//                 updateStatus: this.updateCardStatus,
//                 updatePosition: this.updateCardPosition,
//                 persistCardDrag: this.persistCardDrag.bind(this)
//                 // }}
//             }
//
//             });
//                 return kanbanBoard;
//     }
// }
// export default KanBanBoardContainer;

    render() {

        let kanBanBoard = this.props.children && React.cloneElement(this.props.children, {
        // let kanBanBoard = this.props.children && React.cloneElement(this.props.children, {

            cards: this.state.cards,

            taskCallbacks:{

                toggle: this.toggleTask.bind(this),

                delete: this.deleteTask.bind(this),

                add: this.addTask.bind(this)
            },
            cardCallbacks:{

                addCard: this.addCard.bind(this),

                updateCard: this.updateCard.bind(this),

                updateStatus: this.updateCardStatus,

                updatePosition: this.updateCardPosition,

                persistCardDrag: this.persistCardDrag.bind(this)
            }
        });

        return (
            <kanBanBoard />
        )
        // return(
        //     <div>
        //         kanBanBoard
        //     </div>
        // )
    }
}

// export default KanBanBoardContainer;

//     render() {
//         return (
//             <KanBanBoard cards={this.state.cards}
//                          taskCallbacks={{
//                              toggle: this.toggleTask.bind(this),
//                              delete: this.deleteTask.bind(this),
//                              add: this.addTask.bind(this)
//                          }}
//                          cardCallbacks={{
//                              updateStatus: this.updateCardStatus,
//                              updatePosition: this.updateCardPosition,
//                              persistCardDrag: this.persistCardDrag.bind(this)
//                          }}
//             />
//         )
//     }
// }

export default KanBanBoardContainer;
