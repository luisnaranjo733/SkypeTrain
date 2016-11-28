import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';

import {Card, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export class AdminPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {
      events: [],
      selectedParticipant: null
    };

  }

  changeLabVariant = (event, value) => {
    this.props.setLabVariant(value);
  }

  buildMenuItems = () => {
    let menuItems = []; // menu items for participant select field
    let i=1;
    
    firebase.database().ref('participants').once('value', (snapshot) => {
      let lastParticipantKey; // last participant's firebase key, used for default select field value

      snapshot.forEach((item) => {
        menuItems.push(<MenuItem key={i} value={item.key} primaryText={item.val().name} />);
        i += 1;
        lastParticipantKey = item.key;
      });

      this.setState({
        menuItems: menuItems,
        selectedParticipant: lastParticipantKey
      }, this.updateEventState);

    });
  }

  componentDidMount() {
    this.buildMenuItems();
    this.updateEventState();
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref("events").off();
  }

  handleSelectChange = (event, index, value) => {;
    this.setState({
      selectedParticipant: value,
      events: []
    }, this.updateEventState);
  }

  updateEventState = () => {
    firebase.database().ref('events').once('value', (snapshot) => {
      let events = [];
      snapshot.forEach((event) => {
        if (event.val().participantKey === this.state.selectedParticipant) {
          events.push(event.val());
        }
      });
      this.setState({events: events});
    });
  }

  onDeleteParticipantData = () => {
    if (this.state.selectedParticipant) {
      // delete events
      firebase.database().ref('events').once('value', (snapshot) => {
        snapshot.forEach((event) => {
          if (event.val().participantKey === this.state.selectedParticipant) {
            event.ref.remove();
          }
        });
        this.updateEventState();
      });

      // delete chat history

      // delete participant
      firebase.database().ref('participants').once('value', (snapshot) => {
        snapshot.forEach((participant) => {
          if (participant.key === this.state.selectedParticipant) {
            console.log('delete')
            participant.ref.remove();
          }
        })
        this.buildMenuItems();
      })
    }
  }

  render() {

    const styles = {
      block: {
        maxWidth: 250,
      },
      toggle: {
        marginBottom: 16,
      },
    }

    let radioButtons;
    if (this.props.state.settingsLoaded) {
      radioButtons = (
        <RadioButtonGroup name="labVariant" defaultSelected={this.props.state.labVariant} onChange={this.changeLabVariant}>
          <RadioButton
            value="v1"
            label="Variant 1"
            style={styles.radioButton}
          />
          <RadioButton
            value="v2"
            label="Variant 2"
            style={styles.radioButton}
          />
        </RadioButtonGroup>
      )
    }

    return (
      <div>
        <Card>
          <CardTitle title="Admin" subtitle="Settings" />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>

          <br/><br/>

          <div style={styles.block}>
            <Toggle disabled={!this.props.state.settingsLoaded}
              onToggle={this.props.toggleAnswerKey} style={styles.toggle} label="Show word search answers" defaultToggled={this.props.state.showAnswerKey} />
          </div>

          <p>Variant: {this.props.state.labVariant}</p>
          {radioButtons}

          <SelectField
            floatingLabelText="Participant"
            value={this.state.selectedParticipant}
            onChange={this.handleSelectChange}
            disabled={!this.state.menuItems || this.state.menuItems.length === 0}
          >
            {this.state.menuItems}
          </SelectField>

          <RaisedButton onClick={this.onDeleteParticipantData} label="Delete this participant" />

          <Divider />

            <ul>
              {this.state.events.map((event, i) => {
                return (
                  <li key={i}>{event.eventName}
                    <ul>
                      <li>Event name {event.eventName}</li>
                      <li>Timestamp {event.timestamp}</li>
                    </ul>
                  </li>
                )
              })}
            </ul>

        </Card>
      </div>
    );
  }
}
AdminPage.contextTypes = {router: React.PropTypes.object};


export class EndPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
  }

  render() {
    return (
      <div>
        <Card>
          <CardTitle title="Done" subtitle="Thank you!" />
          <CardText>
            Thank you for participating in our lab!
          </CardText>
        </Card>
      </div>
    );
  }
}
EndPage.contextTypes = {router: React.PropTypes.object};