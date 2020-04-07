import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import Cookies from "js-cookie";
import change_bg from "../index";
import { ReactComponent as Veg } from "../assets/Veg.svg";
import { ReactComponent as NonVeg } from "../assets/Nonveg.svg";
import Modal from "react-responsive-modal";
import Switch from "react-switch";
import axios from "axios";

export default class ChMenu extends Component {
  constructor() {
    super();
    this.state = {
      addItemFlag: false,
      itemVegFlag: true,
      itemName: "",
      itemCost: "",
      itemDescr: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  addItem(event) {
    const item = {
      itemName: this.state.itemName,
      itemDescr: this.state.itemDescr,
      itemCost: this.state.itemCost,
      isVeg: this.state.itemVegFlag,
    };
    axios
      .post("/chef/add_item", item, {
        headers: { Authorization: Cookies.get("cheftoken") },
      })
      .then(this.setState({ addItemFlag: false }));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSwitchChange(event) {
    this.setState({ itemVegFlag: !this.state.itemVegFlag });
  }

  componentDidMount(event) {
    change_bg("chf_hm");
  }

  render() {
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar menuPage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="col">
                <h2>Update Menu</h2>
              </div>
              <div className="col" style={{ textAlign: "right" }}>
                <button
                  className="btn btn-dark btn-lg"
                  style={{ borderRadius: "0" }}
                  onClick={() => this.setState({ addItemFlag: true })}
                >
                  + Add item
                </button>
              </div>
            </div>
            <br />
            <br />
            <ListItems />
          </div>
          <Modal
            open={this.state.addItemFlag}
            onClose={() => this.setState({ addItemFlag: false })}
            closeOnOverlayClick={true}
            center
          >
            <div
              className="container"
              style={{ width: "60vw", padding: "5%", display: "table-cell" }}
            >
              <h3>Add Item</h3>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    placeholder="Item Name"
                    className="form-control"
                    name="itemName"
                    value={this.state.itemName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    placeholder="Item Cost"
                    className="form-control"
                    name="itemCost"
                    value={this.state.itemCost}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    placeholder="Item Description"
                    className="form-control"
                    name="itemDescr"
                    value={this.state.itemDescr}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <span>
                    <Veg style={{ height: "25px", width: "25px" }} />
                    &nbsp;Vegetarian
                  </span>
                  &nbsp;&nbsp;
                  <Switch
                    checked={this.state.itemVegFlag}
                    onChange={this.handleSwitchChange}
                    height={20}
                    width={40}
                  />
                </div>
                <div className="col">
                  <span>Item Image</span>
                  <input type="file" className="form-control" />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3" />
                <div className="col">
                  <button
                    className="btn btn-outline-dark btn-block"
                    style={{ borderRadius: "0" }}
                    onClick={this.addItem}
                  >
                    Save
                  </button>
                </div>
                <div className="col-3" />
              </div>
            </div>
          </Modal>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login"></Redirect>;
    }
  }
}

class ListItems extends Component {
  constructor() {
    super();
    this.state = {
      arr: [],
    };
  }

  componentDidMount(event) {
    axios
      .get("/chef/profile", {
        headers: { Authorization: Cookies.get("cheftoken") },
      })
      .then((res) => {
        var arr = res.data.menu;
        this.setState({
          arr: res.data.menu,
        });
      });
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
    return <Fragment>{items}</Fragment>;
  }
}

class Item extends Component {
  render() {
    return (
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
                  className="col-3"
                  style={{ padding: "3%", textAlign: "center" }}
                >
                  <i
                    className="fas fa-pizza-slice"
                    style={{ fontSize: "6em" }}
                  ></i>
                </div>
                <div className="col-6">
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
                    <i class="fas fa-rupee-sign"></i>&nbsp;{this.props.cost}
                  </div>
                </div>
                <div className="col-3" style={{ padding: "2%" }}>
                  <button
                    className="btn btn-info btn-block"
                    style={{ borderRadius: "0" }}
                  >
                    Edit Item
                  </button>
                  <br />

                  <button
                    className="btn btn-outline-danger btn-block"
                    style={{ borderRadius: "0" }}
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1" />
      </div>
    );
  }
}
