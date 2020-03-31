import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import "./Cust.css";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import change_bg from "../index";

export default class Cust extends Component {
  render() {
    if (Cookies.get("usertoken")) {
      return (
        <Fragment>
          <Navbar onLoad={change_bg("cust_hm")} homePage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container" style={{ textAlign: "-moz-center" }}>
            <SearchBar />
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login"></Redirect>;
    }
  }
}

class SearchBar extends Component {
  render() {
    return (
      <Fragment>
        <div className="input-group mb-3" style={{ width: "80%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="search food item or chefs"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
