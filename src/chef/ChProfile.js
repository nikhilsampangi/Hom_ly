import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import change_bg from "../index";
import "./ChProfile.css";
import Rating from "react-rating";
import Switch from "react-switch";
import { ReactComponent as Veg } from "../assets/Veg.svg";
import { ReactComponent as NonVeg } from "../assets/Nonveg.svg";

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
      level: false,
      status: false,
      rating: 0,
      numR: 0,
      arr: [],
    };
    this.logOut = this.logOut.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.handleStateCheck = this.handleStateCheck.bind(this);
    this.getRatings = this.getRatings.bind(this);
  }

  componentDidMount(event) {
    change_bg("chf_hm");
    this.handleProfile();
    this.getRatings();
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
          level: res.data.expertiseLevel,
          status: res.data.workingStatus,
          arr: res.data.menu,
        });
        try {
          this.setState({
            localty: res.data.Address[0].Localty,
            city: res.data.Address[0].City,
            st: res.data.Address[0].State,
            pinCode: res.data.Address[0].Pincode,
          });
        } catch (err) {
          console.log(err);
        }
      });
  }

  handleStateCheck(event) {
    const status_upd = {
      email: this.state.email,
      status: !this.state.status,
    };
    axios
      .post("chef/update_status", status_upd)
      .then(this.setState({ status: !this.state.status }));
  }

  getRatings(event) {
    axios
      .get("/transaction/chef_rating", {
        headers: { Authorization: Cookies.get("cheftoken") },
      })
      .then((res) => {
        var len = res.data.length;
        var temp = 0;
        for (let i = 0; i < len; i++) {
          temp = temp + res.data[i].rating;
        }
        temp = temp / len;
        this.setState({
          rating: temp,
          numR: len,
        });
      });
  }

  logOut(event) {
    event.preventDefault();
    Cookies.remove("cheftoken");
    this.forceUpdate();
  }

  render() {
    var items = [];
    for (let i = 0; i < this.state.arr.length; i++) {
      items.push(
        <Item
          name={this.state.arr[i].itemName}
          cost={this.state.arr[i].itemCost}
          descr={this.state.arr[i].itemDescr}
          isVeg={this.state.arr[i].isVeg}
        />
      );
      items.push(<br />);
    }
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar profilePage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container">
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
                      <h3>Current Orders</h3>
                    </div>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                        textAlign: "center",
                      }}
                    >
                      <ul>
                        <li>List items</li>
                        <li>List items</li>
                        <li>List items</li>
                        <li>List items</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <br />
                <br />
              </div>
              <div className="col">
                <center>
                  <h3>Menu</h3>
                </center>
                <br />
                {items}
              </div>
              <div className="col-3" style={{ fontFamily: "Sen" }}>
                <div>
                  <div className="card" style={{ fontFamily: "Sen" }}>
                    <div
                      className="p-card-body"
                      style={{
                        paddingTop: "4%",
                        paddingBottom: "7%",
                        textAlign: "center",
                      }}
                    >
                      Current Status -
                      <br />
                      {this.state.status ? (
                        <span className="text-success">
                          <i className="fas fa-pizza-slice"></i>&nbsp;Cooking
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="far fa-times-circle"></i>&nbsp;Inactive
                        </span>
                      )}
                      &nbsp;&nbsp;&nbsp;
                      <Switch
                        checked={this.state.status}
                        onChange={this.handleStateCheck}
                        height={15}
                        width={35}
                      />
                      <br />
                      <br />
                      Chef Level
                      <br />
                      <span>
                        <i className="fal fa-bread-loaf"></i>
                        {this.state.level ? (
                          <span className="text-success">
                            <i className="fas fa-trophy"></i>&nbsp;Certified
                            Chef
                          </span>
                        ) : (
                          <span className="text-primary">
                            <i className="fas fa-bread-slice"></i>&nbsp;Beginner
                          </span>
                        )}
                        <br />
                        <Link
                          to="/Chef/Validate"
                          className="btn btn-sm btn-dark"
                          style={{ borderRadius: "0", marginTop: "10px" }}
                        >
                          Get Certified
                        </Link>
                      </span>
                      <br />
                      <br />
                      Rating
                      <br />
                      <Rating
                        placeholderRating={this.state.rating}
                        readonly={true}
                        emptySymbol={<i className="far fa-star"></i>}
                        fullSymbol={<i className="fas fa-star"></i>}
                        placeholderSymbol={<i className="fas fa-star"></i>}
                      />
                      &nbsp;{this.state.rating}({this.state.numR})
                      <br />
                      <br />
                      <Link
                        to="/Chef/Analytics/Feedbacks"
                        className="btn btn-outline-info"
                        style={{ borderRadius: "0" }}
                      >
                        View Feedbacks
                      </Link>
                    </div>
                  </div>
                </div>
                <br />
                <br />
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

class Item extends Component {
  render() {
    return (
      <div className="card" style={{ fontFamily: "Sen" }}>
        <div
          className="p-card-body"
          style={{
            paddingTop: "4%",
            paddingBottom: "7%",
          }}
        >
          <div className="row" style={{ marginLeft: "0", marginRight: "0" }}>
            <div
              className="col-4"
              style={{ padding: "3%", textAlign: "center" }}
            >
              <i className="fas fa-pizza-slice" style={{ fontSize: "6em" }}></i>
            </div>
            <div className="col-8">
              <h5>{this.props.name}</h5>
              <ul style={{ color: "dimgrey" }}>
                <li>{this.props.descr}</li>
              </ul>
              {this.props.isVeg ? (
                <Veg style={{ height: "25px", width: "25px" }} />
              ) : (
                <NonVeg style={{ height: "25px", width: "25px" }} />
              )}
              <div
                className="text-success"
                style={{ textAlign: "right", paddingRight: "25px" }}
              >
                <i className="fas fa-rupee-sign"></i>&nbsp;{this.props.cost}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
