import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ChatBox from './ChatBox';
import WordSearch from './WordSearch';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class LabPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {
      isChatBoxOpen: false,
      wordSearchComplete: 1,
    }
  }

  toggleChatBoxOpen = () => {
    this.setState({isChatBoxOpen: !this.state.isChatBoxOpen}, () => {
      firebase.database().ref('participants').limitToLast(1).once('child_added', (participant) => {
        firebase.database().ref('events').push({
          participantKey: participant.key,
          timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
          eventName: this.state.isChatBoxOpen ? 'openedChat' : 'closedChat'
        })
      })
    })
  }

  onWordSearchComplete = () => {

    console.log(`WORD SEARCH COMPLETE (${this.state.wordSearchComplete})`);
    this.setState({wordSearchComplete: this.state.wordSearchComplete + 1});

    firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
      firebase.database().ref('events').push({
        participantKey: snapshot.key,
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'endLab'
      })
    });

    this.context.router.push('/end');
  }

  onSendMessage = (message) => {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
      firebase.database().ref('events').push({
        participantKey: snapshot.key,
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'sendMessage',
        message: message
      })
    });
  }

  onReceiveMessage = (message) => {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
      firebase.database().ref('events').push({
        participantKey: snapshot.key,
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'receiveMessage',
        message: message
      })
    });
  }

  componentDidMount() {
    firebase.database().ref('wordSearch2').on('value', (snapshot) => {
      this.setState({wordSearchParams: snapshot.val()});
    });

    firebase.database().ref('settings/showAnswerKey').on('value', (snapshot) => {
      this.setState({showAnswerKey: snapshot.val()})
    })
    // this.onWordSearchComplete();
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('wordSearch').off();
    firebase.database().ref('settings/showAnswerKey').off();
  }

  render() {

    return (

        <div>      
          {this.state.wordSearchParams ? 
            <WordSearch labVariant={this.props.state.labVariant} showAnswerKey={this.state.showAnswerKey} 
              wordList={this.state.wordSearchParams.words} height={this.state.wordSearchParams.height}
              width={this.state.wordSearchParams.width} onWordSearchComplete={this.onWordSearchComplete}
            />
            : <p>Loading</p>
          }
          <ChatBox onReceiveMessage={this.onReceiveMessage} onSendMessage={this.onSendMessage} isChatBoxOpen={this.state.isChatBoxOpen} toggleChatBoxOpen={this.toggleChatBoxOpen}/>
        </div>
      
    );
  }
}
LabPage.contextTypes = {router: React.PropTypes.object};