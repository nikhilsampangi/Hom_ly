import React, { Component, Fragment } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import FrontPage from "./front_page/FrontPage";

import Chef_login from "./authentication/Chef_login";
import Chef_reg from "./authentication/Chef_reg";
import ChProfile from "./chef/ChProfile";
import ChProf_edit from "./chef/ChProf_edit";
import Validate from "./chef/Validation";
import ChContracts from "./chef/ChContracts";
import ChMenu from "./chef/ChMenu";
import ChAnalytics from "./chef/ChAnalytics";
import Feedbacks from "./chef/Feedbacks";

import Cust_login from "./authentication/Cust_login";
import Cust_reg from "./authentication/Cust_reg";
import Cust from "./customer/Cust";
import Wlt from "./customer/Wallet";
import Abt from "./customer/About";
import Prof from "./customer/Profile";
import Prof_edit from "./customer/EditProfile";
import Fdbck from "./customer/Feedback";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" component={FrontPage} />
            {/* Authentication */}
            <Route exact path="/Login" component={Cust_login} />
            <Route exact path="/Register" component={Cust_reg} />
            <Route exact path="/Chef/Login" component={Chef_login} />
            <Route exact path="/Chef/Register" component={Chef_reg} />
            {/* Chef url's */}
            <Route exact path="/Chef/Profile" component={ChProfile} />
            <Route exact path="/Chef/Profile/Edit" component={ChProf_edit} />
            <Route exact path="/Chef/Validate" component={Validate} />
            <Route exact path="/Chef/Contracts" component={ChContracts} />
            <Route exact path="/Chef/Menu" component={ChMenu} />
            <Route exact path="/Chef/Analytics" component={ChAnalytics} />
            <Route
              exact
              path="/Chef/Analytics/Feedbacks"
              component={Feedbacks}
            />
            {/* Customer url's */}
            <Route exact path="/Home" component={Cust} />
            <Route exact path="/Wallet" component={Wlt} />
            <Route exact path="/About" component={Abt} />
            <Route exact path="/Profile" component={Prof} />
            <Route exact path="/Profile/Edit" component={Prof_edit} />
            <Route exact path="/Feedback" component={Fdbck} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}
