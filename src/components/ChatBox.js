import React, { Component } from 'react';
// import './App.css';
import _ from 'lodash';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';


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
      ]
    };

  }

  getChatBoxStyle = () => {
    return this.props.isChatBoxOpen ? 'chatBoxVisible' : 'chatBoxHidden';
  }  

  render() {
    var messages = this.state.messages.map((message, i) => {
      // if there is a sender defined, else the user is sending
      if (message.sender) {
        return (
          <span key={i}>
            <ListItem
              primaryText={message.message} className='message-item'
              leftAvatar={<Avatar src={message.icon} />}
            />
            <Divider />
          </span>
        );
      } else {
        return (
          <span key={i}>
            <ListItem
              primaryText={message.message} className='message-item'
              rightAvatar={<Avatar src={message.icon} />}
            />
            <Divider />
          </span>
        );
      }

    });

    let chatBoxStyle = this.getChatBoxStyle();
    console.log(`Style: ${chatBoxStyle}`);

    return (
      <List className={this.getChatBoxStyle}>
        {
          this.props.isChatBoxOpen ? 
            <AppBar
              title={<span className='chatBoxTitle'>Chat</span>}
              showMenuIconButton={false}
              iconElementRight={<IconButton><NavigationClose /></IconButton>}
              onRightIconButtonTouchTap={this.props.toggleChatBoxOpen}
              onTitleTouchTap={this.props.toggleChatBoxOpen}
            />
          :
            <AppBar
              title={
                <span className='chatBoxTitle'>Chat (4)</span>
              }
              showMenuIconButton={false}
              onTitleTouchTap={this.props.toggleChatBoxOpen}
              iconElementRight={
                <IconButton tooltip="Notifications">
                  <NotificationsIcon />
                </IconButton>
              }
            />
        }

        {this.props.isChatBoxOpen ? messages : <span />}

      </List>
    );
  }
}
