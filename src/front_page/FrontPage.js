import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import "./FrontPage.css";
// import { login } from "../authentication/userFunctions";
import change_bg from "../index";

export default class FrontPage extends Component {
  render() {
    return (
      <Fragment>
        <div
          className="container-fluid"
          style={{ width: "100vw", height: "100vh" }}
          onLoad={change_bg("fp")}
        >
          <div
            className="row"
            style={{
              fontFamily: "Sen",
              color: "whitesmoke"
            }}
          >
            <div
              className="col-4"
              style={{
                marginTop: "50px",
                fontSize: "2.4em",
                textAlign: "left"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp; &lt;&lt; I want to cook
              <br />
            </div>
            <div className="col" />
            <div
              className="col-4"
              style={{
                marginTop: "50px",
                fontSize: "2.4em",
                textAlign: "right"
              }}
            >
              I want to eat &gt;&gt; &nbsp;&nbsp;&nbsp;&nbsp;
              <br />
            </div>
          </div>
          <div className="row" style={{ paddingTop: "30%" }}>
            <div className="col-3">
              <center>
                <Link
                  className="btn btn-light btn-lg"
                  style={{ fontSize: "x-large", opacity: "90%" }}
                  to="/Chef/Login"
                >
                  {" "}
                  <i className="fas fa-utensils"></i> Chef
                </Link>
              </center>
            </div>
            <div className="col"></div>
            <div className="col-3">
              <center>
                <Link
                  className="btn btn-light btn-lg"
                  style={{ fontSize: "x-large", opacity: "90%" }}
                  to="/Login"
                >
                  {" "}
                  <i className="fas fa-pizza-slice"></i> Explore
                </Link>
              </center>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
