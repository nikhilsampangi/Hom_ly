import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import Modal from "react-responsive-modal";
import axios from "axios";
import change_bg from "../index";
import "./Chef_reg.css";

export default class Chef_reg extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      hashedPassword: "",
      confirmPassword: "",
      bio: "",
      specialities: "",
      authenticated: false,
      errorFlag: false,
      errMsg: "",
      otpFlag: false,
      otp: "",
      otpErr: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestOTP = this.requestOTP.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    if (this.state.hashedPassword !== this.state.confirmPassword) {
      this.setState({
        errorFlag: true,
        errMsg: "Password and Confirm Password Fields do not match",
      });
    } else {
      const newChef = {
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        phoneNumber: this.state.phone,
        email: this.state.email,
        hashedPassword: this.state.hashedPassword,
        bio: this.state.bio,
        specialities: this.state.specialities,
      };

      axios
        .post("/chef/register", newChef)
        .then((res) => {
          if (res.data.status === "1") {
            // otp verification step
            this.setState({ otpFlag: true });
            console.log(res.data.message);
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          this.setState({
            errorFlag: true,
            errMsg: String(err.response.data.message),
          });
        });
    }
    event.preventDefault();
  }

  // send_otp api for resending otp...
  requestOTP() {
    this.setState({ otpErr: false });
    axios
      .post("/chef/send_otp", { email: this.state.email })
      .then((res) => {
        // load otp component
        this.setState({ otpFlag: true });
        console.log(res.data);
      })
      .catch((err) => {
        this.setState({
          errorFlag: true,
          errMsg: String(err.response.data.message),
        });
        // console.log(err.response.data.message);
      });
  }

  verifyOTP() {
    axios
      .post("/chef/verify_registration_otp", {
        email: this.state.email,
        OTP: this.state.otp,
      })
      .then((res) => {
        this.setState({ authenticated: true });
        console.log(res.data);
      })
      .catch((err) => {
        // ask user for resending otp...
        this.setState({ otpErr: true });
        console.log(err.response.data.message);
      });
  }

  render() {
    if (this.state.authenticated) {
      return <Redirect to="/Chef/Profile" />;
    }
    return (
      <Fragment>
        <form onLoad={change_bg("chf_rg")}>
          {/* error display modal */}
          <Modal
            open={this.state.errorFlag}
            onClose={() => this.setState({ errorFlag: false })}
            closeOnOverlayClick={true}
          >
            <div className="container" style={{ width: "35vw", padding: "5%" }}>
              <div className="card text-center border-danger">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    fontSize: "x-large",
                  }}
                >
                  Error
                </div>
                <div className="card-body" style={{ padding: "10%" }}>
                  {this.state.errMsg}
                </div>
              </div>
            </div>
          </Modal>
          {/* OTP verfication modal */}
          <Modal
            open={this.state.otpFlag}
            closeOnOverlayClick={true}
            onClose={() => this.setState({ otpFlag: false })}
            style={{ padding: "0" }}
          >
            <div className="container" style={{ width: "35vw", padding: "0" }}>
              <div className="card text-center border-light">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "rgb(86,88,255)",
                    color: "white",
                  }}
                >
                  Verification
                </div>
                {this.state.otpErr ? (
                  <div className="card-body">
                    <span className="text-danger">
                      Error: OTP is incorrect{" "}
                      <button
                        className="btn btn-outline danger btn-sm"
                        onClick={this.requestOTP}
                      >
                        Resend OTP?
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="card-body">
                    <span>We've sent an OTP to the email id you specified</span>
                    <br />
                    <br />
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter OTP"
                      name="otp"
                      value={this.state.otp}
                      onChange={this.handleChange}
                    />
                    <br />
                    <button
                      className="btn btn-outline-dark btn-block"
                      onClick={this.verifyOTP}
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Modal>
          <div className="row">
            <div
              className="col-6"
              style={{ padding: "3%", marginTop: "200px" }}
            >
              <Link to="/">&lt;&lt;&nbsp;Back to Front Page</Link>
              <h2 className="signin">Register</h2>
              <hr />
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    name="firstname"
                    value={this.state.firstname}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    name="lastname"
                    value={this.state.lastname}
                    onChange={this.handleChange}
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
                    name="phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E-mail"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
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
                    name="hashedPassword"
                    value={this.state.hashedPassword}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-type Password"
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <br />
              <div>
                {/* Need to add : google maps integration */}
                <span
                  style={{ fontSize: "large", color: "rgb(117, 115, 116)" }}
                >
                  Address :&nbsp;
                </span>
                <button className="btn btn-outline-dark btn-sm">
                  <i className="fas fa-map-marker-alt"></i>&nbsp;Detect Location
                </button>
              </div>
            </div>
            <div
              className="col-6"
              style={{
                padding: "3%",
                marginTop: "294px",
                borderLeft: "2px solid #ededed",
              }}
            >
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Professional Cooking Experience (if any)"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.handleChange}
                />
              </div>
              <br />
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Speciality Recipes (optional)"
                  name="specialities"
                  value={this.state.specialities}
                  onChange={this.handleChange}
                />
              </div>
              <br />
              {/* Need to add : upload file feature */}
              {/* <div>
                <span
                  style={{ fontSize: "large", color: "rgb(117, 115, 116)" }}
                >
                  Upload few sample pictures of your Food Dishes :&nbsp;
                </span>
                &nbsp;&nbsp;&nbsp;
                <button className="btn btn-outline-dark btn-sm">
                  <i class="fas fa-upload"></i>&nbsp;Upload Images
                </button>
              </div> */}
            </div>
          </div>
          <div className="row">
            <div className="col-6" style={{ paddingLeft: "3%" }}>
              <button
                onClick={this.handleSubmit}
                className="btn btn-outline-dark btn-block"
              >
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
