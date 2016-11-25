import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LabPage from './components/LabPage'
import RegisterPage from './components/RegisterPage'
import './index.css';

import { Router, Route, hashHistory, IndexRoute } from 'react-router'

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={RegisterPage}/>
      <Route path="/lab" component={LabPage}/>
    </Route>
  </Router>,
  document.getElementById('root')
);