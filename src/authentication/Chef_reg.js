import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
// import Modal from "react-responsive-modal";
import "./Chef_reg.css";
import change_bg from "../index";

export default class Chef_reg extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      hashedPassword: "",
      authenticated: 0,
      errorFlag: false,
      errMsg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    // const user = {
    //   email: this.state.email,
    //   hashedPassword: this.state.hashedPassword
    // };
  }

  render() {
    return (
      <Fragment onLoad={change_bg("chf_rg")}>
        <form
          onSubmit={this.handleSubmit}
          method="Post"
          // style={{ color: "#757575" }}
        >
          <div className="row">
            <div
              className="col-6"
              style={{ padding: "3%", marginTop: "200px" }}
            >
              <h2 className="signin">Register</h2>
              <hr />
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E-mail"
                    required
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-type Password"
                    required
                  />
                </div>
              </div>
              <br />
              <div>
                <span
                  style={{ fontSize: "large", color: "rgb(117, 115, 116)" }}
                >
                  Address :&nbsp;
                </span>
                <button className="btn btn-outline-dark btn-sm">
                  <i class="fas fa-map-marker-alt"></i>&nbsp;Detect Location
                </button>
              </div>
            </div>
            <div
              className="col-6"
              style={{
                padding: "3%",
                marginTop: "294px",
                borderLeft: "2px solid #ededed"
              }}
            >
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Professional Cooking Experience (if any)"
                  name="experience"
                  onChange={this.handleChange}
                />
              </div>
              <br />
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Speciality Recipes (optional)"
                  name="dishes"
                  onChange={this.handleChange}
                />
              </div>
              <br />
              <div>
                <span
                  style={{ fontSize: "large", color: "rgb(117, 115, 116)" }}
                >
                  Upload few sample pictures of your Food Dishes :&nbsp;
                </span>
                &nbsp;&nbsp;&nbsp;
                <button className="btn btn-outline-dark btn-sm">
                  <i class="fas fa-upload"></i>&nbsp;Upload Images
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6" style={{ paddingLeft: "3%" }}>
              <button type="submit" className="btn btn-dark btn-block">
                Register
              </button>
              <span>
                Already have an account?&nbsp;
                <Link to="/Chef/Login">Login</Link>
              </span>
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}
