import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import "./FrontPage.css";
// import { login } from "../authentication/userFunctions";

function change_bg(cls) {
  document
    .getElementById("bd")
    .classList.remove(document.getElementById("bd").classList[0]);
  document.getElementById("bd").classList.add(cls);
}

export default class FrontPage extends Component {
  // constructor() {
  // super();
  // this.state = {
  //   email: "",
  //   hashedPassword: "",
  //   authenticated: 0,
  //   errorFlag: false,
  //   errMsg: ""
  // };
  // this.handleChange = this.handleChange.bind(this);
  // this.handleSubmit = this.handleSubmit.bind(this);
  // }

  // handleChange(event) {
  //   this.setState({ [event.target.name]: event.target.value });
  // }
  // handleSubmit(event) {
  //   const user = {
  //     email: this.state.email,
  //     hashedPassword: this.state.hashedPassword
  //   };

  //   login(user)
  //     .then(res => {
  //       if (res.status) {
  //         // this.props.history.push('/')
  //         this.setState({ authenticated: 1 });
  //         // console.log(res.data)
  //       } else {
  //         this.setState({ errorFlag: true, errMsg: String(res.error) });
  //         // console.log(res.error)
  //       }
  //     })
  //     .catch(err => {
  //       console.log("error:-" + err);
  //     });

  //   event.preventDefault();
  // }

  // render() {
  //   if (this.state.authenticated === 1) {
  //     return <Redirect to="/Success" />;
  //   }
  //   return (
  //     <Fragment>
  //       <div className="row" style={{ height: "100vh" }}>
  //         <div className="col-6" />
  //         <div className="col-6" style={{ padding: "4%", marginTop: "90px" }}>
  //           <h3 className="signin">Sign In</h3>
  //           <br />
  //           <form
  //             onSubmit={this.handleSubmit}
  //             className="text-center"
  //             method="Post"
  //             style={{ color: "#757575" }}
  //           >
  //             <Modal
  //               open={this.state.errorFlag}
  //               onClose={() => this.setState({ errorFlag: false })}
  //               closeOnOverlayClick={true}
  //             >
  //               <div
  //                 className="container"
  //                 style={{ width: "35vw", padding: "5%" }}
  //               >
  //                 <div className="card text-center border-danger">
  //                   <div
  //                     className="card-header"
  //                     style={{ backgroundColor: "#dc3545", color: "white" }}
  //                   >
  //                     Error
  //                   </div>
  //                   <div className="card-body">{this.state.errMsg}</div>
  //                 </div>
  //               </div>
  //             </Modal>
  //             <div className="md-form">
  //               <input
  //                 type="text"
  //                 id="materialLoginFormEmail"
  //                 className="form-control"
  //                 name="email"
  //                 placeholder="Email id"
  //                 value={this.state.email}
  //                 onChange={this.handleChange}
  //                 required
  //               />
  //             </div>
  //             <br />
  //             <div className="md-form">
  //               <input
  //                 type="password"
  //                 id="materialLoginFormPassword"
  //                 className="form-control"
  //                 placeholder="Password"
  //                 name="hashedPassword"
  //                 value={this.state.hashedPassword}
  //                 onChange={this.handleChange}
  //                 required
  //               />
  //             </div>
  //             <button
  //               className="btn btn-outline-dark btn-rounded btn-block my-4 waves-effect z-depth-0"
  //               type="submit"
  //             >
  //               Login
  //             </button>
  //             <p>
  //               <Link className="btn btn-sm btn-info" to="/ResetPassword">
  //                 Forgot Password?
  //               </Link>
  //               <br />
  //               Don't have an account?&nbsp;
  //               <Link to="/register">Register</Link>
  //             </p>
  //           </form>
  //           <hr />
  //           <center>
  //             <button
  //               className="btn btn-outline-dark btn-rounded my-4 waves-effect z-depth-0"
  //               type="submit"
  //             >
  //               <i className="fab fa-google"></i>&nbsp;&nbsp;Sign in
  //             </button>
  //           </center>
  //         </div>
  //       </div>
  //     </Fragment>
  //   );
  // }

  render() {
    return (
      <Fragment onLoad={change_bg("fp")}>
        <div
          className="container-fluid"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div
            className="row"
            style={{
              fontFamily: "Sen",
              color: "whitesmoke"
            }}
          >
            <div
              className="col-4"
              style={{
                marginTop: "50px",
                fontSize: "2.4em",
                textAlign: "left"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp; &lt;&lt; I want to cook
              <br />
            </div>
            <div className="col" />
            <div
              className="col-4"
              style={{
                marginTop: "50px",
                fontSize: "2.4em",
                textAlign: "right"
              }}
            >
              I want to eat &gt;&gt; &nbsp;&nbsp;&nbsp;&nbsp;
              <br />
            </div>
          </div>
          <div className="row" style={{ paddingTop: "30%" }}>
            <div className="col-3">
              <center>
                <Link
                  className="btn btn-light btn-lg"
                  style={{ fontSize: "x-large", opacity: "90%" }}
                  to="/Chef/Login"
                >
                  {" "}
                  <i class="fas fa-utensils"></i> Chef
                </Link>
              </center>
            </div>
            <div className="col"></div>
            <div className="col-3">
              <center>
                <Link
                  className="btn btn-light btn-lg"
                  style={{ fontSize: "x-large", opacity: "90%" }}
                  to="/Login"
                >
                  {" "}
                  <i class="fas fa-pizza-slice"></i> Explore
                </Link>
              </center>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
