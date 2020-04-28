import React, { Component, Fragment } from "react";
import Navbar from "./Navbar.js";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, Redirect } from "react-router-dom";
import change_bg from "../index";
import Rating from "react-rating";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "email",
      phoneNumber: "phone",
      veg: false,
      localty: "unspecified",
      city: "",
      st: "",
      pinCode: "",
      orders: [],
    };
    this.logOut = this.logOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.handleOrders = this.handleOrders.bind(this);
  }

  componentDidMount(event) {
    change_bg("cust_hm");
    this.handleProfile();
    this.handleOrders();
  }

  handleProfile(event) {
    axios
      .get("customer/profile", {
        headers: { Authorization: Cookies.get("usertoken") },
      })
      .then((res) => {
        this.setState({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phoneNumber: res.data.phoneNum,
          veg: res.data.isVeg,
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

  handleOrders(event) {
    axios
      .get("/transaction/get_orders", {
        headers: { Authorization: Cookies.get("usertoken") },
      })
      .then((res) => {
        this.setState({
          orders: res.data,
        });
      });
  }

  logOut(event) {
    event.preventDefault();
    Cookies.remove("usertoken");
    this.forceUpdate();
  }

  render() {
    if (Cookies.get("usertoken")) {
      var recOrd = [];
      var recFdbck = [];
      for (let i = 0; i < this.state.orders.length; i++) {
        recOrd.push(
          <li style={{ marginBottom: "7px" }}>
            <span style={{ color: "dimgrey", fontSize: "small" }}>
              {this.state.orders[i].date}
            </span>
            &nbsp;-&nbsp;
            <i className="fas fa-user-circle"></i>
            &nbsp;
            {this.state.orders[i].chefName}&nbsp;-&nbsp;
            <span className="text-success">
              <i className="fas fa-rupee-sign"></i>&nbsp;
              {this.state.orders[i].amount}
            </span>
          </li>
        );
        recFdbck.push(
          <li style={{ marginBottom: "7px" }}>
            <i className="fas fa-user-circle"></i>
            &nbsp;
            {this.state.orders[i].chefName}&nbsp;-&nbsp;
            <Rating
              placeholderRating={this.state.orders[i].rating}
              readonly={true}
              emptySymbol={<i className="far fa-star"></i>}
              fullSymbol={<i className="fas fa-star"></i>}
              placeholderSymbol={<i className="fas fa-star"></i>}
            />
            &nbsp;-&nbsp;
            <span style={{ color: "dimgrey", fontSize: "small" }}>
              "{this.state.orders[i].feedBack}"
            </span>
          </li>
        );
      }

      return (
        <Fragment>
          <Navbar profilePage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container" style={{ maxWidth: "1180px" }}>
            <div className="row">
              <div className="col">
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
                          Food Preference :&nbsp;
                          {this.state.veg ? (
                            <span
                              className="text-success"
                              style={{ fontFamily: "arial", fontSize: "0.8em" }}
                            >
                              <i className="fas fa-circle"></i>&nbsp;Veg
                            </span>
                          ) : (
                            <span
                              className="text-danger"
                              style={{ fontFamily: "arial", fontSize: "0.8em" }}
                            >
                              <i className="fas fa-circle"></i>&nbsp;Non-Veg
                            </span>
                          )}
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
                            to="/Profile/Edit"
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
              <div className="col">
                <div>
                  <div
                    className="card border-danger"
                    style={{ fontFamily: "Sen" }}
                  >
                    <div
                      className="p-card-header text-danger"
                      style={{ paddingTop: "7%", paddingLeft: "5%" }}
                    >
                      <h4>
                        <i className="fas fa-heart"></i>&nbsp;Favourite Dishes
                      </h4>
                    </div>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                      }}
                    >
                      <ul>
                        <li>Dish name</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <br />
                <div>
                  <div
                    className="card border-info"
                    style={{ fontFamily: "Sen" }}
                  >
                    <div
                      className="p-card-header text-info"
                      style={{ paddingLeft: "5%", paddingTop: "7%" }}
                    >
                      <h4>
                        <i className="fas fa-heart"></i>&nbsp;Favourite Chefs
                      </h4>
                    </div>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                      }}
                    >
                      <ul>
                        <li>Chef name</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col" style={{ fontFamily: "Sen" }}>
                <div>
                  <div
                    className="card border-dark"
                    style={{ backgroundColor: "#343a40", borderRadius: "0" }}
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
                <br />
                <br />
                <div>
                  <div className="card">
                    <div
                      className="p-card-header"
                      style={{ paddingTop: "7%", paddingLeft: "5%" }}
                    >
                      <h4>Recent Orders</h4>
                    </div>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                      }}
                    >
                      <ul>{recOrd}</ul>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div>
                  <div className="card">
                    <div
                      className="p-card-header"
                      style={{ paddingTop: "7%", paddingLeft: "5%" }}
                    >
                      <h4>Recent Feedbacks and Ratings</h4>
                    </div>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                      }}
                    >
                      <ul>{recFdbck}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <button className="btn" onClick={this.logOut}>
              Log out
            </button> */}
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login" />;
    }
  }
}
