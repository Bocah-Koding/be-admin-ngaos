const { User } = require("../models");
module.exports = {
  // find user by email
  async findEmail(email) {
    return User.findOne({
      where: {
        email,
      },
    });
  },
};
