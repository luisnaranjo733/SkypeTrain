import React, { Component } from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import firebase from 'firebase';

export default class AdminPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;

    this.state = {
      showAnswerKey: null,
      settingsLoaded: false,
    };

    this.settingsRef = firebase.database().ref('settings');
  }

  componentDidMount() {
    // this.settingsRef.child('showAnswerKey').set(true);
    this.settingsRef.child('showAnswerKey').on('value', (snapshot) => {
      this.setState({
        showAnswerKey: snapshot.val(),
        settingsLoaded: true
      });
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

  render() {

    const styles = {
      block: {
        maxWidth: 250,
      },
      toggle: {
        marginBottom: 16,
      },
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
        </Card>
      </div>
    );
  }
}
AdminPage.contextTypes = {router: React.PropTypes.object};