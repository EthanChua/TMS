const express = require('express');
const router = express.Router();

// Importing route1 controller methods
const { getR1 } = require('../controllers/r1Controller')

router.route('/route1').get(getR1);

module.exports = router;