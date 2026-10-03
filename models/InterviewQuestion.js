
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InterviewQuestion = sequelize.define(
  "InterviewQuestion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    expectedAnswer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    difficulty: {
      type: DataTypes.ENUM("Easy", "Medium", "Hard"),
      allowNull: false,
      defaultValue: "Easy",
    },

    questionType: {
      type: DataTypes.ENUM("Technical", "HR", "Behavioral"),
      allowNull: false,
      defaultValue: "Technical",
    },

    marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "interview_questions",
    timestamps: true,
  }
);

module.exports = InterviewQuestion;