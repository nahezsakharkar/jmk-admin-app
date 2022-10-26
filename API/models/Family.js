const Sequelize = require('sequelize');
const sequalize = require('../config/database');


const Family = sequalize.define("Family", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    family_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    family_head: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isDeleted : {
        type: Sequelize.BOOLEAN,
        allowNull : true,
        default : false
    },
    deletedOn : {
        type : Sequelize.DATEONLY,
        allowNull : true
    },
    deletedBy : {
        type : Sequelize.INTEGER,
        allowNull : true
    },
});

module.exports = Family;