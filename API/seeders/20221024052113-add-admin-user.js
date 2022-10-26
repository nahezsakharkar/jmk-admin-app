'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Admins', [{
      "name": "Super Admin",
      "email": "Superadmin@gmail.com",
      "contact": "7387374125",
      "password": "Pass@123",
      "position": "Superadmin",
      "admin_for": "JMK",
      "isDeleted": false,
      "createdAt": new Date(),
      "updatedAt" : new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  }
};
