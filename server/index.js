const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

mongoose.connect("mongodb://localhost:27017/ciodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .once("open", function() {
    console.log("db connected");
  })
  .on("error", function() {
    console.log("err: ", error);
  });

// app.get("/api/greeting", (req, res) => {
//   const name = req.query.name || "World";
//   res.setHeader("Content-Type", "application/json");
//   res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
// });

// app.listen(3001, () =>
//   console.log("Express server is running on localhost:3001")
// );
