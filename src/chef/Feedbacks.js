import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import change_bg from "../index";
import Rating from "react-rating";

export default class Feedbacks extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.getFbs = this.getFbs.bind(this);
  }
  componentDidMount(event) {
    change_bg("chf_hm");
    this.getFbs();
  }

  getFbs(event) {
    axios
      .get("/transaction/chef_fbs", {
        headers: { Authorization: Cookies.get("cheftoken") },
      })
      .then((res) => {
        this.setState({
          data: res.data,
        });
      });
  }

  render() {
    if (Cookies.get("cheftoken")) {
      var fbs = [];
      for (let i = 0; i < this.state.data.length; i++) {
        fbs.push(
          <Fb
            rating={this.state.data[i].rating}
            date={this.state.data[i].date}
            fb={this.state.data[i].feedBack}
            items={this.state.data[i].items}
          />
        );
        fbs.push(<br />);
      }

      return (
        <Fragment>
          <ChNavbar analyticsPage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container">{fbs}</div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login" />;
    }
  }
}

class Fb extends Component {
  render() {
    var temp = [];
    for (let i = 0; i < this.props.items.length; i++) {
      temp.push(
        <li>
          {this.props.items[i].itemQnty}x&nbsp;{this.props.items[i].itemName}
        </li>
      );
    }
    return (
      <Fragment>
        <div className="row">
          <div className="col-1" />
          <div className="col">
            <div className="card" style={{ fontFamily: "Sen" }}>
              <div
                className="p-card-body"
                style={{
                  padding: "2%",
                }}
              >
                <div
                  className="row"
                  style={{ marginLeft: "0", marginRight: "0" }}
                >
                  <div
                    className="col-2"
                    style={{ padding: "1%", textAlign: "center" }}
                  >
                    <Rating
                      placeholderRating={this.props.rating}
                      readonly={true}
                      emptySymbol={<i className="far fa-star fa-lg"></i>}
                      fullSymbol={<i className="fas fa-star fa-lg"></i>}
                      placeholderSymbol={<i className="fas fa-star fa-lg"></i>}
                    />
                  </div>
                  <div className="col-5">
                    <div
                      className="text-secondary"
                      style={{ fontSize: "0.9em" }}
                    >
                      <i class="far fa-clock"></i>&nbsp;{this.props.date}
                    </div>
                    <div>
                      Order Details -<ul>{temp}</ul>
                    </div>
                  </div>
                  <div
                    className="col-5"
                    style={{
                      backgroundColor: "#8996a2",
                      borderRadius: "10px",
                      padding: "1.5%",
                      color: "white",
                    }}
                  >
                    "{this.props.fb}"
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1" />
        </div>
      </Fragment>
    );
  }
}
