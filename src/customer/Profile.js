import React, { Component, Fragment } from "react";
import Navbar from "./Navbar.js";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  logOut(event) {
    event.preventDefault();
    Cookies.remove("usertoken");
    this.forceUpdate();
  }

  render() {
    if (Cookies.get("usertoken")) {
      return (
        <Fragment>
          <Navbar />
          <br />
          <br />
          <br />
          <br />
          <div className="container">
            Profile Page
            <button className="btn" onClick={this.logOut}>
              Log out
            </button>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login" />;
    }
  }
}
