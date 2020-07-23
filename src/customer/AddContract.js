import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import DatePicker from "react-date-picker";
import change_bg from "../index";
import Axios from "axios";
import Cookies from "js-cookie";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";

export default class AddContract extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      descr: "",
      type: 0,
      date: new Date(),
      responseFlag: false,
      errFlag: false,
      resMsg: "",
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
    })
      .then((res) => {
        this.setState({
          responseFlag: true,
          resMsg: res.data.msg,
        });
      })
      .catch((err) => {
        this.setState({
          responseFlag: true,
          errFlag: true,
          resMsg: err.data.err,
        });
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
        <Modal
          open={this.state.responseFlag}
          onClose={() => this.setState({ responseFlag: false })}
          closeOnOverlayClick={true}
        >
          <div className="container" style={{ width: "35vw", padding: "5%" }}>
            <div className="card text-center">
              <div
                className="card-header"
                style={{
                  fontSize: "x-large",
                }}
              >
                {this.state.errFlag ? (
                  <span className="text-danger">Error</span>
                ) : (
                  <span className="text-info">Info</span>
                )}
              </div>
              <div className="card-body" style={{ padding: "10%" }}>
                {this.state.resMsg}
                <br />
                <Link to="/Profile">Back to Profile &gt;</Link>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}
