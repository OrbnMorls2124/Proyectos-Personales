const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query(`
            SELECT a.*, 
                   emp.nombre as empresa, 
                   s.sucursal 
            FROM areas_trabajo a
            LEFT JOIN empresa emp ON a.idempresa = emp.idempresa
            LEFT JOIN sucursales s ON a.idsuc = s.idsuc
        `,(err,areas_trabajo) =>{
            if(err){
                res.json(err);
            }
            res.json(areas_trabajo);
        });

    });

};

controller.edit = (req, res) => {

    const {idarea}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from areas_trabajo where idarea=?', [idarea], (err,area_trabajo) => {
            res.json(area_trabajo[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into areas_trabajo set?', [data], (err,area_trabajo) => {
        res.json(area_trabajo);
       });
   })
};

controller.update = (req,res) =>{

    const {idarea}= req.params;
    const nuevo_area = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update areas_trabajo set ? where idarea =?', [nuevo_area, idarea], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {idarea}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from areas_trabajo where idarea =?', [idarea], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
