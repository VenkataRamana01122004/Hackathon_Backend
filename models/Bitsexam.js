const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Bitsexam = sequelize.define(
  "Bitsexam",
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

    timeLeft: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    statuses: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    questions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    violations: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        fullscreenExits: 0,
        tabSwitches: 0,
        isBlurred: false,
        isOffline: false,
      },
    },

    logs: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    systemInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },

    videoName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    videoPath: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "exam_bits_submissions",
    timestamps: true,
  }
);

module.exports = Bitsexam;