import React, { Component } from 'react';
import firebase from 'firebase';

import {Card, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export class AdminPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {
      events: [
        {
          eventName: 'startLab',
          participantKey: '',
          timestamp: 'time'
        }
      ],
      selectedParticipant: 1
    };

  }

  changeLabVariant = (event, value) => {
    this.props.setLabVariant(value);
  }

  componentDidMount() {
    firebase.database().ref('events').on('child_added', (snapshot) => {
      console.log(snapshot.val())
    });
  }

  componentWillUnmount() {
    //unregister listeners
    // this.settingsRef.off();
  }

  handleSelectChange = (event, index, value) => {
    console.log(`Event: ${event}`);
    console.log(event.target);
    console.log(`Index: ${index}`);
    console.log(`Value: ${value}`);
    this.setState({selectedParticipant: value})
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

    let menuItems = [];
    let i=1;
    firebase.database().ref('participants').on('child_added', (snapshot) => {
      menuItems.push(<MenuItem key={i} value={snapshot.key} primaryText={snapshot.val().name} />);
      i += 1;
    });

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
            floatingLabelText="Frequency"
            value={this.state.selectedParticipant}
            onChange={this.handleSelectChange}
          >
            {menuItems}
          </SelectField>
        </Card>




        <Divider />
        <Card>
          <ul>
            {this.state.events.map((event, i) => {
              return <li key={i}>{event.eventName}</li>
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