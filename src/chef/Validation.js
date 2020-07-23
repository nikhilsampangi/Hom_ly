import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import change_bg from "../index";
import DatePicker from "react-date-picker";

export default class Validation extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
    };
    this.Validate = this.Validate.bind(this);
  }

  handleDateChange = (date) => this.setState({ date });

  Validate() {
    axios.get("/chef/validate", {
      headers: { Authorization: Cookies.get("cheftoken") },
    });
  }

  componentDidMount() {
    change_bg("chf_hm");
    // axios
    // .get("chef/profile", {
    //   headers: { Authorization: Cookies.get("cheftoken") },
    // })
    // .then((res) => {
    //     res.data.expertiseLevel
    // })
  }

  render() {
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar profilePage={true} />
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
                  <h3>Validation Test</h3>
                </div>
                <div className="card-body">
                  <p>
                    You need to prepare a dish which will be taste tested by one
                    of our professional chefs. Pick a date below when you will
                    deliver the dish
                  </p>
                  <DatePicker
                    onChange={this.handleDateChange}
                    value={this.state.date}
                  />
                  <br />
                  <br />
                  <div>
                    <button
                      className="btn btn-outline-success"
                      style={{ borderRadius: "0" }}
                      onClick={this.Validate}
                    >
                      Get Validated!
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login" />;
    }
  }
}
