import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as NavLg } from "../assets/nav_logo.svg";
import { ReactComponent as Melon } from "../assets/Melon.svg";

export default class ChNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { nav_p: false, nav_c: false, nav_m: false, nav_a: false };
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
            {this.props.profilePage || this.state.nav_p ? (
              <Link
                to="/Chef/Profile"
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
          <div className="col" style={{ textAlign: "center" }}>
            <Melon style={{ height: "69px" }} />
          </div>
          <div className="col-2" style={{ textAlign: "center" }}>
            {this.props.contractsPage || this.state.nav_c ? (
              <Link
                to="/Chef/Contracts"
                style={{ textDecoration: "none", color: "#ee3d59" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_c: false })}
                  style={{ cursor: "pointer" }}
                >
                  contracts
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_c: true })}>
                CONTRACTS
              </span>
            )}
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <NavLg style={{ height: "69px" }} />
          </div>
          <div className="col-2" style={{ textAlign: "center" }}>
            {this.props.menuPage || this.state.nav_m ? (
              <Link
                to="/Chef/Menu"
                style={{ textDecoration: "none", color: "#ee3d59" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_m: false })}
                  style={{ cursor: "pointer" }}
                >
                  update menu
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_m: true })}>
                UPDATE MENU
              </span>
            )}
          </div>
          <div className="col" style={{ textAlign: "center" }}>
            <Melon style={{ height: "69px" }} />
          </div>
          <div className="col-1" style={{ textAlign: "right" }}>
            {this.props.analyticsPage || this.state.nav_a ? (
              <Link
                to="/Chef/Analytics"
                style={{ textDecoration: "none", color: "#72be44" }}
              >
                <span
                  onMouseLeave={() => this.setState({ nav_a: false })}
                  style={{ cursor: "pointer" }}
                >
                  analytics
                </span>
              </Link>
            ) : (
              <span onMouseEnter={() => this.setState({ nav_a: true })}>
                ANALYTICS
              </span>
            )}
          </div>
          <div className="col"></div>
        </nav>
      </Fragment>
    );
  }
}
