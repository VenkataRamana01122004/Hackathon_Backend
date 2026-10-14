const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("hackathondb","root","root",{
        host: "localhost",
        dialect: "mysql",
        logging: false,
        timezone: "+00:00",
    }
);

module.exports = sequelize;