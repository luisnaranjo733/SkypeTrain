import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';

import ChatBox from './ChatBox';
import WordSearch from './WordSearch';
import {convo1, convo2} from '../models/Conversations';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class LabPage extends Component {
  constructor(props, context) {
    super(props);
    this.context = context;
    this.state = {
      isChatBoxOpen: false,
      secondaryMessageReceived: false,
      nWordSearchCompleted: 0
    }
  }

  toggleChatBoxOpen = (chatHistory) => {

    // if chatBox is about to open, then we set all unread messages to read
    if (!this.state.isChatBoxOpen) {
      chatHistory.forEach((message) => {
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
      window.setTimeout(() => {
        firebase.database().ref('events').push({
          participantKey: snapshot.key,
          timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
          eventName: 'finishedWordSearch'
        })
      }, 10)

    });

    // generate a new wordSearch
    this.setState({nWordSearchCompleted: this.state.nWordSearchCompleted + 1});
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

    if (this.state.secondaryMessageReceived) {
      this.setState({secondaryMessageReceived: false});
      let subConvo = this.getCurrentSubConvo();
      window.setTimeout(() => {
        
        this.onReceiveMessage(subConvo.closingMessage.content);
        this.setState({currentSubConvo: this.state.currentSubConvo + 1}, () => {
          // reset state for next subConvo
          window.setTimeout(() => {
            subConvo = this.getCurrentSubConvo(); // update subConvo to next
            this.beginCurrentSubConvo();
          }, subConvo.relativeStartTime);
        })

      }, subConvo.closingMessage.delay)
    } 

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

  getCurrentSubConvo = () => {
    if (this.state.subConvos && this.state.currentSubConvo >= 0) {
      return this.state.subConvos[this.state.currentSubConvo];
    }
  }

  beginCurrentSubConvo = () => {
    
    let subConvo = this.getCurrentSubConvo();
    if (subConvo) {
      this.onReceiveMessage(subConvo.primaryOpeningMessage);
      if (subConvo.secondaryOpeningMessage) { // set timer for second message
        window.setTimeout(() => {
          this.onReceiveMessage(subConvo.secondaryOpeningMessage.content);
          this.setState({secondaryMessageReceived: true})
        }, subConvo.secondaryOpeningMessage.delay)
      } else {
        this.setState({secondaryMessageReceived: true});
      }
    }

  }

  componentDidMount = () => {

    window.setTimeout(() => {
      console.log('END OF LAB');
      firebase.database().ref('participants').limitToLast(1).once('child_added', (snapshot) => {
        console.log('sending end event')
        firebase.database().ref('events').push({
          participantKey: snapshot.key,
          timestamp: firebase.database.ServerValue.TIMESTAMP, // time since the Unix epoch, in milliseconds
          eventName: 'endLab'
        }, () => this.context.router.push('/end'))
      });

       
    }, 30 * 1000)

    firebase.database().ref('wordSearch2').on('value', (snapshot) => {
      this.setState({wordSearchParams: snapshot.val()});
    });

    firebase.database().ref('settings/showAnswerKey').on('value', (snapshot) => {
      this.setState({showAnswerKey: snapshot.val()})
    });

    firebase.database().ref('settings/labVariant').on('value', (snapshot) => {
      let subConvos;
      if (snapshot.val() === 'v1') {
        subConvos = convo1;
      } else if (snapshot.val() === 'v2') {
        subConvos = convo2;
      }
      this.setState({subConvos: subConvos, currentSubConvo: 0}, () => {
        let subConvo = this.getCurrentSubConvo();
        // need to set initial timeout, closingMessage() will set all future buffer timeouts between subconvos
        window.setTimeout(() => {
          this.beginCurrentSubConvo();
        }, subConvo.relativeStartTime);
        
      });
    });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('wordSearch').off();
    firebase.database().ref('settings/showAnswerKey').off();
    firebase.database().ref('settings/labVariant').off();
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
          <div key={this.state.nWordSearchCompleted}>    
            {this.state.wordSearchParams ? 
              <WordSearch labVariant={this.props.state.labVariant} showAnswerKey={this.state.showAnswerKey} 
                wordList={this.state.wordSearchParams.words} height={this.state.wordSearchParams.height}
                width={this.state.wordSearchParams.width} onWordSearchComplete={this.onWordSearchComplete}
                onWordCompleted={this.onWordCompleted}
              />
              : <p>Loading</p>
            }
          </div>
          <ChatBox onReceiveMessage={this.onReceiveMessage} onSendMessage={this.onSendMessage} isChatBoxOpen={this.state.isChatBoxOpen} toggleChatBoxOpen={this.toggleChatBoxOpen}/>
        </div>
      
    );
  }
}
LabPage.contextTypes = {router: React.PropTypes.object};