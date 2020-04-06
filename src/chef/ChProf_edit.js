import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import change_bg from "../index";
import Modal from "react-responsive-modal";

export default class ChProf_edit extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      localty: "",
      city: "",
      st: "",
      pinCode: "",
      bio: "",
      spec: "",
      responseFlag: false,
      response: "",
      redFlag: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  componentDidMount(event) {
    change_bg("chf_hm");
    this.handleProfile();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleProfile(event) {
    axios
      .get("chef/profile", {
        headers: { Authorization: Cookies.get("cheftoken") },
      })
      .then((res) => {
        this.setState({
          firstname: res.data.firstName,
          lastname: res.data.lastName,
          email: res.data.email,
          phone: res.data.phoneNum,
          bio: res.data.bio,
          spec: res.data.specialities,
        });
        if (res.data.Address[0]) {
          this.setState({
            localty: res.data.Address[0].Localty,
            city: res.data.Address[0].City,
            st: res.data.Address[0].State,
            pinCode: res.data.Address[0].Pincode,
          });
        }
      });
  }

  updateProfile(event) {
    const newDetails = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      phonenumber: this.state.phone,
      bio: this.state.bio,
      specialities: this.state.spec,
      localty: this.state.localty,
      city: this.state.city,
      state: this.state.st,
      pincode: this.state.pinCode,
    };
    axios
      .post("/chef/edit_profile", newDetails)
      .then(
        this.setState({
          responseFlag: true,
          response: "Details Updated Successfully",
          redFlag: true,
        })
      )
      .catch((err) => {
        this.setState({
          responseFlag: true,
          response: "Error: " + err.response.data.message,
        });
      });
  }

  render() {
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar profilePage={true} />
          <Modal
            open={this.state.responseFlag}
            onClose={() => this.setState({ responseFlag: false })}
            closeOnOverlayClick={true}
          >
            <div className="container" style={{ width: "35vw", padding: "5%" }}>
              <div className="card text-center">
                {/* <div
                      className="card-header"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        fontSize: "x-large"
                      }}
                    >
                      Error
                    </div> */}
                <div className="card-body" style={{ padding: "10%" }}>
                  {this.state.response}
                  <br />
                  {this.state.redFlag ? (
                    <Link to="/Chef/Profile">Back to Profile ></Link>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container">
            <h2>Edit Profile</h2>
            <br />
            <div>
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
                    disabled
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="bio"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Specialities"
                    name="spec"
                    value={this.state.spec}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">Address -</div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="House Name, Street Name, Localty"
                    name="localty"
                    value={this.state.localty}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    name="city"
                    value={this.state.city}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State"
                    name="st"
                    value={this.state.st}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pincode"
                    name="pinCode"
                    value={this.state.pinCode}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <br />

              <button
                className="btn btn-outline-dark btn-rounded btn-block my-4 waves-effect z-depth-0"
                onClick={this.updateProfile}
              >
                <i className="far fa-save"></i>&nbsp;Save Changes
              </button>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login" />;
    }
  }
}
