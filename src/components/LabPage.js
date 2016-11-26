import React, { Component } from 'react';
// import './App.css';
import _ from 'lodash';
import firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

import { Grid, Row, Col } from 'react-bootstrap';

import wordsearch from 'wordsearch';

const CHAT_WINDOW_HEIGHT = '90vh'

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
      style.chatBox.height = '';
    } else {
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
      mouseDown: false,
    };
  }

  letterClicked(i, j) {
    this.props.toggleCellHighlighting(i, j);
  }

  mouseDown = (i, j, e) => {
    e.preventDefault();
    this.setState({mouseDown: true})
      let cell = this.props.wordSearch.grid[i][j];
      console.log(cell)
  }

  mouseUp = (e) => {
    e.preventDefault();
    this.setState({mouseDown: false})
  }

  mouseEnter(i, j, e) {
    if (this.state.mouseDown) {
      // console.log(`${i} ${j}`);
      let cell = this.props.wordSearch.grid[i][j];
      console.log(cell)
    }
  }

  render() {
    return (
      <div id="grid"  onMouseUp={this.mouseUp}>
        {this.state.mouseDown ? <p>Mouse down</p> : <p>Mouse up</p>}
        {this.props.wordSearch.grid.map((row, i) => {
          return (
            <div key={i} className="row">
              {row.map((cell, j) => {
                return <span onMouseEnter={this.mouseEnter.bind(this, i, j)}  onMouseDown={this.mouseDown.bind(this, i ,j)}
                  key={j} className={cell.highlight ? 'highlighted-letter' : 'letter'}
                >{cell.letter}</span>
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

class WordSearchWords extends Component {
  render() {
    return (
      <div id="word-search-words">
        <h1>Word search</h1>
        <ul>
          {this.props.words.map((word, i) => {
            return <li key={i}>{word}</li>
          })}
        </ul>
      </div>
    );
  }
}

class WordSearch extends Component {
  constructor(props) {
    super(props);
    let wordSearch = wordsearch(this.props.words, this.props.width, this.props.height);
    console.log(wordSearch);

    for (let i=0; i < wordSearch.grid.length; i++) {
      for(let j=0; j < wordSearch.grid[i].length; j++) {
        wordSearch.grid[i][j] = {
          letter: wordSearch.grid[i][j],
          highlight: false,
        }
      }
    }


    this.state = {
      wordSearch: wordSearch
    }
    this.toggleCellHighlighting = this.toggleCellHighlighting.bind(this);
  }

  toggleCellHighlighting(i, j) {
    var newWordSearch = Object.assign({}, this.state.wordSearch);
    newWordSearch.grid[i][j].highlight = !newWordSearch.grid[i][j].highlight;
    this.setState({wordSearch: newWordSearch});
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={8}>
            <WordSearchGrid wordSearch={this.state.wordSearch} toggleCellHighlighting={this.toggleCellHighlighting}/>
          </Col>
          <Col xs={6} md={4}>
            <WordSearchWords words={this.props.words.filter((word) => {
              return !_.includes(this.state.wordSearch.unplaced, word);
            })}/>
          </Col>
        </Row>
      </Grid>
    );

  }
}


export default class LabPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChatBoxOpen: false,
    }
  }

  toggleChatBoxOpen = () => this.setState({isChatBoxOpen: !this.state.isChatBoxOpen})

  componentDidMount() {
    firebase.database().ref('wordSearch').set({
      words: ['christmas', 'cookies', 'gingerbread', 'tree', 'bells', 
        'snowman', 'santa', 'star', 'ornament', 'reindeer', 'stockings',
        'rudolph', 'dasher', 'dancer', 'prancer', 'vixen', 'comet',
        'cupid', 'donner', 'blitzen', 'carols', 'december', 'family',
        'mistletoe', 'snowflake', 'eggnog', 'holiday', 'decorations',
        'holly', 'chimney', 'wreath', 'merry', 'candycane', 'lights',
        'elf', 'peace'
      ],
      height: 25,
      width: 25
    })
    firebase.database().ref('wordSearch').on('value', (snapshot) => {
      this.setState({wordSearchParams: snapshot.val()});
    });
  }

  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('wordSearch').off();
  }

  render() {
    return (

        <div>       
          {this.state.wordSearchParams ? 
            <WordSearch words={this.state.wordSearchParams.words} height={this.state.wordSearchParams.height} width={this.state.wordSearchParams.width}/>
            : <p>Loading</p>
          }
          <ChatBox isChatBoxOpen={this.state.isChatBoxOpen} toggleChatBoxOpen={this.toggleChatBoxOpen}/>
        </div>
      
    );
  }
}
