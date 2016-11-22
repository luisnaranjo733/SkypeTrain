import React, { Component } from 'react';
import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <AppBar
        title="Typing Frenzy Experiment"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
        showMenuIconButton={false}
      />
      </MuiThemeProvider>
    );
  }
}

export default App;
