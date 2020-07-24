import React, { Component, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import Cookies from "js-cookie";
import change_bg from "../index";
import Axios from "axios";
import Modal from "react-responsive-modal";

export default class ChContracts extends Component {
  constructor() {
    super();
    this.state = {
      expertise: false,
      contr: [],
      contrU: [],
      contrP: [],
    };
  }

  componentDidMount() {
    change_bg("chf_hm");
    Axios.get("chef/profile", {
      headers: { Authorization: Cookies.get("cheftoken") },
    }).then((res) => {
      this.setState({
        expertise: res.data.expertiseLevel,
      });
      if (res.data.expertiseLevel) {
        Axios.get("/chef/contracts").then((res) => {
          // console.log(res);
          this.setState({
            contr: res.data.list,
          });
        });
        Axios.get("/chef/upcomingContracts", {
          headers: { Authorization: Cookies.get("cheftoken") },
        }).then((res) => {
          this.setState({
            contrU: res.data.list,
          });
        });
        Axios.get("/chef/prevContracts", {
          headers: { Authorization: Cookies.get("cheftoken") },
        }).then((res) => {
          this.setState({
            contrP: res.data.list,
          });
        });
      }
    });
  }

  render() {
    let data = [];
    let dataU = [];
    let dataP = [];
    if (Cookies.get("cheftoken")) {
      if (this.state.expertise) {
        for (let i = 0; i < this.state.contr.length; i++) {
          for (let j = 0; j < this.state.contr[i].contracts.length; j++) {
            data.push(
              <tr>
                <td>{this.state.contr[i].contracts[j].contrTitle}</td>

                {this.state.contr[i].contracts[j].contrType === 0 ? (
                  <td>Work from home</td>
                ) : this.state.contr[i].contracts[j].contrType === 1 ? (
                  <td>Cook at customer's residence</td>
                ) : (
                  <td>Cook at customer's hotel</td>
                )}

                <td>
                  {this.state.contr[i].contracts[j].deliveryDate.split("T")[0]}
                </td>
                <td>
                  <ApplyContractButton
                    userid={this.state.contr[i]._id}
                    contrid={this.state.contr[i].contracts[j]._id}
                  />
                </td>
              </tr>
            );
            data.push(
              <tr>
                <td style={{ borderTop: "none" }}>
                  <span className="text-secondary">
                    Contract Description :&nbsp;
                  </span>
                  {this.state.contr[i].contracts[j].contrDescription}
                </td>
              </tr>
            );
          }
        }
        for (let i = 0; i < this.state.contrU.length; i++) {
          for (let j = 0; j < this.state.contrU[i].contracts.length; j++) {
            dataU.push(
              <tr>
                <td>{this.state.contrU[i].contracts[j].contrTitle}</td>

                {this.state.contrU[i].contracts[j].contrType === 0 ? (
                  <td>Work from home</td>
                ) : this.state.contrU[i].contracts[j].contrType === 1 ? (
                  <td>Cook at customer's residence</td>
                ) : (
                  <td>Cook at customer's hotel</td>
                )}

                <td>
                  {this.state.contrU[i].contracts[j].deliveryDate.split("T")[0]}
                </td>
              </tr>
            );
            dataU.push(
              <tr>
                <td style={{ borderTop: "none" }}>
                  <span className="text-secondary">
                    Contract Description :&nbsp;
                  </span>
                  {this.state.contrU[i].contracts[j].contrDescription}
                </td>
              </tr>
            );
          }
        }
        for (let i = 0; i < this.state.contrP.length; i++) {
          for (let j = 0; j < this.state.contrP[i].contracts.length; j++) {
            dataP.push(
              <tr>
                <td>{this.state.contrP[i].contracts[j].contrTitle}</td>

                {this.state.contrP[i].contracts[j].contrType === 0 ? (
                  <td>Work from home</td>
                ) : this.state.contrP[i].contracts[j].contrType === 1 ? (
                  <td>Cook at customer's residence</td>
                ) : (
                  <td>Cook at customer's hotel</td>
                )}

                <td>
                  {this.state.contrP[i].contracts[j].deliveryDate.split("T")[0]}
                </td>
              </tr>
            );
            dataP.push(
              <tr>
                <td style={{ borderTop: "none" }}>
                  <span className="text-secondary">
                    Contract Description :&nbsp;
                  </span>
                  {this.state.contrP[i].contracts[j].contrDescription}
                </td>
              </tr>
            );
          }
        }
        return (
          <Fragment>
            <ChNavbar contractsPage={true} />
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
                    <h3>Contracts Available</h3>
                  </div>
                  <br />
                  <br />
                  <div className="card-body">
                    <table className="table table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Contract Title</th>
                          <th scope="col">Contract Type</th>
                          <th scope="col">Delivery Date</th>
                          <th scope="col">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>{data}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
            </div>
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
                    <h3>Contracts Accepted</h3>
                  </div>
                  <br />
                  <br />
                  <div className="card-body">
                    <table className="table table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Contract Title</th>
                          <th scope="col">Contract Type</th>
                          <th scope="col">Delivery Date</th>
                        </tr>
                      </thead>
                      <tbody>{dataU}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
            </div>
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
                    <h3>Contracts Fulfilled</h3>
                  </div>
                  <br />
                  <br />
                  <div className="card-body">
                    <table className="table table-hover">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Contract Title</th>
                          <th scope="col">Contract Type</th>
                          <th scope="col">Delivery Date</th>
                        </tr>
                      </thead>
                      <tbody>{dataP}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <ChNavbar contractsPage={true} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="row">
              <div className="col-1"></div>
              <div className="col">
                <h3 className="text-info">
                  You need to be a certified chef in order to take large-scale
                  orders!
                </h3>
              </div>
              <div className="col-1"></div>
            </div>
          </Fragment>
        );
      }
    } else {
      return <Redirect to="/Chef/Login"></Redirect>;
    }
  }
}

class ApplyContractButton extends Component {
  constructor() {
    super();
    this.state = {
      responseFlag: false,
      errFlag: false,
      resMsg: "",
    };
    this.ApplyContract = this.ApplyContract.bind(this);
  }

  ApplyContract() {
    Axios.post(
      "/chef/contract/accept",
      { userId: this.props.userid, contractId: this.props.contrid },
      { headers: { Authorization: Cookies.get("cheftoken") } }
    )
      .then((res) => {
        console.log(res.data);
        this.setState({
          responseFlag: true,
          resMsg: "Applied Succesfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          responseFlag: true,
          errFlag: true,
          resMsg: "Something went wrong! Please try again",
        });
      });
  }

  render() {
    return (
      <Fragment>
        <button
          className="btn btn-dark btn-block"
          style={{ borderRadius: "0" }}
          onClick={this.ApplyContract}
        >
          Apply
        </button>
        <Modal
          open={this.state.responseFlag}
          onClose={() => this.setState({ responseFlag: false })}
          closeOnOverlayClick={true}
        >
          <div className="container" style={{ width: "35vw", padding: "5%" }}>
            <div className="card text-center">
              <div
                className="card-header"
                style={{
                  fontSize: "x-large",
                }}
              >
                {this.state.errFlag ? (
                  <span className="text-danger">Error</span>
                ) : (
                  <span className="text-info">Info</span>
                )}
              </div>
              <div className="card-body" style={{ padding: "10%" }}>
                {this.state.resMsg}
                <br />
                <Link to="/Chef/Profile">Back to Profile &gt;</Link>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}
