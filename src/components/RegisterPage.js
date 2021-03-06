import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';  

import firebase from 'firebase';

export default class RegisterPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.context = context;

    this.state = {
      formValid: false,
      participantName: ''
    };
  }

  componentDidMount() {
    // firebase.database().ref('participants').on('value', (snapshot) => {
    //   // console.log(snapshot.val());
    // });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('participants').off();
  }

  validateForm = (e) => {
    this.setState({
      formValid: e.target.value !== "",
      participantName: e.target.value,
    });
  }

  submitButtonPressed = () => {
    if (this.state.formValid) {
      let newParticipantRef = firebase.database().ref('participants').push();
      newParticipantRef.set({
        name: this.state.participantName
      });
      firebase.database().ref('events').push({
        participantKey: newParticipantRef.key,
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'startLab',
        labVariant: this.props.state.labVariant
      })
      this.context.router.push('/lab');
    }
  }  

  render() {
    return (
      <div>
        <Card>
          <CardTitle title="Introduction" subtitle="Typing Lab" />

          <TextField
            style={{paddingLeft: '1em'}}
            hintText="Full name"
            floatingLabelText="Participant name"
            floatingLabelFixed={false}
            errorText={this.state.formValid ? '' : 'This field is required'}
            onChange={this.validateForm}
            autoFocus
          />
          <br/><br/>
          <RaisedButton onClick={this.submitButtonPressed} disabled={!this.state.formValid} style={{paddingLeft: '1em'}} label="Begin lab" primary={true}></RaisedButton>
          <br/>
        </Card>

        
      </div>
    );
  }
}
RegisterPage.contextTypes = {router: React.PropTypes.object};