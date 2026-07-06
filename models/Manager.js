const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Manager = sequelize.define(
  "Manager",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    managerId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    designation: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    project: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
    },

    role: {
      type: DataTypes.ENUM(
        "Manager",
        "Employee",
        "Candidate"
      ),
      allowNull: false,
      defaultValue: "Manager",
    },
  },
  {
    tableName: "managers",
    timestamps: true,
  }
);

// Auto Generate Manager ID (MGR0001, MGR0002...)
Manager.beforeCreate(async (manager) => {
  const lastManager = await Manager.findOne({
    order: [["id", "DESC"]],
  });

  let number = 1;

  if (lastManager && lastManager.managerId) {
    number =
      parseInt(lastManager.managerId.replace("MGR", "")) + 1;
  }

  manager.managerId = `MGR${String(number).padStart(4, "0")}`;
});

module.exports = Manager;