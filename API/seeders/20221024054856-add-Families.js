'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Families', [{
        "family_head" : "Ilyas Dabholkar",
        "house_no" : 1,
        "isDeleted": false,
        "added_by" : 1,
        "family_id":"FH001Test",
        "createdAt": new Date(),
        "updatedAt" : new Date()
    },{
      "family_head" : "Nahez Sakharkar",
      "house_no" : 2,
      "isDeleted": false,
      "added_by" : 1,
      "family_id":"FH002Test",
      "createdAt": new Date(),
      "updatedAt" : new Date()
  }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Families', null, {});
  }
};
