import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import change_bg from "../index";

export default class Wallet extends Component {
  render() {
    if (Cookies.get("usertoken")) {
      return (
        <Fragment>
          <Navbar onLoad={change_bg("cust_hm")} walletPage={true} />
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
