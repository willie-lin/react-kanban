import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import KanBanBoard from "./KanBanBoard";



ReactDOM.render(
    <BrowserRouter>
        <Route component={App}>
            <Route path="/" component={KanBanBoard}>
            </Route>
        </Route>
    </BrowserRouter>, document.getElementById('root'));
// ReactDOM.render( <BrowserRouter>
//     {/*<Router>*/}
//     <Route component={KanBanBoardContainer}>
//         <Route path="/" component={KanBanBoard}>
//             <Route path="new" component={NewCard} />
//             <Route path="edit/:card_id" component={EditCard}/>
//
//         </Route>
//         {/*<KanBanBoardContainer />*/}
//
//         {/*<KanbanBoard cards={cardsList} />*/}
//     </Route>
//     {/*</Router>*/}
// </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
