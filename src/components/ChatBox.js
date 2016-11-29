import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import {HotKeys} from 'react-hotkeys';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import TextField from 'material-ui/TextField';  
import {grey900, grey500, grey200} from 'material-ui/styles/colors';

import './ChatBox.css';

let style = {
  listItem: {
    color: grey900,
  },
  chatBoxInput: {
    display: 'block',
    position: 'fixed',
    bottom: '0',
    backgroundColor: grey500,
    width: '88vw',
    paddingLeft: '1vw',
    paddingRight: '1vw',
  }
};

class VisibleChatBox extends Component {

  onInputChanged = (e) => {
    this.props.onInputChanged(e);
  }

  render() {
    const keyboardEvents = {
      keyMap: {
        enter: 'enter'
      },
      handlers: {
       enter: this.props.onSendMessage
      }
    }

    let messageList = this.props.chatHistory.map((message, i) => { // loop over messages from labVariant prototype
      // if there is a sender defined, else the user is sending
      if (message.sender) {
        return (
          <span key={i}>
            <ListItem
              primaryText={message.message} style={style.listItem}
              leftAvatar={<Avatar src={message.icon} />}
            />
            <Divider />
          </span>
        );
      } else {
        return (
          <span key={i}>
            <ListItem
              primaryText={message.message} style={style.listItem}
              rightAvatar={<Avatar src={message.icon} />}
            />
            <Divider />
          </span>
        );
      }
    });

    return (
      <List className='visibleChatBox' style={{paddingTop: '0px', paddingBottom: '8px'}}>
        <AppBar
          title={
            <span className='chatBoxTitle'>Chat</span>
          }
          showMenuIconButton={false}
          iconElementRight={<IconButton><NavigationClose /></IconButton>}
          onRightIconButtonTouchTap={this.props.toggleChatBox}
          onTitleTouchTap={this.props.toggleChatBox}
        />
        {messageList}

        <HotKeys keyMap={keyboardEvents.keyMap} handlers={keyboardEvents.handlers}>
          <TextField
            id='chatBoxInput'
            hintText='Type a message...'
            style={style.chatBoxInput}
            floatingLabelFixed={false}
            underlineFocusStyle={{borderColor: grey200}}
            value={this.props.message}
            onChange={this.onInputChanged}
          />
        </HotKeys>

      </List>
    );
  }
}

class HiddenChatBox extends Component {
  render() {
    return (
      <List className='hiddenChatBox' style={{paddingTop: '0px', paddingBottom: '8px'}}>
        <AppBar
          title={
            <span className='chatBoxTitle'>Chat ({this.props.nUnreadMessages})</span>
          }
          showMenuIconButton={false}
          onTitleTouchTap={this.props.toggleChatBox}
          iconElementRight={
            <IconButton tooltip="Notifications">
              <NotificationsIcon />
            </IconButton>
          }
        />
      </List>
    );
  }
}


export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      chatHistory: []
    };
  }

  onInputChanged = (e) => {
    this.setState({message: e.target.value})
  }

  onSendMessage = () => {
    this.props.onSendMessage(this.state.message)
    this.setState({message: ''});
  }

  toggleChatBox = () => this.props.toggleChatBoxOpen(this.state.chatHistory);
  
  componentDidMount = () => {
    firebase.database().ref('participants').limitToLast(1).once('child_added', (participant) => { // get most recent participant
      firebase.database().ref('events').on('value', (eventsSnapshot) => {
        let events = [];
        eventsSnapshot.forEach((event) => { // loop over all 
          if (event.val().participantKey === participant.key && _.includes(['sendMessage', 'receiveMessage'], event.val().eventName) ) { // filter by participant and receiveMessage
            let modifiedEvent = event.val();
            modifiedEvent['messageKey'] = event.key;
            // console.log(modifiedEvent)
            events.push(modifiedEvent);
          }
        });
        // console.log(events);
        this.setState({chatHistory: events});
      });
    });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref("participants").off();
  }

  render() {
    let nUnreadMessages = this.state.chatHistory.reduce((total, message) => {
      return message.unread ? total + 1 : total;
    }, 0);

    return (
      <span>
        {this.props.isChatBoxOpen ? 
          <VisibleChatBox toggleChatBox={this.toggleChatBox} chatHistory={this.state.chatHistory} receivedMessages={true}
            onInputChanged={this.onInputChanged} onReceiveMessage={this.props.onReceiveMessage} onSendMessage={this.onSendMessage} message={this.state.message}
          /> :
          <HiddenChatBox toggleChatBox={this.toggleChatBox} nUnreadMessages={nUnreadMessages} />
        }
      </span>
    );
  }
}