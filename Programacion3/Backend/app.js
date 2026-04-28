const express= require('express');
const morgan = require('morgan');
const path= require('path');
const mysql= require('mysql');
const cors = require('cors');
const myConnection= require('express-myconnection');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const app= express();


app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true
}));
// rutas backend
const authRoutes = require('./Routes/auth');
const empresaRoutes = require('./Routes/empresa');
const sucursalesRoutes = require('./Routes/sucursales');
const proveedorRoutes = require('./Routes/proveedor');
const area_trabajoRoutes=require('./Routes/areas_trabajo');
const empleadosRoutes=require('./Routes/empleados');
const tipousuarioRoutes=require('./Routes/tipousuario');
const usuarioRoutes=require('./Routes/usuario');
const clientesRoutes=require('./Routes/clientes');
const tipoproductoRoutes=require('./Routes/tipoproducto');
const productoRoutes=require('./Routes/producto');
const formapagoRoutes=require('./Routes/formapago');
const databaseRoutes=require('./Routes/database');
const { requireAuth } = require('./middleware/auth');

app.set('port', process.env.PORT || 3000);

  app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(myConnection(mysql,{
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'ventas'
}, 'single'));
app.use(express.urlencoded({extended: false}));

var bodyParser = require('body-parser');
 // create application/json parser
app.use(bodyParser.json());
app.use(cookieParser());

//Rutas de FrontEnd
app.use('/api/auth', authRoutes)
app.use('/api', requireAuth);
app.use('/api/empresa', empresaRoutes)
app.use('/api/sucursales', sucursalesRoutes)
app.use('/api/proveedor', proveedorRoutes)
app.use('/api/areastrabajo',area_trabajoRoutes)
app.use('/api/empleados', empleadosRoutes)
app.use('/api/tipousuario', tipousuarioRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/tipoproducto', tipoproductoRoutes)
app.use('/api/producto', productoRoutes)
app.use('/api/formapago', formapagoRoutes)
app.use('/api/database', databaseRoutes)
app.use(express.static(path.join(__dirname,'public')));

//inicializando el server
app.listen(app.get('port'), () =>{
    console.log("PUERTO 3000");
});	


