import React, { Component } from 'react';

import {Card, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import firebase from 'firebase';

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

export default class AdminPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;

    this.state = {
      showAnswerKey: null,
      labVariant: null,
      settingsLoaded: false,
    };

    this.settingsRef = firebase.database().ref('settings');
  }

  componentDidMount() {
    this.settingsRef.on('value', (snapshot) => {
      this.setState({
        showAnswerKey: snapshot.val().showAnswerKey,
        labVariant: snapshot.val().labVariant,
        settingsLoaded: true
      }, () => console.log(this.state));
    });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('settings').off();
  }

  onToggleAnswerKey = () => {
    console.log('toggle answer key');
    this.settingsRef.child('showAnswerKey').set(!this.state.showAnswerKey);
    this.setState({showAnswerKey: !this.state.showAnswerKey});
  }

  changeLabVariant = (event, value) => {

    this.settingsRef.child('labVariant').set(value);
    this.setState({labVariant: value});
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
    if (this.state.settingsLoaded) {
      radioButtons = (
        <RadioButtonGroup name="labVariant" defaultSelected={this.state.labVariant} onChange={this.changeLabVariant}>
          <RadioButton
            value="v1"
            label="Variant 1"
            style={styles.radioButton}
            disabled={!this.state.settingsLoaded}
          />
          <RadioButton
            value="v2"
            label="Variant 2"
            style={styles.radioButton}
            disabled={!this.state.settingsLoaded}
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
            <Toggle disabled={!this.state.settingsLoaded}
              onToggle={this.onToggleAnswerKey} style={styles.toggle} label="Show word search answers" defaultToggled={this.state.showAnswerKey} />
          </div>

          <p>Variant: {this.state.labVariant}</p>
          {radioButtons}


        </Card>
      </div>
    );
  }
}
AdminPage.contextTypes = {router: React.PropTypes.object};