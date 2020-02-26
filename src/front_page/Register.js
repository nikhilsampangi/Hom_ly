import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import { register } from "./userFunctions";
import Modal from "react-responsive-modal";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      hashedPassword: "",
      confirmPassword: "",
      phone: "",
      email: "",
      gender: "Prefer not to say",
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
    const newUser = {
      username: this.state.username,
      hashedPassword: this.state.hashedPassword,
      email: this.state.email,
      phone: this.state.phone,
      gender: this.state.gender,
      confirmPassword: this.state.confirmPassword
    };

    if (this.state.hashedPassword !== this.state.confirmPassword) {
      this.setState({
        errorFlag: true,
        errMsg: "Password and Confirm Password Fields do not match"
      });
    } else {
      register(newUser)
        .then(res => {
          console.log(res.status);
          if (res.status) {
            // this.props.history.push('/login')
            this.setState({ authenticated: 1 });
            // console.log(res.data)
          } else {
            this.setState({ errorFlag: true, errMsg: res.error });
            // console.log(res.error)
          }
        })
        .catch(err => {
          console.log("error:-" + err);
        });
    }
    event.preventDefault();
  }

  render() {
    return (
      <Fragment>
        <Modal
          open={this.state.errorFlag}
          onClose={() => this.setState({ errorFlag: false })}
          closeOnOverlayClick={true}
        >
          <div className="container" style={{ width: "35vw", padding: "5%" }}>
            <div className="card text-center">
              <div className="card-header">Error</div>
              <div className="card-body">{this.state.errMsg}</div>
            </div>
          </div>
        </Modal>
        <div className="row" style={{ height: "100vh" }}>
          <div className="col-6" />
          <div className="col-6" style={{ padding: "4%", marginTop: "90px" }}>
            <h3 className="signin">Sign Up</h3>
            <br />
            <form
              // onSubmit={this.onSubmit}
              className="text-center"
              style={{ color: "#757575" }}
            >
              <div className="form-row">
                <div className="col">
                  <input
                    type="text"
                    id="materialLoginFormEmail"
                    className="form-control"
                    name="username"
                    placeholder="First Name"
                    // onChange={this.onChange}
                    // value={username}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    id="materialLoginFormEmail"
                    className="form-control"
                    name="username"
                    placeholder="Last Name"
                    // onChange={this.onChange}
                    // value={username}
                  />
                </div>
              </div>
              <br />
              <div className="form-row">
                <input
                  className="form-control"
                  id="signup-email"
                  type="text"
                  name="email"
                  placeholder="Email id"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <br />
              <div className="form-row">
                <input
                  type="password"
                  id="materialLoginFormPassword"
                  className="form-control"
                  name="hashedPassword"
                  placeholder="Password"
                  value={this.state.hashedPassword}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <br />
              <div className="form-row">
                <input
                  type="password"
                  id="materialLoginFormPassword"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <button
                className="btn btn-outline-dark btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
              >
                Sign Up
              </button>
              <p>
                Already have an account?&nbsp;
                <Link to="/">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}
