import React, { Component } from 'react';
import CheckList from './CheckList';
import marked from 'marked';
import './App.css'

class Card extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showDetails: false
        };
    }
    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails});
    }


    render() {

        let cardDetails;
        if (this.state.showDetails) {
            cardDetails = (
                <div className="card_details">
                    {/*{this.props.description}*/}
                    <span dangerouslySetInnerHTML={{__html: marked(this.props.description) }} />
                    <CheckList cardId={this.props.id} tasks={this.props.tasks}/>
                </div>
            );
        }
        let sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        };
        return (
            <div className="card">
                <div style={sideColor} />

                {/*<div className="card__title" onClick={() => this.setState({showDetails: !this.state.showDetails})}>*/}
                {/*<div className="card__title" onClick={this.toggleDetails.bind(this)}>*/}
                    <div className={this.state.showDetails ? "card__title card__title--is-open" : "card__title"} onClick={this.toggleDetails.bind(this)}>
                        {this.props.title}
                    </div>
                {cardDetails}
            </div>
        );
    }


    // render() {
    //     return (
    //         <div className="card">
    //             <div className="card_title">{this.props.title}</div>
    //             <div className="card_details">
    //                 {this.props.description}
    //                 <CheckList cardId={this.props.id} tasks={this.props.tasks} />
    //             </div>
    //         </div>
    //     );
    // }
}
export default Card;