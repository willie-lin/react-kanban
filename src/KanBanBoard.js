import React, { Component } from 'react';
import { DragDropContext} from "react-dnd";
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import List from './List';
import { Link} from "react-router-dom";
import './App.css'

class KanBanBoard extends Component {




    // render() {
    //
    //     let cardModel = this.props.children && React.cloneElement(
    //         this.props.children, {
    //             cards: this.props.cards,
    //             cardCallbacks: this.props.cardCallbacks
    //         }
    //     )
    //     return (
    //         <div className="app">
    //             <Link to='/new' className="float-button">+</Link>
    //             <List id='todo' title="To Do"
    //                   taskCallbacks={this.props.taskCallbacks }
    //                   cardCallbacks={this.props.cardCallbacks}
    //                   cards={this.props.cards.filter((card) => card.status === "todo")} />
    //             <List id='in-progress' title="In progress"
    //                   taskCallbacks={this.props.taskCallbacks }
    //                   cardCallbacks={this.props.cardCallbacks}
    //                   cards={this.props.cards.filter((card) => card.status === "in-progress")} />
    //             <List id='done' title="Done"
    //                   taskCallbacks={this.props.taskCallbacks}
    //                   cardCallbacks={this.props.cardCallbacks}
    //                   cards={this.props.cards.filter((card) => card.status === "done")} />
    //             {cardModel}
    //         </div>
    //     );
    // }

    render(){
        return (
            <div className="app">
                <List id='todo'
                      title="To Do"
                      cards={this.props.cards.filter((card) => card.status === "todo")}
                      cardCallbacks={this.props.cardCallbacks}
                      taskCallbacks={this.props.taskCallbacks} />
                <List id='in-progress'
                      title="In Progress"
                      cards={this.props.cards.filter((card) => card.status === "in-progress")}
                      cardCallbacks={this.props.cardCallbacks}
                      taskCallbacks={this.props.taskCallbacks} />
                <List id='done'
                      title='Done'
                      cards={this.props.cards.filter((card) => card.status === "done")}
                      cardCallbacks={this.props.cardCallbacks}
                      taskCallbacks={this.props.taskCallbacks} />
            </div>
        );
    }

}
KanBanBoard.propTypea = {
    cards: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object
};

export default DragDropContext(HTML5Backend) (KanBanBoard);
