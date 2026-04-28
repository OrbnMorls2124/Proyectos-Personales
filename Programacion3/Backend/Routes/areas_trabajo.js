const express = require('express');
const router = express.Router();

const areasController = require('../Controllers/areasController');
router.get('/', areasController.list);
router.post('/', areasController.save);
router.delete('/:idarea', areasController.delete);
router.get('/:idarea', areasController.edit);
router.post('/:idarea', areasController.update);

module.exports = router;