const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query(`
            SELECT p.*, 
                   emp.nombre as empresa 
            FROM proveedor p
            LEFT JOIN empresa emp ON p.idempresa = emp.idempresa
        `,(err,proveedor) =>{
            if(err){
                res.json(err);
            }
            res.json(proveedor);
        });

    });

};

controller.edit = (req, res) => {

    const {idprov}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from proveedor where idprov=?', [idprov], (err,proveedor) => {
            res.json(proveedor[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into proveedor set?', [data], (err,proveedor) => {
        res.json(proveedor);
       });
   })
};

controller.update = (req,res) =>{

    const {idprov}= req.params;
    const nuevo_proveedor = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update proveedor set ? where idprov =?', [nuevo_proveedor, idprov], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {idprov}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from proveedor where idprov =?', [idprov], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
