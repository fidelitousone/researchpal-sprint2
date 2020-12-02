import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Landing from './Landing';
import About from './About';
import Pricing from './Pricing';
import Future from './Future';
import Contact from './Contact';
import Login from './Login';
import Dashboard from './Dashboard';
import Project from './Project';
import Bibliography from './Bibliography';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" component={Landing} exact />
          <Route path="/about" component={About} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/future" component={Future} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/home" component={Dashboard} />
          <Route path="/project" component={Project} />
          <Route path="/bibliography" component={Bibliography} />
        </Switch>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
