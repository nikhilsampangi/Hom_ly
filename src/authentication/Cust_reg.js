import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Modal from "react-responsive-modal";

function change_bg(cls) {
  document
    .getElementById("bd")
    .classList.remove(document.getElementById("bd").classList[0]);
  document.getElementById("bd").classList.add(cls);
}

export default class Cust_reg extends Component {
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
    const user = {
      email: this.state.email,
      hashedPassword: this.state.hashedPassword
    };
  }
  render() {
    return (
      <Fragment onLoad={change_bg("cust_lg")}>
        <div className="row" style={{ height: "100vh" }}>
          <div className="col-6" style={{ padding: "4%", marginTop: "90px" }}>
            <h3 className="signin">Sign Up</h3>
            <br />
            <form
              onSubmit={this.handleSubmit}
              className="text-center"
              method="Post"
              style={{ color: "#757575" }}
            >
              {/* <Modal
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
              </Modal> */}
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
                    placeholder="Re-type password"
                    required
                  />
                </div>
              </div>
              <button
                className="btn btn-outline-dark btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
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
