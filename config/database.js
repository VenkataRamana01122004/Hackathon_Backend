const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "hackathondb",
    "root",
    "root",
    {
        host: "localhost",
        dialect: "mysql",
        logging: false,
    }
);

module.exports = sequelize;