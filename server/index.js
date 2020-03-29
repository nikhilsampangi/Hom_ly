const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const cors = require("cors");
const mongoose = require("mongoose");
const port = 8008;
const app = express();

app.use(pino);
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ciodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .once("open", function() {
    console.log("db connected");
  })
  .on("error", function() {
    console.log("db connection err: ", error);
  });

// app.get("/api/greeting", (req, res) => {
//   const name = req.query.name || "World";
//   res.setHeader("Content-Type", "application/json");
//   res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
// });

// app.listen(3001, () =>
//   console.log("Express server is running on localhost:3001")
// );

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const customer_route = require("./routes/customer/customer");
const deliveryAgent_route = require("./routes/deliveryAgent/delivery_agent");
const chef_route = require("./routes/chef/chef");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/customer", customer_route);
app.use("/deliveryAgent", deliveryAgent_route);
app.use("/chef", chef_route);
app.listen(port, () => console.info("REST API running on port " + port));
