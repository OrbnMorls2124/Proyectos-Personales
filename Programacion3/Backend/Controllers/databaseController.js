const DatabaseController = {};

DatabaseController.getAllTables = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }
        
        const query = 'SHOW TABLES';
        conn.query(query, (err, tables) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener las tablas' });
            }
            
            // Formatear la respuesta para que sea más legible
            const tableNames = tables.map(table => {
                const tableName = Object.values(table)[0];
                return {
                    name: tableName,
                    description: `Tabla: ${tableName}`
                };
            });
            
            res.json({
                success: true,
                database: 'ventas',
                totalTables: tableNames.length,
                tables: tableNames
            });
        });
    });
};

DatabaseController.getTableStructure = (req, res) => {
    const { tableName } = req.params;
    
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }
        
        const query = `DESCRIBE ${tableName}`;
        conn.query(query, (err, structure) => {
            if (err) {
                return res.status(500).json({ error: `Error al obtener la estructura de la tabla ${tableName}` });
            }
            
            res.json({
                success: true,
                table: tableName,
                structure: structure
            });
        });
    });
};

DatabaseController.getTableData = (req, res) => {
    const { tableName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }
        
        const query = `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`;
        conn.query(query, [limit, offset], (err, data) => {
            if (err) {
                return res.status(500).json({ error: `Error al obtener datos de la tabla ${tableName}` });
            }
            
            // Obtener el total de registros
            const countQuery = `SELECT COUNT(*) as total FROM ${tableName}`;
            conn.query(countQuery, (err, countResult) => {
                if (err) {
                    return res.status(500).json({ error: `Error al contar registros de la tabla ${tableName}` });
                }
                
                res.json({
                    success: true,
                    table: tableName,
                    totalRecords: countResult[0].total,
                    currentPage: Math.floor(offset / limit) + 1,
                    data: data
                });
            });
        });
    });
};

module.exports = DatabaseController;
