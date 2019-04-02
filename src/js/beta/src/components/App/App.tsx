import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import WriteRoute from '../WriteRoute/WriteRoute';
import ProjectsRoute from '../ProjectsRoute/ProjectsRoute';
import ReviewRoute from '../ReviewRoute/ReviewRoute';
import Header from '../Header/Header';

import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route path="/projects" component={ProjectsRoute} />
          <Route path="/write" component={WriteRoute} />
          <Route path="/review" component={ReviewRoute} />
        </Switch>
      </div>
    );
  }
}

export default App;
