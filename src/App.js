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

import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

// var wordsearch = require('wordsearch');
import wordsearch from 'wordsearch';

const CHAT_WINDOW_HEIGHT = '90vh'

const WORD_SEARCH = {
  words: [
    'research', 'science', 'tech', 'model', 'anova', 'kazoo', 'theory',
    'UX', 'design', 'context', 'stats'
  ],
  width: 10,
  height: 10
}

let style = {
  paper: {
    height: '60vh',
    width: '100vw',
    textAlign: 'center',
    display: 'block',
  },

  chatBox: {
    display: 'block',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    width: '90vw',
    
    height: '',
    marginLeft: 'auto',
    marginRight: 'auto',
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
  },
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
      style.chatBox.height = CHAT_WINDOW_HEIGHT;
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
              title={
                <span style={style.title}>Chat (4)</span>
              }
              showMenuIconButton={false}
              onTitleTouchTap={this.toggleChatBox}
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

class WordSearchGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordSearch: wordsearch(this.props.words, this.props.width, this.props.height)
    }
    // search.grid.forEach(function(row) { console.log(row.join(' ')); } );
    this.state.wordSearch.solved.forEach(function(row) { console.log(row.join(' ')); } );
  }


  render() {
    console.log(this.state.wordSearch);
    return (
      <div id="grid">
        {this.state.wordSearch.solved.map((row, i) => {
          return (
            <div key={i} className="row">
              {row.map((letter, i) => {
                return <span key={i} className="letter">{letter}</span>
              })}
            </div>
          )

        })}
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChatBoxOpen: false,
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

          <WordSearchGrid words={WORD_SEARCH.words} height={WORD_SEARCH.height} width={WORD_SEARCH.width}/>

          <ChatBox isChatBoxOpen={this.state.isChatBoxOpen} toggleChatBoxOpen={this.toggleChatBoxOpen}/>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
