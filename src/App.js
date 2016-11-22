import React, { Component } from 'react';
import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

let style = {
  paper: {
    height: '60vh',
    width: '100vw',
    textAlign: 'center',
    display: 'block',
  },

  chatBox: {
    position: 'fixed',
    bottom: '0',
    right: '0',
    width: '30vw',
    
    height: '60vh',
    marginRight: '1.5em',
    paddingTop: '0',

    backgroundColor: '#EEEEEE',
  },

  chatBoxHeader: {

  },
  title: {
    cursor: 'pointer',
  },
  listItem: {
    color: '#212121',
  }
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class ChatBox extends Component {
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
    if (this.props.isChatBoxOpen) {
      console.log('close chat box');
      style.chatBox.height = '';
    } else {
      console.log('open chat box');
      style.chatBox.height = '60vh';
    }
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

    return (
      <List style={style.chatBox}>
        {
          this.props.isChatBoxOpen ? 
            <AppBar
              style={style.chatBoxHeader}
              title={<span style={style.title}>Chat</span>}
              showMenuIconButton={false}
              iconElementRight={<IconButton><NavigationClose /></IconButton>}
              onRightIconButtonTouchTap={this.toggleChatBox}
              onTitleTouchTap={this.toggleChatBox}
            />
          :
            <AppBar
              style={style.chatBoxHeader}
              title={<span style={style.title}>Chat</span>}
              showMenuIconButton={false}
              onTitleTouchTap={this.toggleChatBox}

            />
        }


        {this.props.isChatBoxOpen ? messages : <span />}

      </List>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChatBoxOpen: true,
    }
  }

  toggleChatBoxOpen = () => this.setState({isChatBoxOpen: !this.state.isChatBoxOpen})

  render() {

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
          <AppBar
            title="Typing Frenzy Experiment"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            showMenuIconButton={false}
          />
          <Paper style={style.paper} zDepth={3}>
            <p>Test</p>
          </Paper>

          <ChatBox isChatBoxOpen={this.state.isChatBoxOpen} toggleChatBoxOpen={this.toggleChatBoxOpen}/>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
