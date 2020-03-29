import React, { Component, Fragment } from "react";
// import { Link } from "react-router-dom";
import "./Cust.css";
import Navbar from "./Navbar";
import change_bg from "../index";

export default class Cust extends Component {
  render() {
    return (
      <Fragment onLoad={change_bg("cust_hm")}>
        <Navbar />
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
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
