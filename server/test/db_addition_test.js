const mocha = require("mocha");
const assert = require("assert");
const Customer = require("../models/user.model");

describe("saving records", function() {
  it("user addition", function(done) {
    var char = new Customer({
      firstname: "xyz",
      lastname: "abc",
      hashedPassword: "a",
      email: "a@a.com"
    });

    char.save().then(function() {
      assert(char.isNew === false);
      done();
    });
  });
});
