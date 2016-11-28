import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LabPage from './components/LabPage';
import RegisterPage from './components/RegisterPage';
import {AdminPage, EndPage} from './components/AdminPage';

import './index.css';

import firebase from 'firebase';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'


// Initialize Firebase
var config = {
  apiKey: "AIzaSyCCfJuAg5osqGH6d3wH_hNDbKr8lO5OYrc",
  authDomain: "skypetrain-8b369.firebaseapp.com",
  databaseURL: "https://skypetrain-8b369.firebaseio.com",
  storageBucket: "skypetrain-8b369.appspot.com",
  messagingSenderId: "272091294520"
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={RegisterPage}/>
      <Route path="/lab" component={LabPage}/>
      <Route path="/admin" component={AdminPage} />
      <Route path="/end" component={EndPage} />

    </Route>
  </Router>,
  document.getElementById('root')
);