const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CandidateProcessLog = sequelize.define(
  "CandidateProcessLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "candidate_id",
      comment: "ID of the candidate whose processes were collected",
    },

    processes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: "List of running process names",
    },

    processCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "process_count",
      comment: "Total number of collected processes",
    }
  },
  {
    tableName: "candidate_process_logs",
    timestamps: true,
  }
);

module.exports = CandidateProcessLog;
