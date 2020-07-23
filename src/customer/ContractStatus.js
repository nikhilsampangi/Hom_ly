import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import change_bg from "../index";
import Axios from "axios";

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
        Axios.get("/chef/get_details", {
          id: this.state.data.chefs[i].chefId,
        }).then((res) => {
          console.log("Chef details: ", res.data);
        });
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
