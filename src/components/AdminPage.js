import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import moment from 'moment';

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
        // menuItems.push(<MenuItem key={i} value={item.key} primaryText={item.val().name} />);
        menuItems.push(<MenuItem key={i} value={item.key} primaryText={`Participant #${i}`} />);
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
    firebase.database().ref("participants").off();
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

    let stats = {
      timeOnWordSearch: 0,
      timeOnChat: 0,
      totalLabDuration: null
    }

    let startLabEvent = this.state.events.filter((event) => {
      return event.eventName === 'startLab'
    });
    let endLabEvent = this.state.events.filter((event) => {
      return event.eventName === 'endLab';  
    });

    let startLabEventMoment;
    let endLabEventMoment;
    if ((startLabEvent && startLabEvent.length > 0) && (endLabEvent && endLabEvent.length > 0)) {
      startLabEventMoment = moment(startLabEvent[0].timestamp);
      endLabEventMoment = moment(endLabEvent[0].timestamp);
      
      let diffTime = endLabEventMoment.diff(startLabEventMoment);
      let duration = moment.duration(diffTime);
      stats.totalLabDuration = duration;
    }

    
    return (
      <div>
        <Card>
          <CardTitle title="Admin" subtitle="Settings" />

          <CardText>
            This is the admin page for our lab. It can be accessed by visiting the /admin page of the URL.
            There is no access control, but we never include any hyperlinks to this page so that our lab participants do not accidentally stumble upon it.

            From this page we can perform the following operations:
            <ul>
              <li>View log data for a specific participant</li>
              <li>Delete log data for a specific participant if necessary</li>
              <li>Toggle between lab variant 1 and 2 (control the two levels of our lab)</li>
              <li>Toggle showing the answer key (we used this for pilot testing the lab)</li>
              <li>Navigate to the CSV report for all the participants, which we used to analyze our data</li>
              <li>Navigate to both of our lab pages if needed</li>
            </ul>
          </CardText>

          <RaisedButton primary={true} onClick={() => this.context.router.push('/admin/csv')} label="Go to csv report of all lab participants" />
          <br/><br/>
          <RaisedButton primary={true} onClick={() => this.context.router.push('/')} label="Go to lab registration page" />
          <br/><br/>
          <RaisedButton primary={true} onClick={() => this.context.router.push('/lab')} label="Go to lab page" />

          <br/><br/>

          <div style={styles.block}>
            <Toggle disabled={!this.props.state.settingsLoaded}
              onToggle={this.props.toggleAnswerKey} style={styles.toggle} label="Show word search answers" defaultToggled={this.props.state.showAnswerKey} />
          </div>

          {radioButtons}

          <SelectField
            floatingLabelText="Participant"
            value={this.state.selectedParticipant}
            onChange={this.handleSelectChange}
            disabled={!this.state.menuItems || this.state.menuItems.length === 0}
          >
            {this.state.menuItems}
          </SelectField>

          <RaisedButton disabled={true} primary={true} onClick={this.onDeleteParticipantData} label="Delete this participant" />

          <Divider />

            <ul>
              {this.state.events.map((event, i) => {
                return (
                  <li key={i}>{event.eventName}
                    <ul>
                      <li>Seconds from start of lab {moment(event.timestamp).diff(startLabEventMoment, 'seconds')}</li>
                      {event.labVariant ? 
                        <li>Lab variant: {event.labVariant}</li> :
                        <span/>
                      }
                      {event.message ? 
                        <li>Message: {event.message}</li> :
                        <span/>
                      }
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

    this.state = {
      labEnded: false
    }
  }



  forceEndLab = () => {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
      firebase.database().ref('events').push({
        participantKey: snapshot.key,
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'endLab'
      })
    });
  }

  componentDidMount() {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (participant) => {
      firebase.database().ref('events').on('value', (events) => {
        events.forEach((event) => {
          if (event.val().participantKey === participant.key) {
            if (event.val().eventName === 'endLab') {
              this.setState({labEnded: true});
            }
          }
        })
      })

    })
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref("participants").off();
    firebase.database().ref("events").off();
  }

  render() {
    return (
      <div>
        <Card>
          <CardTitle title="Done" subtitle="Thank you!" />
          <CardText>
            Thank you for participating in our lab!
            {this.state.labEnded ? <span/> : <RaisedButton onClick={this.forceEndLab} label="End lab (ADMIN ONLY)" />}
            
          </CardText>
        </Card>
      </div>
    );
  }
}
EndPage.contextTypes = {router: React.PropTypes.object};