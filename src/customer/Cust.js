import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import change_bg from "../index";
import Axios from "axios";
import "./Cust.css";
import { ReactComponent as Veg } from "../assets/Veg.svg";
import { ReactComponent as NonVeg } from "../assets/Nonveg.svg";

export default class Cust extends Component {
  constructor() {
    super();
    this.state = {
      itemRes: [],
    };
  }

  componentDidMount() {
    change_bg("cust_hm");
    Axios.get("/chef/avail_items").then((res) => {
      this.setState({
        itemRes: res.data,
      });
      // console.log(res);
    });
  }

  render() {
    var items = [[]];
    for (let i = 0; i < this.state.itemRes.length; i++) {
      for (let j = 0; j < this.state.itemRes[i].menu.length; j++) {
        items.push(
          <Item
            name={this.state.itemRes[i].menu[j].itemName}
            descr={this.state.itemRes[i].menu[j].itemDescr}
            cost={this.state.itemRes[i].menu[j].itemCost}
            isVeg={this.state.itemRes[i].menu[j].isVeg}
            firstName={this.state.itemRes[i].firstName}
            lastName={this.state.itemRes[i].lastName}
            id={this.state.itemRes[i]._id}
            pic={this.state.itemRes[i].menu[j].dishPic}
          />
        );
      }
    }

    if (Cookies.get("usertoken")) {
      return (
        <Fragment>
          <Navbar homePage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container" style={{ maxWidth: "1280px" }}>
            <div className="row">
              <div className="col">
                <SearchBar />
              </div>
              <div className="col-1"></div>
              <div className="col-2">
                <button
                  className="btn btn-outline-secondary btn-block"
                  style={{ borderRadius: "0" }}
                >
                  <i className="fas fa-shopping-cart"></i>&nbsp;Cart
                </button>
              </div>
            </div>
          </div>
          <br />
          <div className="container-fluid">
            <div className="row">{items}</div>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login"></Redirect>;
    }
  }
}

class SearchBar extends Component {
  render() {
    return (
      <Fragment>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="search food item or chefs"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

class Item extends Component {
  constructor() {
    super();
    this.state = {
      redirectFlag: false,
      transId: "",
    };
    this.purchase = this.purchase.bind(this);
    this.likeItem = this.likeItem.bind(this);
  }

  purchase() {
    let temp = {
      id: this.props.id,
      chefName: this.props.firstName,
      name: this.props.name,
      cost: this.props.cost,
    };
    Axios.post("/transaction/buy_item", temp, {
      headers: { Authorization: Cookies.get("usertoken") },
    }).then((res) => {
      this.setState({ transId: res.data, redirectFlag: true });
    });
  }

  likeItem() {
    Axios.post("/customer/itemLiked", { chef_id: this.props.id });
  }

  render() {
    if (this.state.redirectFlag) {
      return (
        <Redirect
          to={{ pathname: "/Feedback", state: { id: this.state.transId } }}
        />
      );
    }

    return (
      <Fragment>
        <div className="col-4">
          <div
            className="card"
            style={{ fontFamily: "Sen", marginBottom: "20px" }}
          >
            <div
              className="p-card-body"
              style={{
                padding: "1%",
              }}
            >
              <div
                className="row"
                style={{ marginLeft: "0", marginRight: "0" }}
              >
                <div
                  className="col-3"
                  style={{ padding: "1%", textAlign: "center" }}
                >
                  {/* <i
                    className="fas fa-pizza-slice"
                    style={{ fontSize: "3em" }}
                  ></i> */}
                  <img
                    src={process.env.PUBLIC_URL + "/img/" + this.props.pic}
                    alt="item_image"
                    width="115px"
                  />
                </div>
                <div className="col-6">
                  <span>
                    {this.props.name}
                    &nbsp;
                    {this.props.isVeg ? (
                      <Veg style={{ height: "15px", width: "15px" }} />
                    ) : (
                      <NonVeg style={{ height: "15px", width: "15px" }} />
                    )}
                  </span>
                  <br />
                  <span style={{ color: "dimgrey", fontSize: "0.9em" }}>
                    - {this.props.descr}
                  </span>
                </div>
                <div className="col-3" style={{ textAlign: "right" }}>
                  <button onClick={this.likeItem}>
                    <i
                      className="far fa-heart"
                      style={{ color: "rgb(220, 53, 69)" }}
                    ></i>
                  </button>
                  <br />
                  <br />
                  <div className="text-success">
                    <i class="fas fa-rupee-sign"></i>&nbsp;{this.props.cost}
                  </div>
                </div>
              </div>
              <br />
              <div
                className="row"
                style={{
                  padding: "2%",
                  marginLeft: "0",
                  marginRight: "0",
                }}
              >
                <div className="col text-info">
                  <i className="fas fa-user"></i>&nbsp;{this.props.firstName}
                  &nbsp;{this.props.lastName}
                </div>
                <div className="col" style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-info btn-sm"
                    style={{ borderRadius: "0" }}
                    onClick={this.purchase}
                  >
                    <i className="fas fa-cart-plus"></i>&nbsp;Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
