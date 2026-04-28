const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query(`
            SELECT s.*, 
                   emp.nombre as empresa 
            FROM sucursales s
            LEFT JOIN empresa emp ON s.idempresa = emp.idempresa
        `,(err,sucursales) =>{
            if(err){
                res.json(err);
            }
            res.json(sucursales);
        });

    });

};

controller.edit = (req, res) => {

    const {idsuc}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from sucursales where idsuc=?', [idsuc], (err,sucursales) => {
            res.json(sucursales[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into sucursales set?', [data], (err,sucursales) => {
        res.json(sucursales);
       });
   })
};

controller.update = (req,res) =>{

    const {idsuc}= req.params;
    const nuevo_sucursal = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update sucursales set ? where idsuc =?', [nuevo_sucursal, idsuc], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {idsuc}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from sucursales where idsuc =?', [idsuc], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
