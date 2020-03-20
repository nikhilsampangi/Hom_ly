import React, { Component, Fragment } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import FrontPage from "./front_page/FrontPage";

import Chef_login from "./authentication/Chef_login";
import Chef_reg from "./authentication/Chef_reg";
import Chef from "./chef/Chef";

import Cust_login from "./authentication/Cust_login";
import Cust_reg from "./authentication/Cust_reg";
import Cust from "./customer/Cust";
import Wlt from "./customer/Wallet";
import Abt from "./customer/About";
import Prof from "./customer/Profile";

// import PwdReset from "./front_page/PwdReset";
// import Registration from "./front_page/Register";
// import Success from "./front_page/Success";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" component={FrontPage} />
            {/* Chef url's */}
            <Route exact path="/Chef/Login" component={Chef_login} />
            <Route exact path="/Chef/Register" component={Chef_reg} />
            <Route exact path="/Chef/Home" component={Chef} />
            {/* Customer url's */}
            <Route exact path="/Login" component={Cust_login} />
            <Route exact path="/Register" component={Cust_reg} />
            <Route exact path="/Home" component={Cust} />
            <Route exact path="/Wallet" component={Wlt} />
            <Route exact path="/About" component={Abt} />
            <Route exact path="/Profile" component={Prof} />

            {/* <Route exact path="/ResetPassword" component={PwdReset} /> */}
            {/* <Route exact path="/Success" component={Success} /> */}
            {/* <Route exact path="/Register" component={Registration} /> */}
          </Switch>
        </Fragment>
      </Router>
    );
  }
}
