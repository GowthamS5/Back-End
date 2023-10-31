const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'key';
const UserModel = require('../models/UserModel');
const Joi = require('joi');
const Swal = require('sweetalert2');

class UserController {
  static async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      } else {
        const { userId, role, employee_id } = user;
        const token = jwt.sign(
          { userId, role, employee_id },
          secret,
          { expiresIn: '1h' }
        );

        console.log(`User ID: ${userId}, Role: ${role}, Employee ID: ${employee_id}`);

        res.status(200).json({
          status: true,
          msg: 'Login successful',
          data: { role, employee_id, token },
        });
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = UserController;
