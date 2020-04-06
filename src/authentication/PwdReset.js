import React, { Component, Fragment } from "react";
import { pwdReset } from "./userFunctions";
import Modal from "react-responsive-modal";

export default class PwdReset extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      hashedPassword: "",
      authenticated: 0,
      errorFlag: false,
      msgFlag: false,
      msg: "",
      errMsg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    const user = {
      email: this.state.email,
      hashedPassword: this.state.hashedPassword
    };

    pwdReset(user)
      .then(res => {
        if (res.status) {
          // this.props.history.push('/')
          // this.setState({ authenticated: 1 });
          console.log(res.data);
          this.setState({ msgFlag: true, msg: res.data });
        } else {
          this.setState({
            errorFlag: true,
            errMsg: String(res.error),
            data: res.data
          });
          console.log(res.error);
        }
      })
      .catch(err => {
        console.log("error:-" + err);
      });

    event.preventDefault();
  }

  render() {
    return (
      <Fragment>
        <div className="row" style={{ height: "100vh" }}>
          <div className="col-6" />
          <div className="col-6" style={{ padding: "4%", marginTop: "90px" }}>
            <form
              onSubmit={this.handleSubmit}
              className="text-center"
              method="Post"
              style={{ color: "#757575" }}
            >
              <div className="form-row">
                <input
                  type="text"
                  id="materialLoginFormEmail"
                  className="form-control"
                  name="email"
                  placeholder="Email id"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <button
                className="btn btn-outline-dark btn-rounded btn-block my-4 waves-effect z-depth-0"
                type="submit"
              >
                Reset Password
              </button>
              <Modal
                open={this.state.msgFlag}
                onClose={() => this.setState({ msgFlag: false })}
                closeOnOverlayClick={true}
              >
                <div
                  className="container"
                  style={{ width: "35vw", padding: "5%" }}
                >
                  <div className="card text-center border-info">
                    {/* <div
                className="card-header"
                style={{ backgroundColor: "#dc3545", color: "white" }}
              >
                Info
              </div> */}
                    <div className="card-body">
                      {this.state.msg}
                      <br />
                      <a href="./">Go back to Home Page</a>
                    </div>
                  </div>
                </div>
              </Modal>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}
