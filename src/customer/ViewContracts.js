import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import change_bg from "../index";
import Axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export default class ViewContracts extends Component {
  constructor() {
    super();
    this.state = {
      contrI: [],
      contrA: [],
      contrD: [],
    };
  }

  componentDidMount() {
    change_bg("cust_hm");
    Axios.get("/customer/get_contracts", {
      headers: { Authorization: Cookies.get("usertoken") },
    }).then((res) => {
      let contrA = [];
      let contrI = [];
      let contrD = [];
      for (let i = 0; i < res.data.data.length; i++) {
        switch (res.data.data[i].contrStatus) {
          case 0:
            contrI.push(res.data.data[i]);
            break;
          case 1:
            contrA.push(res.data.data[i]);
            break;
          case 2:
            contrD.push(res.data.data[i]);
            break;
          default:
            break;
        }
      }
      // console.log(res.data.data);
      this.setState({
        contrA: contrA,
        contrI: contrI,
        contrD: contrD,
      });
    });
  }

  render() {
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
              <div className="card-title">
                <h3>Contracts Initiated</h3>
              </div>
              <br />
              <br />
              <div className="card-body">
                <ContractTable data={this.state.contrI} />
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="card-title">
                <h3>Contracts Approved</h3>
              </div>
              <br />
              <br />
              <div className="card-body">
                <ContractTable data={this.state.contrA} />
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="card-title">
                <h3>Contracts Delivered</h3>
              </div>
              <br />
              <br />
              <div className="card-body">
                <ContractTable data={this.state.contrD} />
              </div>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </Fragment>
    );
  }
}

class ContractTable extends Component {
  render() {
    let data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      data.push(
        <tr>
          <td>{this.props.data[i].contrTitle}</td>
          <td>{this.props.data[i].date}</td>

          {this.props.data[i].contrStatus === 0 ? (
            <td className="row">
              <div className="col">
                <Link
                  className="btn btn-info btn-block"
                  style={{ borderRadius: "0" }}
                  to="/Contracts/Review"
                >
                  Review Applications
                </Link>
              </div>
              <div className="col">
                <span>
                  [ No of Applicants: {this.props.data[i].chefs.length} ]
                </span>
              </div>
            </td>
          ) : (
            <td></td>
          )}
        </tr>
      );
    }
    return (
      <Fragment>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date posted</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>{data}</tbody>
        </table>
      </Fragment>
    );
  }
}
