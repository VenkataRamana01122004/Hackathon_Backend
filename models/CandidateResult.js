// models/CandidateResult.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CandidateResult = sequelize.define(
  "CandidateResult",
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

    candidateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // =========================
    // CODING - EACH QUESTION
    // =========================
    coding: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    // =========================
    // MCQ FINAL SUMMARY
    // =========================
    mcq: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },

    // =========================
    // INTERVIEW FINAL SUMMARY
    // =========================
    interview: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },

    // =========================
    // SECURITY / PROCTORING
    // =========================
    security: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },

    // =========================
    // FINAL RESULT
    // =========================
    overallPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },

    overallScore: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },

    resultStatus: {
      type: DataTypes.ENUM(
        "PENDING",
        "COMPLETED",
        "REVIEW"
      ),
      defaultValue: "PENDING",
    },

    // Optional snapshot of the calculated final result
    resultSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    evaluatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "candidate_results",
    timestamps: true,
  }
);

module.exports = CandidateResult;