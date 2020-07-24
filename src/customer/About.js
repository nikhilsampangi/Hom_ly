import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import change_bg from "../index";
import Cookies from "js-cookie";

export default class About extends Component {
  render() {
    if (Cookies.get("usertoken")) {
      return (
        <Fragment>
          <Navbar aboutPage={true} />
          <br />
          <br />
          <br />
          <br />
          <div className="container" onLoad={change_bg("cust_hm")}>
            <div className="row">
              <div
                className="col"
                style={{ fontFamily: "Josefin Sans, sans-serif" }}
              >
                <h2>About Us</h2>
              </div>
            </div>
            <br />
            <br />
            <div
              className="row"
              style={{ fontFamily: "Josefin Sans, sans-serif" }}
            >
              <div className="col"></div>
              <div className="col-8">
                <div className="row">
                  <center>
                    <h1>
                      Enterprise Application Development <br />
                      Group Code: EAD124
                    </h1>
                  </center>
                </div>
                <br />
                <br />
                <div className="row" style={{ fontFamily: "Sen" }}>
                  <div className="col">
                    <div className="row" style={{ textAlign: "center" }}>
                      <i className="fa fa-user-alt"></i>
                    </div>
                    <div className="row">
                      <center>Kevin John</center>
                    </div>
                    <div className="row">S20170010070</div>
                  </div>
                  <div className="col">
                    <div className="row" style={{ textAlign: "center" }}>
                      <i className="fa fa-user-alt"></i>
                    </div>
                    <div className="row">Nikhil Sampangi</div>
                    <div className="row">S20170010136</div>
                  </div>
                  <div className="col">
                    <div className="row" style={{ textAlign: "center" }}>
                      <i className="fa fa-user-alt"></i>
                    </div>
                    <div className="row">Sandepogu Bharath</div>
                    <div className="row">S20170010137</div>
                  </div>
                  <div className="col">
                    <div className="row" style={{ textAlign: "center" }}>
                      <i className="fa fa-user-alt"></i>
                    </div>
                    <div className="row">Shiva Sai Charan</div>
                    <div className="row">S20170010130</div>
                  </div>
                </div>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login" />;
    }
  }
}
