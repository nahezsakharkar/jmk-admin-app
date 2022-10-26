'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Houses', [{
        "panchayat_house_no":"H00111",
        "house_no" : "H00111",
        "house_name" : "Dabholkar House",
        "added_by" : 1,
        "isDeleted": false,
        "createdAt": new Date(),
        "updatedAt" : new Date()
    },
    {
      "panchayat_house_no":"H00112",
      "house_no" : "H00112",
      "house_name" : "Sakharkar House",
      "added_by" : 1,
      "isDeleted": false,
      "createdAt": new Date(),
      "updatedAt" : new Date()
  }], {});
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Houses', null, {});
  }
};
