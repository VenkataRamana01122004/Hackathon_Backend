const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");

const addEmployee = async (req, res) =>{
    try {

        const employee=new Employee(req.body);
        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    }
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
}

const addCandidate = async (req, res) =>{
    try {

        const candidate=new Candidate(req.body);
        const savedcandidate = await candidate.save();
        res.status(201).json(savedcandidate);
    }
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
}

const viewCandidate = async(req,res)=>{
    try 
      {
        const candidatedata = await Candidate.findAll();
        if(candidatedata.length==0)
          res.status(200).send("DATA NOT FOUND");
        res.json(candidatedata);
      } 
      catch (error) 
      {
        res.status(500).send(error.message);
      }
}

const viewEmployee = async(req,res)=>{
    try 
      {
        const employeedata = await Employee.findAll();
        if(employeedata.length==0)
          res.status(200).send("DATA NOT FOUND");
        res.json(employeedata);
      } 
      catch (error) 
      {
        res.status(500).send(error.message);
      }
}

module.exports = {
    addEmployee,addCandidate,viewCandidate,viewEmployee
};