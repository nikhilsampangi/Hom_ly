import React, { Component, Fragment } from "react";
import { profile } from "./userFunctions";
import Cookies from "js-cookie";

export default class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true,
      firstname: "",
      lastname: ""
    };
  }

  handleprofile(event) {
    let prof;
    if (Cookies.get("usertoken")) {
      prof = {
        token: Cookies.get("usertoken")
      };
    }
    console.log(Cookies.get("usertoken"));
    profile(prof).then(res => {
      console.log(res);
      this.setState({
        firstname: res.data.firstname,
        lastname: res.data.lastname
      });
    });
  }

  render() {
    return (
      <Fragment>
        <div className="container" style={{ paddingTop: "60px" }}>
          Login Successful!!
          <br />
          Welcome {this.state.firstname}
        </div>
      </Fragment>
    );
  }
}
