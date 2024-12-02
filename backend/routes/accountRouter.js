const express = require('express');
const { getAccountDetails, updateAccountDetails } = require('../controllers/accountController');
const router = express.Router();

router.get('/users/:id', getAccountDetails);
router.put('/users/:id', updateAccountDetails);

module.exports = router;
