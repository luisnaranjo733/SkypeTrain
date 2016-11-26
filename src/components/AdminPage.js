import React, { Component } from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import firebase from 'firebase';

export default class AdminPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;

    this.state = {

    };

    this.settingsRef = firebase.database().ref('settings');
  }

  componentDidMount() {
    this.settingsRef.child('chatEvents').push({
        event: true
    });

    this.settingsRef.on('value', (snapshot) => {
      // console.log(snapshot.val());
    });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('settings').off();
  }

  render() {
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
        </Card>
      </div>
    );
  }
}
AdminPage.contextTypes = {router: React.PropTypes.object};