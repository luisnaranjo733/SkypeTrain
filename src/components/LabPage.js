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
    }

    // Conversation is an array of subconversations. Participant should progress through the subconversations synchronously
    // Subconversation is an array of message objects.
    let participantName = 'josh';

    this.conversation = [
      {
        relativeStartTime: 2 * 60 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Are you working on a word search?',
        closingMessage: 'ok cool!'
      },
      {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: `Hello ${participantName}`,
        secondaryOpeningMessage: {
          content: 'how old are you?',
          delay: 30 * 1000 // fire 30 seconds after primary opening message
        },
        closingMessage: 'Thanks!'
      },
      {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: 'What month were you born in?',
        closingMessage: 'Okay!'
      },
      {
        relativeStartTime: 2 * 60 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Another question for you:',
        secondaryOpeningMessage: {
          content: 'What is your major>',
          delay: 50 * 1000 // fire 30 seconds after primary opening message
        },
        closingMessage: 'Great, that sounds cool!'
      },
    ];

  }

  toggleChatBoxOpen = (chatHistory) => {

    // if chatBox is about to open, then we set all unread messages to read
    if (!this.state.isChatBoxOpen) {
      chatHistory.forEach((message) => {
        // console.log(message)
        firebase.database().ref('events').child(message.messageKey).update({unread: false});
      })
    }

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
      let messageObj = {
        participantKey: snapshot.key,
        icon: 'http://www.material-ui.com/images/kolage-128.jpg',
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'sendMessage',
        message: message,
        // unread: true,
      };
      firebase.database().ref('events').push(messageObj)
      // this.setState({messages: _.concat(this.state.messages, messageObj)})
    });
  }

  onReceiveMessage = (message) => {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
      firebase.database().ref('events').push({
        participantKey: snapshot.key,
        sender: true,
        icon: 'http://www.material-ui.com/images/uxceo-128.jpg',
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'receiveMessage',
        message: message,
        unread: true,
      })
    });
  }

  componentDidMount = () => {

    firebase.database().ref('wordSearch').on('value', (snapshot) => {
      this.setState({wordSearchParams: snapshot.val()});
    });

    firebase.database().ref('settings/showAnswerKey').on('value', (snapshot) => {
      this.setState({showAnswerKey: snapshot.val()})
    })

    // if (this.props.state.labVariant) {
    //   firebase.database().ref('labVariants').once('value', (snapshot) => {
    //     snapshot.forEach((labVariant) => {
    //       if (labVariant.val().labVariant === this.props.state.labVariant) {
    //         labVariant.val().messages.forEach((message) => {
    //           // set timeOut for receive message event
    //           window.setTimeout(() => {
    //             this.onReceiveMessage(message.message); // log message in firebase
    //             // this.setState({messages: _.concat(this.state.messages, message)}) // set state for ChatBox
    //           }, message.timeout)
    //         })
    //       }
    //     })
    //   })
    // }
    if (this.props.state.labVariant === 'v1') {

    } else if (this.props.state.labVariant === 'v2') {

    } else {
      console.log('fuck something went wrong')
    }
    
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('wordSearch').off();
    firebase.database().ref('settings/showAnswerKey').off();
    // firebase.database().ref('labVariants').off();
    firebase.database().ref("participants").off();
  }

  onWordCompleted = (word) => {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
      firebase.database().ref('events').push({
        participantKey: snapshot.key,
        timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
        eventName: 'wordCompleted',
        word: word
      })
    });
  }

  render() {
    return (

        <div>      
          {this.state.wordSearchParams ? 
            <WordSearch labVariant={this.props.state.labVariant} showAnswerKey={this.state.showAnswerKey} 
              wordList={this.state.wordSearchParams.words} height={this.state.wordSearchParams.height}
              width={this.state.wordSearchParams.width} onWordSearchComplete={this.onWordSearchComplete}
              onWordCompleted={this.onWordCompleted}
            />
            : <p>Loading</p>
          }
          <ChatBox onReceiveMessage={this.onReceiveMessage} onSendMessage={this.onSendMessage} isChatBoxOpen={this.state.isChatBoxOpen} toggleChatBoxOpen={this.toggleChatBoxOpen}/>
        </div>
      
    );
  }
}
LabPage.contextTypes = {router: React.PropTypes.object};