import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import firebase from 'firebase';

class App extends Component {

  constructor(props,context) {
    super(props, context);
    this.context = context;
    this.state = {
      labVariant: '',
    }
    this.settingsRef = firebase.database().ref('settings');
  }

  componentDidMount() {
    this.settingsRef.on('value', (snapshot) => {
      this.setState({
        showAnswerKey: snapshot.val().showAnswerKey,
        labVariant: snapshot.val().labVariant,
        settingsLoaded: true,
      });
    });
  }

  componentWillUnmount() {
    //unregister listeners
    this.settingsRef.off();
  }

  goToSettings = () => {
    this.context.router.push('/admin');
  }

  goHome = () => {
    this.context.router.push('/');
  }

  setLabVariant = (variant) => {
    this.settingsRef.child('labVariant').set(variant);
    this.setState({labVariant: variant});
  }

  toggleAnswerKey = () => {
    console.log('toggle answer key')
    console.log(this.state)
    this.settingsRef.child('showAnswerKey').set(!this.state.showAnswerKey);
    this.setState({showAnswerKey: !this.state.showAnswerKey});
  }

  render() {

    let appBar;
    if (this.state.labVariant === 'v1') {
      appBar = (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <AppBar
            title="Typing Frenzy Experiment"
            onTitleTouchTap={this.goHome}
            showMenuIconButton={false}
            iconElementRight={<FlatButton label="Settings" />}
            onRightIconButtonTouchTap={this.goToSettings}
          />
        </MuiThemeProvider>
      );
    } else if (this.state.labVariant === 'v2'){
      appBar = (
        <MuiThemeProvider>
          <AppBar
            style={{
              backgroundColor: '#B71C1C',
              color: 'white'
            }}
            title="Typing Frenzy Experiment"
            onTitleTouchTap={this.goHome}
            showMenuIconButton={false}
            iconElementRight={<FlatButton label="Settings" />}
            onRightIconButtonTouchTap={this.goToSettings}
          />
        </MuiThemeProvider>
      );
    }

    return (
      <div>
        <header>
          {appBar}
        </header>
        <main>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          {this.props.children && React.cloneElement(this.props.children, {
            state: this.state,
            setLabVariant: this.setLabVariant,
            toggleAnswerKey: this.toggleAnswerKey
          })}
          </MuiThemeProvider>
        </main>
      </div>
    );
  }
}
App.contextTypes = {router: React.PropTypes.object};
export default App;
