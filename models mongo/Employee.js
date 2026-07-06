const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
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

    // Foreign Key -> Manager Collection
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      required: true,
    },

    role: {
      type: String,
      enum: ["Employee"],
      default: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

// Auto Generate EMP0001, EMP0002...
employeeSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const lastEmployee = await this.constructor.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );

  let number = 1;

  if (lastEmployee && lastEmployee.employeeId) {
    number = parseInt(lastEmployee.employeeId.replace("EMP", "")) + 1;
  }

  this.employeeId = `EMP${String(number).padStart(4, "0")}`;

  next();
});

module.exports = mongoose.model("Employee", employeeSchema);