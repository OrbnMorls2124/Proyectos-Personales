const express = require('express');
const router = express.Router();
const DatabaseController = require('../Controllers/databaseController');

// Obtener todas las tablas de la base de datos
router.get('/tables', DatabaseController.getAllTables);

// Obtener la estructura de una tabla específica
router.get('/tables/:tableName/structure', DatabaseController.getTableStructure);

// Obtener datos de una tabla específica con paginación
router.get('/tables/:tableName/data', DatabaseController.getTableData);

module.exports = router;
