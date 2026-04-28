const controller = {};

controller.list = (req, res) => {
    req.getConnection((error,conn) =>{
        conn.query('select *from formapago',(err,formapago) =>{
            if(err){
                res.json(err);
            }
            res.json(formapago);
        });

    });

};

controller.edit = (req, res) => {

    const {idfpago}= req.params;
   
    req.getConnection((err,conn) =>{
        conn.query('select *from formapago where idfpago=?', [idfpago], (err,formapago) => {
            res.json(formapago[0]);

        });

    });

};

controller.save = (req,res) =>{
    const data = req.body;
   req.getConnection((err,conn)=> {
       conn.query('insert into formapago set?', [data], (err,formapago) => {
        res.json(formapago);
       });
   })
};

controller.update = (req,res) =>{

    const {idfpago}= req.params;
    const nuevo_formapago = req.body;
  
    req.getConnection((err, conn) => {
        conn.query('update formapago set ? where idfpago =?', [nuevo_formapago, idfpago], (err,rows) =>{ 
            res.json({ message: "Registro Actualizado" }); 

        });
    });
};

controller.delete = (req,res) =>{
    const {idfpago}= req.params; 
  req.getConnection((err,conn) => {
      conn.query('delete from formapago where idfpago =?', [idfpago], (err, rows) => {
        res.json({ message: "Registro Eliminado" }); 
      });
  })
};

module.exports =controller;
