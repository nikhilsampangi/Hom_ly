import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import change_bg from "../index";
import Axios from "axios";
import Rating from "react-rating";
import Cookies from "js-cookie";

export default class ContractStatus extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    change_bg("cust_hm");
    this.setState({
      data: this.props.location.state.contract,
    });
  }

  render() {
    let chef_list = [];
    if (this.state.data.chefs) {
      for (let i = 0; i < this.state.data.chefs.length; i++) {
        chef_list.push(
          <ListChef
            chefid={this.state.data.chefs[i].chefId}
            contractid={this.state.data._id}
          />
        );
      }
    }
    return (
      <Fragment>
        <Navbar walletPage={true} />
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
              <div className="card-title text-info">
                <h4>{this.state.data.contrTitle}</h4>
              </div>
              <br />
              <br />
              <div className="card-body">
                {this.state.data.contrDescription}
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
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
              <div className="card-title text-secondary">
                <h4>Responses</h4>
              </div>
              <br />
              <br />
              <div className="card-body">
                <table className="table table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Chef Name</th>
                      <th scope="col">Chef Rating</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{chef_list}</tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </Fragment>
    );
  }
}

class ListChef extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.SelectApplicant = this.SelectApplicant.bind(this);
  }

  SelectApplicant() {
    Axios.post(
      "/customer/acceptChef",
      { contractId: this.props.contractid, chefId: this.props.chefid },
      { headers: { Authorization: Cookies.get("usertoken") } }
    );
  }

  componentDidMount() {
    Axios.post("/chef/get_details", {
      id: this.props.chefid,
    }).then((res) => {
      // console.log("Chef details: ", res.data);
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    return (
      <Fragment>
        <tr>
          <td>
            {this.state.data.firstName}&nbsp;{this.state.data.lastName}
          </td>
          <td>
            <Rating
              placeholderRating={this.state.data.rating}
              readonly={true}
              emptySymbol={<i className="far fa-star"></i>}
              fullSymbol={<i className="fas fa-star"></i>}
              placeholderSymbol={<i className="fas fa-star"></i>}
            />
          </td>
          <td>{this.state.data.phoneNum}</td>
          <td className="row">
            <div className="col">
              <button
                className="btn btn-warning btn-block text-light"
                style={{ borderRadius: "0" }}
              >
                <i class="fas fa-comment-dots"></i>&nbsp;Chat
              </button>
            </div>
            <div className="col">
              <button
                className="btn btn-outline-dark btn-block"
                onClick={this.SelectApplicant}
                style={{ borderRadius: "0" }}
              >
                Select Applicant
              </button>
            </div>
          </td>
        </tr>
      </Fragment>
    );
  }
}
