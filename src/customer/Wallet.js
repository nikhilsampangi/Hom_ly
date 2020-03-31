import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Cookies from "js-cookie";

export default class Wallet extends Component {
  render() {
    if (Cookies.get("usertoken")) {
      return (
        <Fragment>
          <Navbar />
          <br />
          <br />
          <br />
          <br />
          <div className="container">Wallet Page</div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login" />;
    }
  }
}
