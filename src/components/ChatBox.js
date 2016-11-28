import React, { Component } from 'react';
import _ from 'lodash';
import {HotKeys} from 'react-hotkeys';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import TextField from 'material-ui/TextField';  
import {orange500, grey900, grey500, grey200} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

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
        {this.props.messages}

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
            <span className='chatBoxTitle'>Chat (4)</span>
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
      messages: [
        {
          sender: 'Laura',
          icon: 'http://www.material-ui.com/images/uxceo-128.jpg',
          message: 'Hey there!'
        },
        {
          sender: '',
          icon: 'http://www.material-ui.com/images/kolage-128.jpg',
          message: 'Yo!'
        }
      ],
      message: ''
    };
  }

  onInputChanged = (e) => {
    this.setState({message: e.target.value})
  }

  onSendMessage = () => {
    this.props.onSendMessage(this.state.message);
    this.setState({
      messages: _.concat(this.state.messages, {
        sender: '',
        icon: 'http://www.material-ui.com/images/kolage-128.jpg',
        message: this.state.message
      }),
      message: ''
    })
  }

  toggleChatBox = () => {
    // if (this.props.isChatBoxOpen) {
    //   style.chatBox.height = '';
    // } else {
    //   style.chatBox.height = CHAT_WINDOW_HEIGHT;
    // }
    this.props.toggleChatBoxOpen();
  }
  

  render() {
    

    var messages = this.state.messages.map((message, i) => {
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

    let chatBox = <VisibleChatBox toggleChatBox={this.toggleChatBox} />

    return (
      <span>
        {this.props.isChatBoxOpen ? 
          <VisibleChatBox toggleChatBox={this.toggleChatBox} messages={messages}
            onInputChanged={this.onInputChanged} onSendMessage={this.onSendMessage} message={this.state.message}
          /> :
          <HiddenChatBox toggleChatBox={this.toggleChatBox} messages={messages} />
        }
      </span>
    );
  }
}