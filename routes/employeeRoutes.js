const express = require('express');
const router = express.Router();
const multer = require('multer');
const EmployeeController = require('../controllers/employeeController');
const path = require('path');

const storage = multer.diskStorage({
  destination: './image',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1000 * 1000,
  },
});

router.post('/add', upload.single('profile'), EmployeeController.addEmployee);
router.get('/details', EmployeeController.getEmployeeDetails);
router.put('/:id', upload.single('profile'), EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
