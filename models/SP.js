module.exports = {
  createEmployee: {
    name: 'CALL createem(?, ?, ?, ?, ?, ?, ?, ?, ?)',
    parameters: ['first_name', 'last_name', 'department', 'salary', 'DOB', 'email', 'password', 'role', 'imageFilePath'],
  },
  updateEmployee: {
    name: 'CALL UpdateEmployee5(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    parameters: ['employeeId', 'first_name', 'last_name', 'email', 'password', 'role', 'department', 'salary', 'image', 'userRole'],
  },
  deleteEmployee: {
    name: 'CALL Deleteem(?)',
    parameters: ['employeeId'],
  },
  getEmployee: {
    name: 'CALL Getem(?)',
    parameters: ['employeeId'],
  },
  getEmployeeDetails: {
    name: 'CALL GetEmployeeDetails(?, ?)',
parameters :['userRole', 'employeeId'],
  },
  countEmployeesWithDOB: {
    name: 'CALL CountEmployeesWithDOB(?)',
    parameters: ['formattedDOB'],
  },
 GetUserByEmail : {
   name:'CALL GetUserByEmail(?)',
   parameters:['email'],
},

};
