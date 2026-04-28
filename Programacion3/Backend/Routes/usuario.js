const express = require('express');
const router = express.Router();

const usuarioController = require('../Controllers/usuarioController');
router.get('/', usuarioController.list);
router.post('/', usuarioController.save);
router.delete('/:userid', usuarioController.delete);
router.get('/:userid', usuarioController.edit);
router.post('/:userid', usuarioController.update);

module.exports = router;