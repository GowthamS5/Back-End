const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const db = require('./config/database');

const app = express();

app.use('/profile', express.static('image'));
app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/employees', employeeRoutes);


const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
