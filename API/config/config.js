
const config = {
    PORT : 5000,
    ENCRYPTION_SECRET : "nodeapisecret",
    JWT_SECRET : "nodeapisecret",
    MAILSERVICE : {
        email : "ilyasdabholkar76@gmail.com",
        password : "pvjxtoznbnuhzvyj"
    },
    username: "root",
    password: "",
    host: "localhost",
    database: "jmk",
    dialect: "mysql",
    logging: false,
    port : 3306,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
}

module.exports = config;