import React, { Component, Fragment } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import FrontPage from "./front_page/FrontPage";
import Cust from "./customer/Cust";
import Chef from "./chef/Chef";
import Staff from "./transport/Staff";

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: "",
//       greeting: ""
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event) {
//     this.setState({ name: event.target.value });
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
//       .then(response => response.json())
//       .then(state => this.setState(state));
//   }
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <form onSubmit={this.handleSubmit}>
//             <label htmlFor="name">Enter your name: </label>
//             <input
//               id="name"
//               type="text"
//               value={this.state.name}
//               onChange={this.handleChange}
//             />
//             <button type="submit">Submit</button>
//           </form>
//           <p>{this.state.greeting}</p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

export default class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Switch>
            <Route exact path="/" component={FrontPage} />
            <Route exact path="/Home" component={Cust} />
            <Route exact path="/Chef" component={Chef} />
            <Route exact path="/Transport" component={Staff} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}
