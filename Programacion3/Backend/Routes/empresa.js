const express = require('express');
const router = express.Router();

const empresaController = require('../Controllers/empresaController');
router.get('/', empresaController.list);
router.post('/', empresaController.save);
router.delete('/:idempresa', empresaController.delete);
router.get('/:idempresa', empresaController.edit);
router.post('/:idempresa', empresaController.update);

module.exports = router;
