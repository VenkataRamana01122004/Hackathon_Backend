const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Candidate = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    candidateId: {
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

    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    qualification: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    experience: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    resume: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "Registered",
        "Scheduled",
        "Interviewing",
        "Completed",
        "Selected",
        "Rejected"
      ),
      defaultValue: "Registered",
    },

    role: {
      type: DataTypes.ENUM("Candidate"),
      defaultValue: "Candidate",
    },
  },
  {
    tableName: "candidates",
    timestamps: true,
  }
);

// Auto Generate CAN0001
Candidate.beforeCreate(async (candidate) => {
  const lastCandidate = await Candidate.findOne({
    order: [["id", "DESC"]],
  });

  let number = 1;

  if (lastCandidate && lastCandidate.candidateId) {
    number =
      parseInt(lastCandidate.candidateId.replace("CAN", "")) + 1;
  }

  candidate.candidateId = `CAN${String(number).padStart(4, "0")}`;
});

module.exports = Candidate;