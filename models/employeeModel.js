const db = require('../config/database');

class EmployeeModel {
static createEmployee(employeeData, callback) {
    const {
      first_name,
      last_name,
      department,
      salary,
      DOB,
      email,
      password,
      role,
      imageFilePath
    } = employeeData;
    const formattedDOB = new Date(DOB).toISOString().split('T')[0];
    const createProcedure = 'createem';

       db.query('CALL CountEmployeesWithDOB(?)', [formattedDOB], (err, results) => {
      if (err) {
        console.error('Error calling stored procedure:', err);
        return callback(err, null);
      }

      const count = results[0][0].count;

      if (count > 0) {
        return callback({ message: 'An employee with the same Date of Birth already exists.' }, null);
      }

        db.query(
          `CALL ${createProcedure}(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [first_name, last_name, department, salary, formattedDOB, email, password, role, imageFilePath],
          (err, result) => {
            if (err) {
              console.error(err);
              return callback(err, null);
            }
            callback(null, result);
          }
        );
      }
    );
  }


static updateEmployee(employeeId, employeeData, callback) {
    const { first_name, last_name, email, password, role, department, salary, image ,userRole,} = employeeData;
  console.log('userRole in model:',userRole);
  console.log('value in model:', employeeData);
    db.query(
      'CALL UpdateEmployee5(?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
      [employeeId, first_name, last_name, email, password, role, department, salary, image,userRole,],
      (err, results) => {
        if (err) {
          console.error('Error updating employee:', err);
          callback(err, null);
        } else {
          console.log('Employee updated:', results);
          callback(null, results);
        }
      }
    );
  }



  static deleteEmployee(employeeId, callback) {
    const getProcedure = 'Getem';
    let deletedEmployee;

    db.query(`CALL ${getProcedure}(?)`, [employeeId], (err, rows) => {
      if (!err && rows.length > 0) {
        deletedEmployee = rows[0];
        const deleteProcedure = 'Deleteem';

        db.query(`CALL ${deleteProcedure}(?)`, [employeeId], (deleteErr, result) => {
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
  const sql = 'CALL GetEmployeeDetails(?, ?)';
  console.log('in model said:', employeeId,userRole);
  db.query(sql, [userRole, employeeId], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results[0]);
    }
  });
}
}
module.exports = EmployeeModel;
