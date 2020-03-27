import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import Modal from "react-responsive-modal";
import axios from 'axios';

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
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      hashedPassword: "",
      confirmPassword: "",
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

        axios.post("/customer/register", newUser)
        .then(res => {
          //  this.props.history.push('/login')
          this.setState({ authenticated: 1 });
          // check for status err.message.data.status
          const res_data= res.data;
          if(res_data.status==="1"){
            // ask customer to send otp to mail and call otp api and load otp component....
            console.log(res_data.status)
            console.log(res_data.message);
          }
          else{
            // displaying response data...
            console.log(res_data.message);
          }
        })
        .catch(err=>{
          console.log(err.response.data.message);
        })


        // send_otp api for resending otp... 
        // make it as a function as we need to call whenever user request otp.....

        // axios.post("/customer/send_otp", {email: this.state.email})
        // .then(res => {
        //   // load otp component
        //   console.log(res.data);  
        // })
        // .catch(err=>{
        //   console.log(err.response.data.message);
        // })


        // verify_OTP api
        
        // axios.post("/customer/verify_otp", {email: this.state.email, OTP: this.state.OTP})
        // .then(res => {
        //   load component which user requested (ex:- forgot password component)
        //   console.log(res.data);  
        // })
        // .catch(err=>{
        //   ask user for resending otp...
        //   console.log(err.response.data.message);
        // })

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
  render() {
    if (this.state.authenticated === 1) {
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
            <form
              onSubmit={this.handleSubmit}
              method="post"
              className="text-center"
              style={{ color: "#757575" }}
            >
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
