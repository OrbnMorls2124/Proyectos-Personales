const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query(`
            SELECT u.*, 
                   emp.nombre as empresa, 
                   s.sucursal, 
                   tu.tipo as tipo_usuario, 
                   e.nombres as nombre_empleado, e.apellidos as apellido_empleado
            FROM usuario u
            LEFT JOIN empresa emp ON u.idempresa = emp.idempresa
            LEFT JOIN sucursales s ON u.idsuc = s.idsuc
            LEFT JOIN tipousuario tu ON u.idtpusuario = tu.idtpusuario
            LEFT JOIN empleados e ON u.idemp = e.idemp
        `,(err,usuario) =>{
            if(err){
                res.json(err);
            }
            res.json(usuario);
        });

    });

};

controller.edit = (req, res) => {

    const {userid}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from usuario where userid=?', [userid], (err,usuario) => {
            res.json(usuario[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into usuario set?', [data], (err,usuario) => {
        res.json(usuario);
       });
   })
};

controller.update = (req,res) =>{

    const {userid}= req.params;
    const nuevo_usuario = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update usuario set ? where userid =?', [nuevo_usuario, userid], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {userid}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from usuario where userid =?', [userid], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;