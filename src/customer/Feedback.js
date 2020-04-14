import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import change_bg from "../index";
import Axios from "axios";
import Rating from "react-rating";

export default class Feedback extends Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      fb: "",
      redFlag: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  componentDidMount() {
    change_bg("cust_hm");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submitFeedback(event) {
    var temp = {
      id: this.props.location.state.id,
      rating: this.state.rating,
      fb: this.state.fb,
    };
    Axios.post("/transaction/feedback", temp).then(
      this.setState({ redFlag: true })
    );
  }

  render() {
    if (Cookies.get("usertoken")) {
      if (this.state.redFlag) {
        return <Redirect to="/Home" />;
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
          <br />
          <div
            className="container"
            style={{ maxWidth: "1280px", fontFamily: "Sen" }}
          >
            <h2>
              Thanks for your purchase!
              <br />
              Please share your valuable feedback
            </h2>
            <br />
            <br />
            <br />
            <div>
              <h5>Rating</h5>
              <Rating
                placeholderRating={this.state.rating}
                readonly={false}
                emptySymbol={[
                  <i className="far fa-tired fa-3x"></i>,
                  <i className="far fa-frown fa-3x"></i>,
                  <i className="far fa-meh fa-3x"></i>,
                  <i className="far fa-smile fa-3x"></i>,
                  <i className="far fa-grin-stars fa-3x"></i>,
                ]}
                fullSymbol={[
                  <i className="fas fa-tired fa-3x"></i>,
                  <i className="fas fa-frown fa-3x"></i>,
                  <i className="fas fa-meh fa-3x"></i>,
                  <i className="fas fa-smile fa-3x"></i>,
                  <i className="fas fa-grin-stars fa-3x"></i>,
                ]}
                placeholderSymbol={[
                  <i className="fas fa-tired fa-3x"></i>,
                  <i className="fas fa-frown fa-3x"></i>,
                  <i className="fas fa-meh fa-3x"></i>,
                  <i className="fas fa-smile fa-3x"></i>,
                  <i className="fas fa-grin-stars fa-3x"></i>,
                ]}
                onChange={(value) => {
                  this.setState({ rating: value });
                }}
              />
              &nbsp;&nbsp;
              {this.state.rating === 5 ? (
                <span>Excellent !</span>
              ) : this.state.rating === 4 ? (
                <span>Good !</span>
              ) : this.state.rating === 3 ? (
                <span>Satisfactory</span>
              ) : this.state.rating === 2 ? (
                <span>Bad</span>
              ) : (
                <span>Yuck!</span>
              )}
            </div>
            <br />
            <div className="form-group">
              <h5>Feedback</h5>
              <textarea
                class="form-control"
                rows="4"
                name="fb"
                value={this.state.fb}
                onChange={this.handleChange}
              ></textarea>
            </div>
            <br />
            <button
              className="btn btn-outline-dark btn-lg"
              style={{ borderRadius: "0" }}
              onClick={this.submitFeedback}
            >
              Submit
            </button>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Login" />;
    }
  }
}
