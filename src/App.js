import React, { Component, Fragment } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import FrontPage from "./front_page/FrontPage";
import Registration from "./front_page/Register";
import Cust from "./customer/Cust";
import Chef from "./chef/Chef";
import Staff from "./transport/Staff";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" component={FrontPage} />
            <Route exact path="/Register" component={Registration} />
            <Route exact path="/Home" component={Cust} />
            <Route exact path="/Chef" component={Chef} />
            <Route exact path="/Transport" component={Staff} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}
