const db = require('../config/database');
const SP = require('./SP');

class UserModel {
  static getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = SP.GetUserByEmail.name; 
      db.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0][0]);
        }
      });
    });
  }
}

module.exports = UserModel;
