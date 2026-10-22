const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("hackathondb","root","root",{
        host: "localhost",
        dialect: "mysql",
        logging: false,
        timezone: "+00:00",
    }
);

module.exports = sequelize;



// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("appdb", "appuser", "root@123", {
//     host: "127.0.0.1",
//     port: 3307,
//     dialect: "mysql",
//     logging: false,
//     timezone: "+00:00",
// });

// module.exports = sequelize;
