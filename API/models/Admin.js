const Sequalize = require('sequelize');
const sequalize = require('../config/database');

const Admin = sequalize.define("Admin",{
    id : {
        type: Sequalize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type: Sequalize.STRING,
        allowNull : false,
        validate : {
            max : 50
        }
    },
    email : {
        type: Sequalize.STRING,
        allowNull : false,
        unique: true
    },
    contact : {
        type: Sequalize.STRING,
        allowNull : false
    },
    password : {
        type: Sequalize.STRING,
        allowNull : false
    },
    position : {
        type: Sequalize.STRING,
        allowNull : false
    },
    admin_for : {
        type: Sequalize.STRING,
        allowNull : false
    },
    isDeleted : {
        type: Sequalize.BOOLEAN,
        allowNull : true,
        default : false
    },
});

module.exports = Admin;