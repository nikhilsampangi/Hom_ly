import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import change_bg from "../index";
import Axios from "axios";
import Cookies from "js-cookie";

export default class ViewContracts extends Component {
  componentDidMount() {
    change_bg("cust_hm");
    Axios.get("/customer/get_contracts", {
      headers: { Authorization: Cookies.get("usertoken") },
    })
      .then((res) => {})
      .catch((err) => {});
  }

  render() {
    return (
      <Fragment>
        <Navbar />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="row">
          <div className="col-1"></div>
          <div className="col">
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="card-title">
                <h3>Contracts Initiated</h3>
              </div>
              <br />
              <br />
              <div className="card-body"></div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="card-title">
                <h3>Contracts Approved</h3>
              </div>
              <br />
              <br />
              <div className="card-body"></div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="card-title">
                <h3>Contracts Delivered</h3>
              </div>
              <br />
              <br />
              <div className="card-body"></div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </Fragment>
    );
  }
}
