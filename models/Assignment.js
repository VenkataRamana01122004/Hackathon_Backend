const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Question = require("./Question");

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

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "questions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    writtenCode: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    processes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    videoName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    videoPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    selected: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    keyStrokeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    keyLogs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    mouseClickCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    tabShifts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    testCasesPassed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalTestCases: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "assessments",
    timestamps: true,
  }
);

// Relationship
Question.hasMany(Assessment, {
  foreignKey: "questionId",
  as: "assessments",
});

Assessment.belongsTo(Question, {
  foreignKey: "questionId",
  as: "question",
});

module.exports = Assessment;