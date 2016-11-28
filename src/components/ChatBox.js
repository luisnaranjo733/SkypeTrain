import React, { Component } from 'react';
import _ from 'lodash';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import './ChatBox.css';

let style = {
  listItem: {
    color: '#212121',
  },
};

class VisibleChatBox extends Component {
  render() {
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
      ]
    };
  }

  toggleChatBox = () => {
    // if (this.props.isChatBoxOpen) {
    //   style.chatBox.height = '';
    // } else {
    //   style.chatBox.height = CHAT_WINDOW_HEIGHT;
    // }
    console.log('tap')
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
          <VisibleChatBox toggleChatBox={this.toggleChatBox} /> :
          <HiddenChatBox toggleChatBox={this.toggleChatBox} />
        }
      </span>
    );
  }
}