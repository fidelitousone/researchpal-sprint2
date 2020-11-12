import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Project from './Project';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/" component={Landing} exact />
        <Route path="/home" component={Dashboard} />
        <Route path="/project" component={Project} />
      </Switch>
    </div>
  </BrowserRouter>, document.getElementById('root'),
);
