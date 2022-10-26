const Sequelize = require('sequelize');
const sequalize = require('../config/database');

const JmkPaymentHistory = sequalize.define("JmkPaymentHistory",{
    id : {
        type: Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    payment_status : {
        type: Sequelize.STRING,
        allowNull : false
    },
    payment_mode : {
        type: Sequelize.STRING,
        allowNull : true
    },
    receipt_no : {
        type: Sequelize.STRING,
        allowNull : true,
        unique: true
    },
    paid_on : {
        type : Sequelize.DATEONLY,
        allowNull : true
    },
    details : {
        type: Sequelize.STRING,
        allowNull : true
    }
});

module.exports = JmkPaymentHistory;