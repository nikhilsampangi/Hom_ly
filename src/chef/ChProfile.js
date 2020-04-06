import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import change_bg from "../index";
import "./ChProfile.css";

export default class ChProfile extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "email",
      phoneNumber: "phone",
      localty: "not specified !!",
      city: "",
      st: "",
      pinCode: "",
      bio: "",
      spec: "",
    };
    this.logOut = this.logOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
  }

  componentDidMount(event) {
    change_bg("chf_hm");
    this.handleProfile();
  }

  handleProfile(event) {
    axios
      .get("chef/profile", {
        headers: { Authorization: Cookies.get("cheftoken") },
      })
      .then((res) => {
        this.setState({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phoneNumber: res.data.phoneNum,
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

  logOut(event) {
    event.preventDefault();
    Cookies.remove("cheftoken");
    this.forceUpdate();
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
          <div className="container" style={{ textAlign: "-moz-center" }}>
            <div className="row">
              <div className="col-4">
                <div>
                  <div className="card">
                    <div className="p-card-body">
                      <ul
                        style={{
                          paddingLeft: "0",
                          listStyleType: "none",
                          fontFamily: "Sen",
                        }}
                      >
                        <li
                          style={{
                            paddingTop: "40px",
                            fontSize: "8em",
                            textAlign: "center",
                          }}
                        >
                          <i className="fa fa-user" aria-hidden="true" />
                        </li>
                        <li style={{ fontSize: "1.5em", textAlign: "center" }}>
                          {this.state.firstName}&nbsp;{this.state.lastName}
                        </li>
                        <li
                          style={{
                            fontSize: "1.2em",
                            color: "dimgrey",
                            textAlign: "center",
                          }}
                        >
                          <i className="fa fa-envelope" aria-hidden="true" />
                          &nbsp;{this.state.email}
                        </li>
                        <li
                          style={{
                            fontSize: "1.2em",
                            color: "dimgrey",
                            textAlign: "center",
                          }}
                        >
                          <i className="fa fa-mobile" aria-hidden="true" />
                          &nbsp;{this.state.phoneNumber}
                        </li>
                        <br />
                        <li style={{ fontSize: "1.2em", padding: "4%" }}>
                          Address:
                          <br />
                          <div
                            style={{
                              fontSize: "1em",
                              color: "dimgrey",
                              textAlign: "center",
                            }}
                          >
                            {this.state.localty}
                            <br />
                            {this.state.city}
                            <br />
                            {this.state.st}
                            <br />
                            {this.state.pinCode}
                          </div>
                        </li>
                        <li style={{ fontSize: "1.2em", padding: "4%" }}>
                          Bio&nbsp;:&nbsp;
                          <span style={{ color: "dimgrey" }}>
                            {this.state.bio}
                          </span>
                        </li>
                        <li style={{ fontSize: "1.2em", padding: "4%" }}>
                          Specialities&nbsp;:&nbsp;
                          <span style={{ color: "dimgrey" }}>
                            {this.state.spec}
                          </span>
                        </li>
                        <li
                          style={{
                            fontSize: "1.2em",
                            color: "dimgrey",
                            padding: "7%",
                          }}
                        >
                          <Link
                            className="btn btn-block btn-outline-dark"
                            style={{ borderRadius: "0" }}
                            to="/Chef/Profile/Edit"
                          >
                            <i className="far fa-edit"></i>&nbsp;Edit Profile
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div>
                  <div className="card" style={{ fontFamily: "Sen" }}>
                    <div
                      className="p-card-header"
                      style={{ textAlign: "center", paddingTop: "7%" }}
                    >
                      <h3>Commercial Column</h3>
                    </div>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                        textAlign: "center",
                      }}
                    >
                      <button
                        className="btn btn-outline-info"
                        style={{ borderRadius: "0" }}
                      >
                        <i className="far fa-plus-square"></i>&nbsp;Post
                        Contracts
                      </button>
                      <br />
                      <br />
                      <button
                        className="btn btn-outline-warning"
                        style={{ borderRadius: "0" }}
                      >
                        View Contract Status
                      </button>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <br />
                <br />
              </div>
              <div className="col">Today's Menu</div>
              <div className="col-2" style={{ fontFamily: "Sen" }}>
                <div>
                  <div
                    className="card border-dark"
                    style={{ backgroundColor: "#343a40" }}
                  >
                    <div
                      className="p-card-body"
                      style={{
                        padding: "0.5%",
                        textAlign: "center",
                      }}
                    >
                      <button
                        className="btn btn-light btn-block"
                        style={{ padding: "4%", borderRadius: "0" }}
                        onClick={this.logOut}
                      >
                        <i className="fas fa-sign-out-alt"></i>&nbsp;Log-out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login" />;
    }
  }
}
