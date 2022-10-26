const Sequalize = require('sequelize');

const sequalize = new Sequalize("jmk", "root", "", {
    // host: "localhost",
    // dialect: "mysql",
    // logging: false,
    // port : 3308,
    // pool: {
    //     max: 5,
    //     min: 0,
    //     idle: 10000
    // },
    host: "localhost",
    dialect: "mysql",
    logging: false,
    port : 3306,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

module.exports = sequalize;