const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Manager = require("./Manager");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    employeeId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
      defaultValue: "Employee",
    },

    // Foreign Key
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "managers",
        key: "id",
      },
    },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

// Relationships
Manager.hasMany(Employee, {
  foreignKey: "managerId",
  as: "employees",
});

Employee.belongsTo(Manager, {
  foreignKey: "managerId",
  as: "manager",
});

// Auto Generate EMP0001
Employee.beforeCreate(async (employee) => {
  const lastEmployee = await Employee.findOne({
    order: [["id", "DESC"]],
  });

  let number = 1;

  if (lastEmployee && lastEmployee.employeeId) {
    number =
      parseInt(lastEmployee.employeeId.replace("EMP", "")) + 1;
  }

  employee.employeeId = `EMP${String(number).padStart(4, "0")}`;
});

module.exports = Employee;