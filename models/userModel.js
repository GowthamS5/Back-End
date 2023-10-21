const db = require('../config/database');

class UserModel {
  static getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'CALL GetUserByEmail(?)'; 
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
