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

    let startLabEvent = this.state.events.filter((event) => {
      return event.eventName === 'startLab'
    });
    let firstTimestamp;
    if (startLabEvent && startLabEvent.length > 0) {
      firstTimestamp = startLabEvent[0].timestamp;
    }

    let endLabEvent = this.state.events.filter((event) => {
      return event.eventName === 'endLab';
    });
    let lastTimestamp;
    if (endLabEvent && endLabEvent.length > 0) {
      lastTimestamp = endLabEvent[0].timestamp;
    }


    let stats = {
      timeOnWordSearch: 0,
      timeOnChat: 0,
      timeTotal: lastTimestamp - firstTimestamp,
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

          <RaisedButton primary={true} onClick={() => this.context.router.push('/lab')} label="Go to lab" />

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

          <RaisedButton primary={true} onClick={this.onDeleteParticipantData} label="Delete this participant" />

          <Divider />

            <ul>
              {this.state.events.map((event, i) => {
                return (
                  <li key={i}>{event.eventName}
                    <ul>
                      <li>Seconds from start of lab {(event.timestamp - firstTimestamp) / 1000}</li>
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

          <Divider />
          <p>Lab variant: {this.props.state.labVariant}</p>
          <p>Time spent on word search: Analysis not implemented yet</p>
          <p>Time spent on chat: Analysis not implemented yet</p>
          <p>Total time spent on lab: {stats.timeTotal / 1000 / 60} minutes</p>

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