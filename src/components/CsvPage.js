import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import moment from 'moment';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';


export default class CsvPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {};
  }

  componentDidMount() {
    firebase.database().ref('participants').on('value', (snapshot) => {
      let participants = [];
      snapshot.forEach((participant) => {
        participants.push({
          key: participant.key,
          name: participant.val().name
        })
      })
      this.setState({participants: participants});
    });

    firebase.database().ref('events').on('value', (snapshot) => {
      let events = [];
      snapshot.forEach((event) => {
        events.push(event.val());
      })
      this.setState({events: events});
    });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref("participants").off();
    firebase.database().ref("events").off();
  }

  render() {
    let rows = [['Participant', 'Variant', 'ChatSum', 'WordsFound'],];
    let ommitedParticipants = [];

    if (this.state.participants && this.state.events) {
      let participantID = 1;
      for (let participant of this.state.participants) {
        // let participant = this.state.participants[0];
        let row = ['', '', 0, 0];
        // row[0] = participant.name; // add participant to the 0th index
        row[0] = participantID; // add participant to the 0th index

        let events = this.state.events.filter((event) => {
          return event.participantKey === participant.key
        });

        // console.log(events.filter((event) => {
        //   return event.eventName === 'openedChat' || event.eventName === 'closedChat' || event.eventName === 'endLab'
        // }))

        let openedChatTimestamp = null;
        let brokenData = false;
        for (let event of events) {

          switch(event.eventName) {
            case 'startLab':
              row[1] = event.labVariant;
              break;
            case 'wordCompleted':
              row[3]++;
              break;
            case 'openedChat':
              openedChatTimestamp = event.timestamp;
              break;
            case 'closedChat':

              if (openedChatTimestamp === null) {
                brokenData = true;
                ommitedParticipants.push({
                  name: participant.name,
                  id: participantID
                })
              }

              let openChatMoment = moment(openedChatTimestamp);
              let closeChatMoment = moment(event.timestamp);

              let duration = moment.duration(closeChatMoment.diff(openChatMoment));
              row[2] = row[2] + duration.seconds();

              openedChatTimestamp = null;
              break;
            case 'endLab':
              break;
          }
        }
        if (!brokenData) {
          rows.push(row);
        } else {
          console.log(`Skipping ${participant.name}`)
        }
        participantID++;

      }
    }

    return (
     
      <div>

        {rows.map((row, i) => {
          return <div key={i} className="row">{row.join(',')}</div>
        })}

        <Divider />
        <p>Omitted the following participants from statistics aggregation due to untrustworthy data:</p>
        <ul>
          {ommitedParticipants.map((participant) => {
            return <li key={participant.id}>Participant #{participant.id}: {participant.name}</li>
          })}
        </ul>

        <Divider />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Participant ID</TableHeaderColumn>
              <TableHeaderColumn>Lab variant</TableHeaderColumn>
              <TableHeaderColumn>Seconds spent in chat</TableHeaderColumn>
              <TableHeaderColumn>Words completed</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => {
              if (i > 0) { // skip header row
                return (
                  <TableRow key={i}>
                    <TableRowColumn>{row[0]}</TableRowColumn>
                    <TableRowColumn>{row[1]}</TableRowColumn>
                    <TableRowColumn>{row[2]}</TableRowColumn>
                    <TableRowColumn>{row[3]}</TableRowColumn>
                  </TableRow>
                );
              }

            })}
          </TableBody>
        </Table>

      </div>
    );
  }
}
CsvPage.contextTypes = {router: React.PropTypes.object};

