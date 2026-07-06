const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const managerSchema = new mongoose.Schema(
  {
    managerId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["Manager", "Employee", "Candidate"],
      default: "Manager",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Manager", managerSchema);