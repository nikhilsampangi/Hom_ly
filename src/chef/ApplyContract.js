import React, { Component, Fragment } from "react";
import ChNavbar from "./ChNavbar";

export default class ApplyContract extends Component {
  render() {
    return (
      <Fragment>
        <ChNavbar contractsPage={true} />
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
                <h3>Customer Chat Screen</h3>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </Fragment>
    );
  }
}
