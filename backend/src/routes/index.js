const express = require('express');
const router = express.Router();

router.use('/anomalies', require('./anomalyRoutes'));

module.exports = router;
