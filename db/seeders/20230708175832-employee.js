"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        id: uuid(),
        name: "taofik",
        email: "taofikarianto@gmail.com",
        password: bcrypt.hashSync("kurakura", 10),
        role: "employee",
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