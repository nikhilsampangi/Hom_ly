import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import DatePicker from "react-date-picker";
import change_bg from "../index";
import Axios from "axios";
import Cookies from "js-cookie";

export default class AddContract extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      descr: "",
      type: 0,
      date: new Date(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDateChange = (date) => this.setState({ date });

  handleSubmit() {
    let contract = {
      contrTitle: this.state.title,
      contrType: this.state.type,
      contrDescription: this.state.descr,
      deliveryDate: this.state.date,
    };
    Axios.post("/customer/add_contract", contract, {
      headers: { Authorization: Cookies.get("usertoken") },
    });
  }

  componentDidMount() {
    change_bg("cust_hm");
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
                <h2>Post Contract</h2>
              </div>
              <br />
              <br />
              <div className="card-body">
                <div className="form-group">
                  <label>Contract Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Contract Type</label>
                  <select
                    className="form-control"
                    name="type"
                    onChange={this.handleChange}
                  >
                    <option value={0}>
                      Work from home (Cook at Chef's residence and deliver)
                    </option>
                    <option value={1}>
                      Cook at assigned place (Cook at your residence)
                    </option>
                    <option value={2}>
                      [Commercial] Cook at assigned place (For Hotels)
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contract Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="descr"
                    onChange={this.handleChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Delivery Date</label>
                  <br />
                  <DatePicker
                    onChange={this.handleDateChange}
                    value={this.state.date}
                  />
                </div>
                <br />
                <div className="form-group row">
                  <div className="col-2">
                    <button
                      className="btn btn-outline-dark btn-block"
                      style={{ borderRadius: "0" }}
                      onClick={this.handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-10"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </Fragment>
    );
  }
}
