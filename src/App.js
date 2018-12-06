import React, { Component } from 'react';
import './App.css'
// import KanbanBoard from "./KanbanBoard";
import KanBanBoardContainer from './KanBanBoardContainer';

// let cardsList = [
//     {
//         id: 1,
//         title: "Read the Book",
//         description: "I should read the **whole** book",
//         color: '#bdbc42',
//         status: "in-progress",
//         tasks: []
//     }, {
//         id: 2,
//         title: "Writer some code",
//         description: "Code along with the samples in the  book . the complete source can be found at [github]( https://github.com/Willie-lin)",
//         // color: '#38BbBD',
//         color: '#3A7E28',
//         status: "todo",
//         tasks: [
//             {
//                 id: 1,
//                 name: "ContactList Example",
//                 done: true
//             }, {
//                 id: 2,
//                 name: "KanBan Example",
//                 done: false
//             }, {
//                 id: 3,
//                 name: "My own Example",
//                 done: false
//             }
//         ]
//     },
//     // }, {
//     //     id: 1,
//     //     title: "Read the Book",
//     //     description: "I should read the whole book",
//     //     status: "in-progress",
//     //     tasks: []
//     // }, {
//     //     id: 1,
//     //     title: "Read the Book",
//     //     description: "I should read the whole book",
//     //     status: "in-progress",
//     //     tasks: []
//     // },
// ];
class App extends Component {



    render() {
        return (
            <div>
                <KanBanBoardContainer />
                {/*<KanbanBoard cards={cardsList} />*/}
            </div>
        );
    }
}

export default App;

