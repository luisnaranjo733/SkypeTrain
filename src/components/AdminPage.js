import React, { Component } from 'react';

import {Card, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';


export default class AdminPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
  }

  changeLabVariant = (event, value) => {
    this.props.setLabVariant(value);
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


        </Card>
      </div>
    );
  }
}
AdminPage.contextTypes = {router: React.PropTypes.object};