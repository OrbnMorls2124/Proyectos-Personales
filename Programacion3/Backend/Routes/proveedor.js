const express = require('express');
const router = express.Router();

const proveedorController = require('../Controllers/proveedorController');
router.get('/', proveedorController.list);
router.post('/', proveedorController.save);
router.delete('/:idprov', proveedorController.delete);
router.get('/:idprov', proveedorController.edit);
router.post('/:idprov', proveedorController.update);

module.exports = router;