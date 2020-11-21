import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Project from './Project';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/" component={Landing} exact />
        <Route path="/home" component={Dashboard} />
        <Route path="/project" component={Project} />
      </Switch>
    </div>
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
