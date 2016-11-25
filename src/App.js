import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


class App extends Component {

  render() {
    return (
      <div>
        <header>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <AppBar
              title="Typing Frenzy Experiment"
              iconClassNameRight="muidocs-icon-navigation-expand-more"
              showMenuIconButton={false}
            />
          </MuiThemeProvider>
        </header>
        <main>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          {this.props.children}
          </MuiThemeProvider>
        </main>
      </div>
    );
  }
}

export default App;
