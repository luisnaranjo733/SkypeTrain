import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';

class App extends Component {

  constructor(props,context) {
    super(props, context);
    this.context = context;
  }

  goToSettings = () => {
    this.context.router.push('/admin');
  }

  goHome = () => {
    this.context.router.push('/');
  }

  render() {
    return (
      <div>
        <header>
          <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <AppBar
              title="Typing Frenzy Experiment"
              onTitleTouchTap={this.goHome}
              showMenuIconButton={false}
              iconElementRight={<FlatButton label="Settings" />}
              onRightIconButtonTouchTap={this.goToSettings}
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
App.contextTypes = {router: React.PropTypes.object};
export default App;
