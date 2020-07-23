const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const cors = require("cors");
const mongoose = require("mongoose");
//remove
const path = require("path");
const port = 8008;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const passport = require("passport");

app.use(passport.initialize());
app.use(pino);
app.use(cors());

// For Cloud DB
// mongoose.connect("mongodb+srv://CHEF_IT_OUT:chefitout@01@cluster0-ykwse.mongodb.net/test?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// For Local DB
mongoose.connect("mongodb://localhost:27017/ciodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", function () {
    console.log("db connected");
  })
  .on("error", function () {
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

io.on("connection", (socket) => {
  console.log("server upand running");

  socket.on(
    "chef-send-chat-message",
    (userId, contractId, chefId, roomId, message) => {
      console.log(message);
      User.updateOne(
        { _id: mongoose.Types.ObjectId(userId) },
        {
          $push: {
            "contracts.$[outter].chefs.$[inner].messages": {
              $each: [{ time: new Date.now(), text: message, flag: 0 }], //change Date.now()
            },
          },
        },
        {
          arrayFilters: [
            { "outter._id": mongoose.Types.ObjectId(contractId) },
            { "inner.chefId": chefId },
          ],
        }
      );
      socket.to(roomId).broadcast.emit("chat-message", {
        userId: userId,
        contractId: contractId,
        chefId: chefId,
        message: message,
      });
    }
  );

  socket.on(
    "user-send-chat-message",
    (userId, contractId, chefId, roomId, message) => {
      console.log(message);
      User.updateOne(
        { _id: mongoose.Types.ObjectId(userId) },
        {
          $push: {
            "contracts.$[outter].chefs.$[inner].messages": {
              $each: [{ time: new Date.now(), text: message, flag: 1 }], //change Date.now()
            },
          },
        },
        {
          arrayFilters: [
            { "outter._id": mongoose.Types.ObjectId(contractId) },
            { "inner.chefId": chefId },
          ],
        }
      );
      socket.to(roomId).broadcast.emit("chat-message", {
        userId: userId,
        contractId: contractId,
        chefId: chefId,
        message: message,
      });
    }
  );

  socket.on("getMessages", (userId, contractId, chefId, roomId) => {
    User.aggregate(
      [
        { $match: { _id: mongoose.Types.ObjectId(userId) } },
        { $unwind: "$contracts" },
        { $unwind: "$contracts.chefs" },
        {
          $match: {
            $and: [
              { "contracts._id": { $eq: mongoose.Types.ObjectId(contractId) } },
              { "contracts.chefs.chefId": { $eq: chefId } },
              { "contracts.chefs.roomId": { $eq: roomId } },
            ],
          },
        }, //
      ],
      (err, messg) => {
        if (err) {
          socket.to(roomId).broadcast.emit("prevMessage", "network error");
        } else {
          socket.to(roomId).broadcast.emit("prevMessage", messg);
        }
      }
    );
  });
});

const customer_route = require("./routes/customer/customer");
const deliveryAgent_route = require("./routes/deliveryAgent/delivery_agent");
const chef_route = require("./routes/chef/chef");
const transaction_route = require("./routes/transaction/transaction");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/customer", customer_route);
app.use("/deliveryAgent", deliveryAgent_route);
app.use("/chef", chef_route);
app.use("/transaction", transaction_route);
//app.listen(port, () => console.info("REST API running on port " + port));
server.listen(port, () => console.info("REST API running on port " + port));
