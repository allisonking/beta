import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import WriteRoute from '../WriteRoute/WriteRoute';
import Header from '../Header/Header';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route path="/write" component={WriteRoute} />
        </Switch>
      </div>
    );
  }
}

export default App;
