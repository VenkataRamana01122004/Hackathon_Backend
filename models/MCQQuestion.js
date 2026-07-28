const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MCQQuestion = sequelize.define(
  "MCQQuestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    questionType: {
      type: DataTypes.ENUM("SINGLE", "MULTIPLE"),
      allowNull: false,
      defaultValue: "SINGLE",
    },

    options: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    correctAnswers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    difficulty: {
      type: DataTypes.ENUM("Easy", "Medium", "Hard"),
      defaultValue: "Easy",
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    marks: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    negativeMarks: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "mcq_questions",
    timestamps: true,
  }
);

module.exports = MCQQuestion;