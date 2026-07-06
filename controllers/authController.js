const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        // Search Manager
        let user = await Manager.findOne({ where: { email } });

        if (user) {
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            return res.json({
                success: true,
                role: "Manager",
                user
            });
        }

        // Search Employee
        user = await Employee.findOne({ where: { email } });

        if (user) {
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            return res.json({
                success: true,
                role: "Employee",
                user
            });
        }

        // Search Candidate
        user = await Candidate.findOne({ where: { email } });

        if (user) {
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            return res.json({
                success: true,
                role: "Candidate",
                user
            });
        }

        return res.status(404).json({
            success: false,
            message: "User not found"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    login
};