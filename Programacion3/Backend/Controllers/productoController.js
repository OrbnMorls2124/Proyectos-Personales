const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query(`
            SELECT p.*, 
                   emp.nombre as empresa, 
                   s.sucursal, 
                   tp.tipo as tipo_producto
            FROM producto p
            LEFT JOIN empresa emp ON p.idempresa = emp.idempresa
            LEFT JOIN sucursales s ON p.idsuc = s.idsuc
            LEFT JOIN tipoproducto tp ON p.idtpprod = tp.idtpprod
        `,(err,producto) =>{
            if(err){
                res.json(err);
            }
            res.json(producto);
        });

    });

};

controller.edit = (req, res) => {

    const {num_prod}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from producto where num_prod=?', [num_prod], (err,producto) => {
            res.json(producto[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into producto set?', [data], (err,producto) => {
        res.json(producto);
       });
   })
};

controller.update = (req,res) =>{

    const {num_prod}= req.params;
    const nuevo_producto = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update producto set ? where num_prod =?', [nuevo_producto, num_prod], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {num_prod}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from producto where num_prod =?', [num_prod], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
