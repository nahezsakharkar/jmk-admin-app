const Sequelize = require('sequelize');
const sequalize = require('../config/database');

const House = sequalize.define("House",{
    id : {
        type: Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    house_name : {
        type: Sequelize.STRING,
        allowNull : true,
    },
    panchayat_house_no : {
        type: Sequelize.STRING,
        allowNull : true,
        unique: true
    },
    house_no : {
        type: Sequelize.STRING,
        allowNull : false,
        unique: true
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
    }
});

module.exports = House;