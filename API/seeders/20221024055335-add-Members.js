'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Members', [{
      "name": "Ilyas Dabholkar",
      "email": "ilyasdabholkar9@gmail.com",
      "contact": "7387974125",
      "password": "Pass@123",
      "active_status": true,
      "active_from" : "2013-05-16",
      "head_of_family": true,
      "family_id": 1,
      "isDeleted": false,
      "added_by" : 1,
      "createdAt": new Date(),
      "updatedAt" : new Date()
    },
    {
      "name": "Nahez Sakharkar",
      "email": "nahezsakhakar9@gmail.com",
      "contact": "7357274125",
      "password": "Pass@123",
      "active_status": true,
      "active_from" : "2013-05-16",
      "head_of_family": true,
      "family_id": 2,
      "isDeleted": false,
      "added_by" : 1,
      "createdAt": new Date(),
      "updatedAt" : new Date()
    },
    {
      "name": "Zuhair Dabholkar",
      "email": "zuhairdabholkar9@gmail.com",
      "contact": "7388874125",
      "password": "Pass@123",
      "active_status": true,
      "active_from" : "2013-05-16",
      "head_of_family": false,
      "family_id": 1,
      "isDeleted": false,
      "added_by" : 1,
      "createdAt": new Date(),
      "updatedAt" : new Date()
    }
  ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Members', null, {});
  }
};
