"use strict";
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        id: uuid(),
        name: "dns",
        email: "dns@gmail.com",
        password: bcrypt.hashSync("kurakuraberlari", 10),
        role: "admin",
        phone: "+6285210215793",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
