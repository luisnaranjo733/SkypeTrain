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
        eventName: 'startLab'
      })
      this.context.router.push('/lab');
    }
  }  

  render() {
    return (
      <div>
        <Card>
          <CardTitle title="Introduction" subtitle="Typing Lab" />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>

          <TextField
            style={{paddingLeft: '1em'}}
            hintText="Full name"
            floatingLabelText="Participant name"
            floatingLabelFixed={false}
            errorText={this.state.formValid ? '' : 'This field is required'}
            onChange={this.validateForm}
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