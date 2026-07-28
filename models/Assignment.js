const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Assessment = sequelize.define(
  "Assessment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    candidateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    assignmentStartTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    totalTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    submitReason: {
      type: DataTypes.STRING,
      defaultValue: "manual",
    },

    timerExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    videoName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    videoPath: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    systemInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    proctoring: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },

    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "assessments",
    timestamps: true,
  }
);

module.exports = Assessment;