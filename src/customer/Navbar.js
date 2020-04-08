import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as NavLg } from "../assets/nav_logo.svg";
import { ReactComponent as Melon } from "../assets/Melon.svg";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { nav_h: false, nav_w: false, nav_a: false, nav_p: false };
  }
  render() {
    return (
      <Fragment>
        <nav
          className="navbar fixed-top navbar-expand-lg navbar-light userhomenavbar row"
          style={{
            zIndex: "1000",
            fontFamily: "Neptune",
            fontSize: "1.6em",
            borderBottom: "3.5px solid #72be44",
            backgroundColor: "#f1ebeb",
          }}
        >
          <div className="col"></div>
          <div className="col-1">
            {this.props.homePage || this.state.nav_h ? (
              <Link
                to="/Home"
                style={{ textDecoration: "none", color: "#72be44" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_h: false })}
                  style={{ cursor: "pointer" }}
                >
                  home
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_h: true })}>
                HOME
              </span>
            )}
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <Melon style={{ height: "69px" }} />
          </div>
          <div className="col-2" style={{ textAlign: "center" }}>
            {this.props.walletPage || this.state.nav_w ? (
              <Link
                to="/Wallet"
                style={{ textDecoration: "none", color: "#ee3d59" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_w: false })}
                  style={{ cursor: "pointer" }}
                >
                  purchase
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_w: true })}>
                PURCHASE
              </span>
            )}
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <NavLg style={{ height: "69px" }} />
          </div>
          <div className="col-2" style={{ textAlign: "center" }}>
            {this.props.aboutPage || this.state.nav_a ? (
              <Link
                to="/About"
                style={{ textDecoration: "none", color: "#ee3d59" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_a: false })}
                  style={{ cursor: "pointer" }}
                >
                  about
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_a: true })}>
                ABOUT
              </span>
            )}
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <Melon style={{ height: "69px" }} />
          </div>
          <div className="col-1" style={{ textAlign: "right" }}>
            {this.props.profilePage || this.state.nav_p ? (
              <Link
                to="/Profile"
                style={{ textDecoration: "none", color: "#72be44" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_p: false })}
                  style={{ cursor: "pointer" }}
                >
                  profile
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_p: true })}>
                PROFILE
              </span>
            )}
          </div>
          <div className="col"></div>
        </nav>
      </Fragment>
    );
  }
}
