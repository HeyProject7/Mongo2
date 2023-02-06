const express = require('express');
const router = express.Router();
const loginUser = require('../controller/loginUser')
router.post('/',loginUser.handleLogin);
module.exports = router;