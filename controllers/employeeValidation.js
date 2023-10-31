const Joi = require('joi');

const addEmployeeSchema = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  last_name: Joi.string().min(1).max(50).required(),
  department: Joi.string().min(1).max(50).required(),
  salary: Joi.number().min(2).required(),
  DOB: Joi.date().iso().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.number().valid(0, 1).required(),
});

const updateEmployeeSchema = (userRole) => {
  let schema = Joi.object();

  if (userRole === 0) {
    schema = schema.keys({
      first_name: Joi.string().min(3).max(50).required(),
      last_name: Joi.string().min(1).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      userRole: Joi.number().valid(0).required(),
    });
  } else if (userRole === 1) {
    schema = schema.keys({
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

  return schema;
};

module.exports = {
  addEmployeeSchema,
  updateEmployeeSchema,
};
