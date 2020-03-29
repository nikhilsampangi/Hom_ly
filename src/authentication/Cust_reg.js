import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import Modal from "react-responsive-modal";
import axios from "axios";
import change_bg from "../index";

export default class Cust_reg extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      hashedPassword: "",
      confirmPassword: "",
      authenticated: false,
      errorFlag: false,
      errMsg: "",
      otpFlag: false,
      otp: "",
      otpErr: false
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
    const newUser = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      hashedPassword: this.state.hashedPassword,
      email: this.state.email,
      phonenumber: this.state.phone
    };

    if (this.state.hashedPassword !== this.state.confirmPassword) {
      this.setState({
        errorFlag: true,
        errMsg: "Password and Confirm Password Fields do not match"
      });
    } else {
      // register api call
      axios
        .post("/customer/register", newUser)
        .then(res => {
          //  this.props.history.push('/login')

          // check for status err.message.data.status
          const res_data = res.data;
          if (res_data.status === "1") {
            // ask customer to send otp to mail and call otp api and load otp component....
            this.requestOTP();
            console.log(res_data.status);
            console.log(res_data.message);
          } else {
            // displaying response data...
            // this.setState({ authenticated: true });
            console.log(res_data.message);
          }
        })
        .catch(err => {
          this.setState({
            errorFlag: true,
            errMsg: err.response.data.message
          });
          // console.log(err.response.data.message);
        });

      // reset password api

      // axios.post("/customer/reset_password", {email: this.state.email, newPassword: this.state.newPassword})
      // .then(res => {
      //   console.log(res.data);
      // })
      // .catch(err=>{
      //   ask user for resending otp....
      //   console.log(err.response.data.message);
      // })
    }
    event.preventDefault();
  }

  // send_otp api for resending otp...
  requestOTP() {
    this.setState({ otpErr: false });
    axios
      .post("/customer/send_otp", { email: this.state.email })
      .then(res => {
        // load otp component
        this.setState({ otpFlag: true });
        console.log(res.data);
      })
      .catch(err => {
        this.setState({
          errorFlag: true,
          errMsg: String(err.response.data.message)
        });
        // console.log(err.response.data.message);
      });
  }

  verifyOTP() {
    axios
      .post("/customer/verify_otp", {
        email: this.state.email,
        OTP: this.state.otp
      })
      .then(res => {
        this.setState({ authenticated: true });
        console.log(res.data);
      })
      .catch(err => {
        // ask user for resending otp...
        this.setState({ otpErr: true });
        console.log(err.response.data.message);
      });
  }

  render() {
    if (this.state.authenticated) {
      return <Redirect to="/Home" />;
    }
    return (
      <Fragment>
        <div
          className="row"
          style={{ height: "100vh" }}
          onLoad={change_bg("cust_lg")}
        >
          <div className="col-6" style={{ padding: "4%", marginTop: "90px" }}>
            <h3 className="signin">Sign Up</h3>
            <br />
            <form className="text-center" style={{ color: "#757575" }}>
              {/* error display modal */}
              <Modal
                open={this.state.errorFlag}
                onClose={() => this.setState({ errorFlag: false })}
                closeOnOverlayClick={true}
              >
                <div
                  className="container"
                  style={{ width: "35vw", padding: "5%" }}
                >
                  <div className="card text-center border-danger">
                    <div
                      className="card-header"
                      style={{ backgroundColor: "#dc3545", color: "white" }}
                    >
                      Error
                    </div>
                    <div className="card-body">{this.state.errMsg}</div>
                  </div>
                </div>
              </Modal>
              {/* OTP verfication modal */}
              <Modal
                open={this.state.otpFlag}
                closeOnOverlayClick={false}
                onClose={() => this.setState({ errorFlag: false })}
              >
                <div
                  className="container"
                  style={{ width: "35vw", padding: "5%" }}
                >
                  <div className="card text-center border-light">
                    <div
                      className="card-header"
                      style={{ backgroundColor: "#dc3545", color: "white" }}
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
                        We've sent an OTP to your email id
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          name="otp"
                          value={this.state.otp}
                          onChange={this.handleChange}
                        />
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
                    placeholder="Re-type password"
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>

              <button
                className="btn btn-outline-dark btn-rounded btn-block my-4 waves-effect z-depth-0"
                onClick={this.handleSubmit}
              >
                Register
              </button>

              <p>
                <Link className="btn btn-sm btn-info" to="/ResetPassword">
                  Forgot Password?
                </Link>
                <br />
                Already have an account?&nbsp;
                <Link to="/Login">Login</Link>
              </p>
            </form>
          </div>
          <div className="col-6" />
        </div>
      </Fragment>
    );
  }
}
