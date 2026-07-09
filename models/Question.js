const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    difficulty: {
      type: DataTypes.ENUM("Easy", "Medium", "Hard"),
      allowNull: false,
      defaultValue: "Easy",
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    constraints: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    inputFormat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    outputFormat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    sampleInput: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    sampleOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    starterCode: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },

    solutionCode: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },

    testCases: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    timeLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },

    memoryLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 256,
    },

    marks: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "questions",
    timestamps: true,
  }
);

module.exports = Question;