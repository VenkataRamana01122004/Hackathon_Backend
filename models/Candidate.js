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
       type: DataTypes.STRING(100),
      defaultValue: "0 Years",
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
        "Completed",
        "Rejected",
        "Interview Scheduled",
        "Eligible",
        "Qualified"
      ),
      defaultValue: "Registered",
    },

    role: {
      type: DataTypes.ENUM("Candidate"),
      defaultValue: "Candidate",
    },
    appliedRole: {
      type: DataTypes.STRING(255),
      defaultValue: "Not Decided",
    },
    bitsExamStatus: {
      type: DataTypes.ENUM("Pending", "Passed", "Failed", "Not Applicable","Process"),
      defaultValue: "Pending",
    },
    codingExamStatus: {
      type: DataTypes.ENUM("Pending", "Passed", "Failed", "Not Applicable","Process"),
      defaultValue: "Pending",
    },

    interviewStatus: {
      type: DataTypes.ENUM("Pending", "Scheduled", "Completed", "Passed", "Failed", "Cancelled"),
      defaultValue: "Pending",
    },
    interviewSchedule: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    assignedEmployeeId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "candidates",
    timestamps: true,
  }
);

// Auto Generate CAN0001
Candidate.beforeValidate(async (candidate) => {
  if (candidate.candidateId) return;

  const lastCandidate = await Candidate.findOne({
    order: [["id", "DESC"]],
  });

  let number = 1;

  if (lastCandidate && lastCandidate.candidateId) {
    number =
      parseInt(lastCandidate.candidateId.replace("CAN", ""), 10) + 1;
  }

  let newCandidateId = `CAN${String(number).padStart(4, "0")}`;

  // Check duplicate
  let exists = await Candidate.findOne({
    where: {
      candidateId: newCandidateId,
    },
  });

  while (exists) {
    number++;
    newCandidateId = `CAN${String(number).padStart(4, "0")}`;

    exists = await Candidate.findOne({
      where: {
        candidateId: newCandidateId,
      },
    });
  }

  candidate.candidateId = newCandidateId;
});

module.exports = Candidate;