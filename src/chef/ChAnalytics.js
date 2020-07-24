import React, { Component, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import ChNavbar from "./ChNavbar";
import Cookies from "js-cookie";
import change_bg from "../index";
import Axios from "axios";
import Rating from "react-rating";
import { Bar, Line } from "react-chartjs-2";
import * as jsPDF from "jspdf";
import $ from "jquery";
import html2canvas from "html2canvas";

export default class ChAnalytics extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  downloadPDF(target_id) {
    var HTML_Width = $(target_id).width();
    var HTML_Height = $(target_id).height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + top_left_margin * 2;
    var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($(target_id)[0]).then(function (canvas) {
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }
      pdf.save("analytics.pdf");
    });
  }
  componentDidMount() {
    change_bg("chf_hm");
    Axios.get("/transaction/get_orders", {
      headers: { Authorization: Cookies.get("cheftoken") },
    })
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    let sales = 0;
    let r = 0;
    let rgrph_data = [0, 0, 0, 0, 0];
    let slc_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < this.state.data.length; i++) {
      sales = sales + this.state.data[i].amount;
      r = r + this.state.data[i].rating;
      rgrph_data[this.state.data[i].rating - 1] =
        rgrph_data[this.state.data[i].rating - 1] + 1;
      // slc_data[this.state.data[i].date.getMonth()] =
      //   slc_data[this.state.data[i].date.getMonth()] +
      //   this.state.data[i].amount;
    }
    r = r / this.state.data.length;

    let rbg = {
      labels: ["1 stars", "2 stars", "3 stars", "4 stars", "5 stars"],
      datasets: [
        {
          label: "No.of Ratings",
          backgroundColor: "#17a2b8",
          hoverBackgroundColor: "#17a2b8bb",
          barThickness: 30,
          // data: rgrph_data,
          data: [12, 14, 13, 17, 24],
        },
      ],
    };
    let slc = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Sales",
          backgroundColor: "#ff515eaa",
          pointBackgroundColor: "#ff515e",
          barThickness: 30,
          fill: false,
          // data: slc_data,
          data: [123, 221, 372, 420, 136, 199, 502, 0, 0, 0, 0, 0],
        },
      ],
    };
    if (Cookies.get("cheftoken")) {
      return (
        <Fragment>
          <ChNavbar analyticsPage={true} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container">
            <div
              id="dashboard"
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
            >
              <div className="text-right">
                <i
                  className="fas fa-2x fa-file-pdf text-danger"
                  style={{ cursor: "pointer" }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Download as pdf"
                  onClick={() => {
                    this.downloadPDF("#dashboard");
                  }}
                ></i>
              </div>
              <div className="card-title text-center">
                <h3>Analytics Dashboard</h3>
              </div>
              <br />
              <div className="card-body">
                <ul
                  className="list-group list-group-flush"
                  style={{ fontSize: "1.2em" }}
                >
                  <li className="list-group-item" style={{ color: "#17a2b8" }}>
                    <div className="row">
                      <div className="col">Total no of Items sold</div>
                      <div className="col text-right">
                        {this.state.data.length}
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item" style={{ color: "#ff515e" }}>
                    <div className="row">
                      <div className="col">
                        Total amount earned through sales
                      </div>
                      <div className="col text-right">
                        <i className="fas fa-rupee-sign"></i>&nbsp;
                        {sales}
                      </div>
                    </div>
                  </li>
                </ul>
                <br />
                <br />
                <div className="row">
                  <div className="col">
                    Rating
                    <br />
                    <Rating
                      placeholderRating={r}
                      readonly={true}
                      emptySymbol={<i className="far fa-star"></i>}
                      fullSymbol={<i className="fas fa-star"></i>}
                      placeholderSymbol={<i className="fas fa-star"></i>}
                    />
                    &nbsp;{r}({this.state.data.length})
                  </div>
                  <div className="col text-right">
                    <Link
                      className="btn btn-outline-info"
                      style={{ borderRadius: "0" }}
                      to="/Chef/Analytics/Feedbacks"
                    >
                      View Feedbacks
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            {/* Ratings bar graph */}
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
              id="ratingsBarGraph"
            >
              <div className="card-title row">
                <h4 className="col" style={{ fontFamily: "Neptune" }}>
                  RaTinGS BaR GraPh
                </h4>
                <div className="col text-right">
                  <i
                    className="fas fa-2x fa-file-pdf text-danger"
                    style={{ cursor: "pointer" }}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Download as pdf"
                    onClick={() => {
                      this.downloadPDF("#ratingsBarGraph");
                    }}
                  ></i>
                </div>
              </div>
              <br />
              <div className="card-body">
                <Bar
                  data={rbg}
                  width={100}
                  height={400}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                  }}
                  bar
                />
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            {/* Sales Line Chart */}
            <div
              className="card"
              style={{ fontFamily: "Sen", padding: "2% 5% 2% 5%" }}
              id="salesLineChart"
            >
              <div className="card-title row">
                <h4 className="col" style={{ fontFamily: "Neptune" }}>
                  SaLES LinE CHaRt
                </h4>
                <div className="col text-right">
                  <i
                    className="fas fa-2x fa-file-pdf text-danger"
                    style={{ cursor: "pointer" }}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Download as pdf"
                    onClick={() => {
                      this.downloadPDF("#salesLineChart");
                    }}
                  ></i>
                </div>
              </div>
              <br />
              <div className="card-body">
                <Line
                  data={slc}
                  width={100}
                  height={400}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return <Redirect to="/Chef/Login"></Redirect>;
    }
  }
}
