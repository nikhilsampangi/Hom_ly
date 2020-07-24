import React, { Component } from "react";
import { Fragment } from "react";
import Navbar from "./Navbar";
import change_bg from "..";
import Cookies from "js-cookie";
import Axios from "axios";

export default class Purchase extends Component {
  constructor() {
    super();
    this.state = {};
    this.OrderItems = this.OrderItems.bind(this);
  }

  OrderItems() {
    Axios.post(
      "/transaction/order",
      {
        chefid: Cookies.get("cartChefId"),
        chefname: Cookies.get("cartChefName"),
        cart: JSON.parse(Cookies.get("cart")),
      },
      { headers: { Authorization: Cookies.get("usertoken") } }
    ).then((res) => {
      console.log(res.data);
    });
  }

  render() {
    return (
      <Fragment>
        <Navbar onLoad={change_bg("cust_hm")} walletPage={true} />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="row">
          <div className="col-1"></div>
          <div className="col">
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="card-title">
                <h3>Your Cart</h3>
              </div>
              <br />
              <br />
              <div className="card-body">
                <DisplayCart />
                <br />
                <div className="text-right">
                  <button
                    className="btn btn-dark"
                    style={{ borderRadius: "0" }}
                    onClick={this.OrderItems}
                  >
                    Proceed to Payments &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </Fragment>
    );
  }
}

class DisplayCart extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.setState({
      data: JSON.parse(Cookies.get("cart")),
    });
  }

  render() {
    let data = [];
    let total = 0;
    if (this.state.data) {
      for (let i = 0; i < this.state.data.length; i++) {
        data.push(
          <tr>
            <td>{this.state.data[i].itemName}</td>
            <td>{this.state.data[i].itemCost}</td>
            <td>{this.state.data[i].itemQnty}</td>
            <td>{this.state.data[i].itemCost * this.state.data[i].itemQnty}</td>
          </tr>
        );
        total =
          total + this.state.data[i].itemCost * this.state.data[i].itemQnty;
      }

      data.push(
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>
            <strong>Total</strong>
          </td>
          <td>{total}</td>
        </tr>
      );
      return (
        <Fragment>
          <table className="table table-hover text-center">
            <thead>
              <tr>
                <th scope="col">Item name</th>
                <th scope="col">Unit cost</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>{data}</tbody>
          </table>
        </Fragment>
      );
    }
  }
}
