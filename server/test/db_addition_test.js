const mocha = require("mocha");
const assert = require("assert");
const Customer = require("../models/user.model");

describe("saving records", function() {
  it("user addition", function(done) {
    var char = new Customer({
      username: "xyz"
    });

    char.save().then(function() {
      assert(char.isNew === false);
      done();
    });
  });
});
