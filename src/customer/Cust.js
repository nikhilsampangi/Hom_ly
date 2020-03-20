import React, { Component, Fragment } from "react";
// import { Link } from "react-router-dom";
import "./Cust.css";
import Navbar from "./Navbar";

function change_bg(cls) {
  document
    .getElementById("bd")
    .classList.remove(document.getElementById("bd").classList[0]);
  document.getElementById("bd").classList.add(cls);
}

export default class Cust extends Component {
  render() {
    return (
      <Fragment onLoad={change_bg("cust_hm")}>
        <Navbar />
        <br />
        <br />
        <br />
        <br />
        <div className="container">Home Page</div>
      </Fragment>
    );
  }
}
