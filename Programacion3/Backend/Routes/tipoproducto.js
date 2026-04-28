const express = require('express');
const router = express.Router();

const tipoproductoController = require('../Controllers/tipoproductoController');
router.get('/', tipoproductoController.list);
router.post('/', tipoproductoController.save);
router.delete('/:idtpprod', tipoproductoController.delete);
router.get('/:idtpprod', tipoproductoController.edit);
router.post('/:idtpprod', tipoproductoController.update);

module.exports = router;