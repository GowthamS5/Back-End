const EmployeeModel = require('../models/employeeModel');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRECT_KEY;

class EmployeeController {

  static addEmployee(req, res) {
    const schema = Joi.object({
      first_name: Joi.string().min(3).max(50).required(),
      last_name: Joi.string().min(1).max(50).required(),
      department: Joi.string().min(1).max(50).required(),
      salary: Joi.number().min(0).required(),
      DOB: Joi.date().iso().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.number().valid(0, 1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { first_name, last_name, department, salary, DOB, email, password, role } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required.' });
    }

    const formattedDOB = new Date(DOB).toISOString().split('T')[0];
    const imageFilePath = `http://localhost:3001/profile/${req.file.filename}`;

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error(hashErr);
        return res.status(500).json({ message: 'Error adding employee.' });
      }

      EmployeeModel.createEmployee(
        {
          first_name,
          last_name,
          department,
          salary,
          DOB: formattedDOB,
          email,
          password: hash,
          role,
          imageFilePath,
        },
        (err, result) => {
           if (err) {
            if (err.message === 'An employee with the same Date of Birth already exists.') {
              return res.status(400).json({ message: err.message });
            }
            console.error(err);
            return res.status(500).json({ message: 'Error adding employee.' });
          }

          const createdEmployee = {
            first_name,
            last_name,
            department,
            salary,
            DOB: formattedDOB,
            email,
            role,
            image: imageFilePath,
          };

          res.status(201).json({ message: 'Employee added successfully', employeeDetails: createdEmployee });
        }
      );
    });
  }

  static updateEmployee(req, res) {
    const employeeId = req.params.id;

    const {
      first_name,
      last_name,
      department,
      salary,
      email,
      password,
      role,
      userRole,
    } = req.body;

    console.log('values:', req.body);
    console.log('userRole in controller said:', userRole);

    const schema = Joi.object();
    if (userRole === 0) {
      schema.keys({
        first_name: Joi.string().min(3).max(50).required(),
        last_name: Joi.string().min(1).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        userRole: Joi.number().valid(0).required(),
      });
    } else if (userRole === 1) {
      schema.keys({
        first_name: Joi.string().min(3).max(50).required(),
        last_name: Joi.string().min(1).max(50).required(),
        department: Joi.string().min(1).max(50).required(),
        salary: Joi.number().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.number().valid(0, 1).required(),
        userRole: Joi.number().valid(1).required(),
      });
    }

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error(hashErr);
        return res.status(500).json({ message: 'Error updating employee.' });
      }

      const image = `http://localhost:3001/profile/${req.file.filename}`;

      EmployeeModel.updateEmployee(
        employeeId,
        {
          first_name,
          last_name,
          email,
          password: hash, // Store the hashed password
          role,
          department,
          salary,
          image,
          userRole,
        },
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating employee.' });
          }

          const updatedEmployee = {
            first_name,
            last_name,
            email,
            password: hash, 
            department,
            salary,
            role,
            image: req.file.filename,
          };

          res.json(updatedEmployee);
        }
      );
    });
  }

  static deleteEmployee(req, res) {
    const employeeId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required.' });
    }

    EmployeeModel.deleteEmployee(employeeId, (err, deletedEmployee) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error deleting employee.' });
      }

      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json({ message: `Employee with ID ${employeeId} deleted.`, deletedEmployee });
    });
  }

  static getEmployeeDetails(req, res) {
    const { userRole, employeeId } = req.query;
    console.log('role and employee id in c:', userRole, employeeId);

    EmployeeModel.getEmployeeDetails(userRole, employeeId, (error, data) => {
      if (error) {
        return res.status(500).json({ error: 'An error occurred' });
      }

      res.json(data);
    });
  }
}

module.exports = EmployeeController;
