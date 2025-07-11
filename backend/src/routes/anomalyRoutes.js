const express = require('express');
const router = express.Router();
const controller = require('../controllers/anomalyController');
const validate = require('../middlewares/validate');
const anomalySchemaUpdate = require('../validations/anomalySchemaUpdate');

// CRUD Routes
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validate(anomalySchemaUpdate), controller.create);
router.put('/:id', validate(anomalySchemaUpdate), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
