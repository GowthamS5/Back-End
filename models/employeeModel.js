const db = require('../config/database');
const SP = require('./SP');

class EmployeeModel {
  static createEmployee(employeeData, callback) {
    const procedure = SP.createEmployee.name;
    const countProcedure = SP.countEmployeesWithDOB.name;

    const formattedDOB = new Date(employeeData.DOB).toISOString().split('T')[0];
    const parameterValues = Object.values(employeeData);

    db.query(countProcedure, [formattedDOB], (countErr, countResult) => {
      if (countErr) {
        console.error('Error checking DOB:', countErr);
        return callback(countErr, null);
      }

      const count = countResult[0][0].count;

      if (count > 0) {
        return callback({ message: 'An employee with the same Date of Birth already exists.' }, null);
      }

      db.query(procedure, parameterValues, (createErr, createResult) => {
        if (createErr) {
          console.error('Error creating employee:', createErr);
          return callback(createErr, null);
        }
        callback(null, createResult);
      });
    });
  }

  static updateEmployee(employeeId, employeeData, callback) {
    const procedure = SP.updateEmployee.name;
    const parameterValues = [employeeId, ...Object.values(employeeData)];

    db.query(procedure, parameterValues, (err, results) => {
      if (err) {
        console.error('Error updating employee:', err);
        callback(err, null);
      } else {
        console.log('Employee updated:', results);
        callback(null, results);
      }
    });
  }

  static deleteEmployee(employeeId, callback) {
    const getProcedure = SP.getEmployee.name; 
    let deletedEmployee;

    db.query(getProcedure, [employeeId], (err, rows) => {
      if (!err && rows.length > 0) {
        deletedEmployee = rows[0];

        const deleteProcedure = SP.deleteEmployee.name;
        db.query(deleteProcedure, [employeeId], (deleteErr, result) => {
          if (deleteErr) {
            console.error(deleteErr);
            return callback(deleteErr, null);
          }
          callback(null, { message: `Employee with ID ${employeeId} deleted.`, deletedEmployee });
        });
      } else {
        return callback({ message: 'Employee not found' }, null);
      }
    });
  }

  static getEmployeeDetails(userRole, employeeId, callback) {
    const procedure = SP.getEmployeeDetails.name; 
    const parameterValues = [userRole, employeeId];

    db.query(procedure, parameterValues , (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, results[0]);   
      }
    });
  }
}

module.exports = EmployeeModel;
