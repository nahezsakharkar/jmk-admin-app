const Sequelize = require('sequelize');
const sequalize = require('../config/database');

const JmkYear = sequalize.define("JmkYear",{
    id : {
        type: Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    start_year : {
        type: Sequelize.INTEGER,
        allowNull : false,
        unique : true
    },
    end_year : {
        type: Sequelize.INTEGER,
        allowNull : false,
        unique : true
    },
    amount : {
        type: Sequelize.FLOAT,
        allowNull : false
    },
});

module.exports = JmkYear;