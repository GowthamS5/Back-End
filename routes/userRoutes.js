const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const UserController = require('../controllers/UserController');

const Swal = require('sweetalert2');

const secret = process.env.SECRECT_KEY || 'key';

router.post('/login', UserController.loginUser);


module.exports = router;