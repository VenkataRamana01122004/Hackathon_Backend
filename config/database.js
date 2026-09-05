const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    "hackathondb",
    "root",
    "admin@123",
    {
        host: "localhost",
        dialect: "mysql",
        logging: false,
    }
);

module.exports = sequelize;