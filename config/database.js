const mysql = require('mysql');
const dotenv = require ('dotenv');
dotenv.config({path:"./../process.env"});

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('Connected to the Mysql Database');
});

module.exports = connection;
