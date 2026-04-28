const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from empresa',(err,empresa) =>{
            if(err){
                res.json(err);
            }
            res.json(empresa);
        });

    });

};

controller.edit = (req, res) => {

    const {idempresa}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from empresa where idempresa=?', [idempresa], (err,empresa) => {
            res.json(empresa[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into empresa set?', [data], (err,empresa) => {
        res.json(empresa);
       });
   })
};

controller.update = (req,res) =>{

    const {idempresa}= req.params;
    const nuevo_empresa = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update empresa set ? where idempresa =?', [nuevo_empresa, idempresa], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {idempresa}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from empresa where idempresa =?', [idempresa], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
