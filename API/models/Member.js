const Sequalize = require('sequelize');
const sequalize = require('../config/database');

const Member = sequalize.define("Member",{
    id : {
        type: Sequalize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type: Sequalize.STRING,
        allowNull : false
    },
    email : {
        type: Sequalize.STRING,
        allowNull : false,
        unique : true
    },
    contact : {
        type: Sequalize.STRING,
        allowNull : false
    },
    password : {
        type: Sequalize.STRING,
        allowNull : false
    },
    active_status : {
        type: Sequalize.BOOLEAN,
        allowNull : false
    },
    active_from : {
        type : Sequalize.DATEONLY,
        allowNull : true,
    },
    head_of_family : {
        type: Sequalize.BOOLEAN,
        allowNull : false
    },
    inactivity_reason : {
        type: Sequalize.STRING,
        allowNull : true
    },
    isDeleted : {
        type: Sequalize.BOOLEAN,
        allowNull : true,
        default : false
    },
});

module.exports = Member;

