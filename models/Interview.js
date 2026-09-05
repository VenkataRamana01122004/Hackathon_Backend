// models/Interview.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Interview = sequelize.define(
  "Interview",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    answers: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    processes: {
        type: DataTypes.JSON,
        allowNull: false,
    },

    videoName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    videoPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    interviewStartTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    interviewEndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    totalInterviewTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    timeTaken: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

     tabSwitchCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },


  },
  {
    tableName: "interviews",
    timestamps: true,
  }
);

module.exports = Interview;