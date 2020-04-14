import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import change_bg from "../index";

export default class Validation extends Component {
  componentDidMount(event) {
    change_bg("chf_hm");
  }

  render() {
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container" style={{ textAlign: "-moz-center" }}>
            Chef's Validation Page
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login" />;
    }
  }
}
