import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import Cookies from "js-cookie";
import change_bg from "../index";

export default class ChMenu extends Component {
  constructor() {
    super();
  }

  componentDidMount(event) {
    change_bg("chf_hm");
  }

  render() {
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar menuPage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container" style={{ textAlign: "-moz-center" }}>
            Chef Menu Page
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login"></Redirect>;
    }
  }
}
