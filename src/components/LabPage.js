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

import wordsearch from '../helpers/wordsearch';

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
      selectedLetters: [],
      solvedLetters: []
    };
  }

  letterClicked(i, j) {
    this.props.toggleCellHighlighting(i, j);
  }

  mouseDown = (i, j, e) => {
    e.preventDefault();
    this.setState({mouseDown: true}, () => {
      this.mouseEnter(i, j);
    });
  }

  mouseUp = (e) => {
    e.preventDefault();
    this.setState({mouseDown: false})

    // unhighlight letters in queue
    this.state.selectedLetters.forEach((cell) => {
      this.props.toggleCellHighlighting(cell.i, cell.j);
    });

    if(this.props.checkAnswer(this.state.selectedLetters)) {
      // selected region is a word`
      this.setState({
        solvedLetters: this.state.selectedLetters
      })
    } else {
      // selected region is not a word
    }

    // reset queue in state
    this.setState({
      selectedLetters: []
    });
  }

  mouseEnter(i, j, e) {
    if (this.state.mouseDown) {
      // select letter
      let cell = this.props.wordSearch.grid[i][j];

      // if combined queue in state is a valid answer:
      //    highlight

      // else mark letter
      this.props.toggleCellHighlighting(i, j);

      // add letter to queue in state
      this.setState({
        selectedLetters: _.concat(this.state.selectedLetters, cell)
      });
    }
  }

  getCellClass = (cell) => {
    console.log(`"${this.props.wordSearch.solved[cell.i][cell.j]}"`)
    let solutionCell = this.props.wordSearch.solved[cell.i][cell.j];
    if (solutionCell.trim()) {
      return 'highlighted-letter'
    }
    return 'letter'
  }

  render() {
    return (
      <div id="grid"  onMouseUp={this.mouseUp}>
        {this.props.wordSearch.grid.map((row, i) => {
          return (
            <div key={i} className="row">
              {row.map((cell, j) => {
                return <span onMouseEnter={this.mouseEnter.bind(this, i, j)}  onMouseDown={this.mouseDown.bind(this, i ,j)}
                  key={j} className={this.getCellClass(cell)}
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
          i: i,
          j: j
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

  // take in array of cells (in order of selection)
  // and check if they are an actual answer in the solved grid
  checkAnswer = (selectedRegion) => {
    let directionA = selectedRegion.reduce((word, cell) => {
      return word + cell.letter
    }, '');

    if (_.includes(this.props.words, directionA)) {
      console.log(directionA)
    }

    selectedRegion.reverse();

    let directionB = selectedRegion.reduce((word, cell) => {
      return word + cell.letter
    }, '');

    if(_.includes(this.props.words, directionB)) {
      console.log(directionB)
    }
    return false;
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={8}>
            <WordSearchGrid wordSearch={this.state.wordSearch} toggleCellHighlighting={this.toggleCellHighlighting}
              checkAnswer={this.checkAnswer}
            />
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
