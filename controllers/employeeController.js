const EmployeeModel = require('../models/employeeModel');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRECT_KEY;
const { addEmployeeSchema, updateEmployeeSchema } = require('./employeeValidation');


class EmployeeController {

  static addEmployee(req, res) {
    const { error } = addEmployeeSchema.validate(req.body);

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
              return res.status(400).json({ status: false, message: 'fail', data: null });
            }
            console.error(err);
            return res.status(500).json({ status: false, message: 'Error add employees', data: null });
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

           res.status(201).json({ status: true, message: 'Employee Add Successful', data: createdEmployee });
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

    const schema = updateEmployeeSchema(userRole);

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error(hashErr);
        return res.status(500).json({  status: false, message: 'Error updating employee.' });
      }

      const image = `http://localhost:3001/profile/${req.file.filename}`;

      EmployeeModel.updateEmployee(
        employeeId,
        {
          first_name,
          last_name,
          email,
          password: hash,
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

         res.json({ status: true, message: 'Updated Successful', data: updatedEmployee });
        }
      );
    });
  }

  static deleteEmployee(req, res) {
    const employeeId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ status: false, message: 'Employee ID is required.' });
    }

    EmployeeModel.deleteEmployee(employeeId, (err, deletedEmployee) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Error deleting employee.' });
      }

      if (!deletedEmployee) {
        return res.status(404).json({ status: false,message: 'Employee not found' });
      }

      res.status(200).json({ status: true, message: `Employee with ID ${employeeId} deleted.`, data:deletedEmployee });
    });
  }

  static getEmployeeDetails(req, res) {
    const { userRole, employeeId } = req.query;
    console.log('role and employee id in c:', userRole, employeeId);

    EmployeeModel.getEmployeeDetails(userRole, employeeId, (error, data) => {
      if (error) {
        return res.status(500).json({ status: false, error: 'An error occurred' });
      }

        res.status(200).json({ status: true, message: 'success',  data });
    });
  }
}

module.exports = EmployeeController;
