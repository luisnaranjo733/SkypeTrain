import React, { Component } from 'react';
import _ from 'lodash';
import { Grid, Row, Col } from 'react-bootstrap';
import wordsearch from '../helpers/wordsearch';

class WordSearchGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      selectedLetters: []
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
    this.setState({mouseDown: false});

    if(this.props.checkAnswer(this.state.selectedLetters)) {
      let word = this.state.selectedLetters.map((cell) => {
        return cell.letter
      }).join('');
      
      // update word list
      this.props.addSolvedWord(word);
      this.state.selectedLetters.forEach((cell) => {
        this.props.solveCell(cell);
      });
    } else {
      // selected region is not a word
      // unhighlight letters in queue
      this.state.selectedLetters.forEach((cell) => {
        this.props.toggleCellHighlighting(cell.i, cell.j);
      });
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

      // highlight letter
      this.props.toggleCellHighlighting(i, j);

      // add letter to queue in state
      this.setState({
        selectedLetters: _.concat(this.state.selectedLetters, cell)
      });
    }
  }

  getCellClass = (cell) => {
    if (cell.solved || cell.highlight) {
      return 'highlighted-letter';
    }
    let solutionCell = this.props.wordSearch.solved[cell.i][cell.j];
    if (solutionCell.trim() && this.props.showAnswerKey) {
      return 'solved-letter';
    } else {
      return 'letter';
    }
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
  getClassName = (word) => {
    if (word.solved) {
      return 'solved-word';
    } else {
      return 'unsolved-word';
    }
  }
  
  render() {
    return (
      <div id="word-search-words">
        {<h1>Lab variant {this.props.labVariant}</h1>}
        <ul>
          {this.props.words.map((word, i) => {
            return <li key={i} className={this.getClassName(word)}>{word.word}</li>
          })}
        </ul>
      </div>
    );
  }
}

export default class WordSearch extends Component {
  constructor(props) {
    super(props);
    let wordSearch = wordsearch(this.props.wordList, this.props.width, this.props.height);

    for (let i=0; i < wordSearch.grid.length; i++) {
      for(let j=0; j < wordSearch.grid[i].length; j++) {
        wordSearch.grid[i][j] = {
          letter: wordSearch.grid[i][j],
          highlight: false,
          solved: false,
          i: i,
          j: j
        }
      }
    }


    this.state = {
      wordSearch: wordSearch,
      words: this.props.wordList.map((word) => {
        return {
          word: word,
          solved: false
        }
      })
    }
    this.toggleCellHighlighting = this.toggleCellHighlighting.bind(this);
  }

  reverseString(s){
    return s.split("").reverse().join("");
  }

  addSolvedWord = (word) => {
    let solvedWords = _.concat(this.state.words);
    solvedWords.map((solvedWord, i) => {
      // solvedWord.solved = true; // debugging
      if (solvedWord.word === word) {
        solvedWord.solved = true;
        this.props.onWordCompleted(word);
      }
      word = this.reverseString(word);
      if (solvedWord.word === word) {
        solvedWord.solved = true;
        this.props.onWordCompleted(word);
      }
      return solvedWord;
    });
    this.setState({words: solvedWords}, () => {
      let solved = true;
      this.state.words.forEach((word) => {
        if (!word.solved && !_.includes(this.state.wordSearch.unplaced, word.word)) {
          solved = false;
        }
      });
      if (solved) {
        this.props.onWordSearchComplete();
      }
    });
  }

  solveCell = (cell) => {
    let newWordSearch = Object.assign({}, this.state.wordSearch);
    newWordSearch.grid[cell.i][cell.j].solved=true;
    this.setState({WordSearch: newWordSearch});

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
    selectedRegion.reverse();
    let directionB = selectedRegion.reduce((word, cell) => {
      return word + cell.letter
    }, '');

    return _.includes(this.props.wordList, directionA) || _.includes(this.props.wordList, directionB);
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={8}>
            <WordSearchGrid wordSearch={this.state.wordSearch} toggleCellHighlighting={this.toggleCellHighlighting}
              checkAnswer={this.checkAnswer} addSolvedWord={this.addSolvedWord} solveCell={this.solveCell}
              showAnswerKey={this.props.showAnswerKey}
            />
          </Col>
          <Col xs={6} md={4}>
            <WordSearchWords words={this.state.words.filter((word) => {
              return !_.includes(this.state.wordSearch.unplaced, word.word);
            })}
            labVariant={this.props.labVariant}/>
          </Col>
        </Row>
      </Grid>
    );

  }
}

