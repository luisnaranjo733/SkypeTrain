import React, { Component } from 'react';
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';

export default class extends Component {
  render() {
    return (
      <div>
        <h1>Register</h1>
        <Link to="/lab"><RaisedButton label="Default" primary={true}></RaisedButton></Link>
      </div>
    );
  }
}