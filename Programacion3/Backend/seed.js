const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'ventas',
  multipleStatements: true
});

const sql = `
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE usuario;
TRUNCATE TABLE empleados;
TRUNCATE TABLE clientes;
TRUNCATE TABLE producto;
TRUNCATE TABLE proveedor;
TRUNCATE TABLE formapago;
TRUNCATE TABLE areas_trabajo;
TRUNCATE TABLE tipoproducto;
TRUNCATE TABLE tipousuario;
TRUNCATE TABLE sucursales;
TRUNCATE TABLE empresa;

SET FOREIGN_KEY_CHECKS = 1;

-- EMPRESA
INSERT INTO empresa (idempresa, nombre, direccion, rtn, telefono, correo, contacto, fecha_creacion, estado) VALUES
(1, 'TechnoSolutions HN', 'Blvd. Morazán, Torre Corporativa, Tegucigalpa', '0801-1990-00001', '2232-5500', 'info@technosolutions.hn', 'Carlos Mejía', '2020-03-15', 'Activo'),
(2, 'Distribuidora del Norte', 'Av. Circunvalación, San Pedro Sula', '0501-2005-00042', '2553-8800', 'ventas@distnorte.hn', 'Ana Flores', '2018-07-20', 'Activo'),
(3, 'Farmacia Vida Sana', 'Col. Palmira, Calle Principal, Tegucigalpa', '0801-2012-00078', '2239-1100', 'contacto@vidasana.hn', 'Roberto Paz', '2022-01-10', 'Activo');

-- SUCURSALES
INSERT INTO sucursales (idsuc, idempresa, sucursal, dirsuc, telefono, estado) VALUES
(1, 1, 'Casa Matriz Tegucigalpa', 'Blvd. Morazán, Torre Corporativa Piso 5', '2232-5501', 'Activo'),
(2, 1, 'Sucursal San Pedro Sula', 'Blvd. del Sur, Plaza Millenium Local 12', '2553-4400', 'Activo'),
(3, 2, 'Bodega Central SPS', 'Zona Industrial, 3ra Avenida NE', '2553-8801', 'Activo'),
(4, 2, 'Sucursal La Ceiba', 'Av. San Isidro, Barrio El Centro', '2443-2200', 'Activo'),
(5, 3, 'Farmacia Palmira', 'Col. Palmira, Calle Principal #45', '2239-1101', 'Activo'),
(6, 3, 'Farmacia Kennedy', 'Col. Kennedy, Bloque M, Casa 10', '2232-7700', 'Activo');

-- AREAS DE TRABAJO
INSERT INTO areas_trabajo (idarea, idempresa, idsuc, area, fecha_creacion, estado) VALUES
(1, 1, 1, 'Desarrollo de Software', '2020-03-15', 'Activo'),
(2, 1, 1, 'Soporte Técnico', '2020-04-01', 'Activo'),
(3, 1, 2, 'Ventas Corporativas', '2021-01-10', 'Activo'),
(4, 2, 3, 'Logística y Almacén', '2018-08-01', 'Activo'),
(5, 2, 4, 'Atención al Cliente', '2019-03-15', 'Activo'),
(6, 3, 5, 'Farmacia y Despacho', '2022-01-10', 'Activo'),
(7, 3, 6, 'Administración', '2022-02-01', 'Activo');

-- TIPO USUARIO
INSERT INTO tipousuario (idtpusuario, idempresa, tipo, estado) VALUES
(1, 1, 'Administrador', 'Activo'),
(2, 1, 'Vendedor', 'Activo'),
(3, 2, 'Administrador', 'Activo'),
(4, 2, 'Bodeguero', 'Activo'),
(5, 3, 'Administrador', 'Activo'),
(6, 3, 'Farmacéutico', 'Activo');

-- TIPO PRODUCTO
INSERT INTO tipoproducto (idtpprod, idempresa, tipo, estado) VALUES
(1, 1, 'Hardware', 'Activo'),
(2, 1, 'Software', 'Activo'),
(3, 1, 'Accesorios', 'Activo'),
(4, 2, 'Alimentos', 'Activo'),
(5, 2, 'Bebidas', 'Activo'),
(6, 2, 'Limpieza', 'Activo'),
(7, 3, 'Medicamento', 'Activo'),
(8, 3, 'Cuidado Personal', 'Activo');

-- EMPLEADOS
INSERT INTO empleados (idemp, idempresa, idsuc, idarea, identidad, fecha_nac, nombres, apellidos, genero, estado_civil, direccion, fecha_creacion, estado) VALUES
(1, 1, 1, 1, '0801-1990-05234', '1990-05-14', 'Carlos Eduardo', 'Mejía López', 'Masculino', 'Casado', 'Col. Lomas del Guijarro, Tegucigalpa', '2020-03-15', 'Activo'),
(2, 1, 1, 2, '0801-1993-08112', '1993-08-22', 'María Fernanda', 'Rodríguez Cruz', 'Femenino', 'Soltera', 'Res. Villa Olímpica, Tegucigalpa', '2020-06-01', 'Activo'),
(3, 1, 2, 3, '0501-1988-12045', '1988-12-03', 'José Antonio', 'Hernández Reyes', 'Masculino', 'Casado', 'Col. Trejo, San Pedro Sula', '2021-01-10', 'Activo'),
(4, 2, 3, 4, '0501-1995-03210', '1995-03-18', 'Laura Patricia', 'Gómez Pineda', 'Femenino', 'Soltera', 'Bo. Guamilito, San Pedro Sula', '2018-08-15', 'Activo'),
(5, 2, 4, 5, '0101-1991-07089', '1991-07-25', 'Roberto Carlos', 'Paz Velásquez', 'Masculino', 'Casado', 'Col. El Naranjal, La Ceiba', '2019-04-01', 'Activo'),
(6, 3, 5, 6, '0801-1987-11156', '1987-11-09', 'Ana Gabriela', 'Flores Martínez', 'Femenino', 'Casada', 'Col. Palmira, Tegucigalpa', '2022-01-15', 'Activo'),
(7, 3, 6, 7, '0801-1992-02078', '1992-02-28', 'Daniel Alejandro', 'Torres Castillo', 'Masculino', 'Soltero', 'Col. Kennedy, Tegucigalpa', '2022-02-10', 'Activo'),
(8, 1, 1, 1, '0801-1996-09345', '1996-09-10', 'Sofía Valentina', 'Ramos Díaz', 'Femenino', 'Soltera', 'Col. Miraflores, Tegucigalpa', '2023-01-15', 'Activo'),
(9, 2, 3, 4, '0501-1994-06123', '1994-06-05', 'Miguel Ángel', 'Sánchez Ortega', 'Masculino', 'Soltero', 'Res. Los Álamos, San Pedro Sula', '2020-05-20', 'Activo'),
(10, 3, 5, 6, '0801-1989-04067', '1989-04-17', 'Claudia María', 'Vásquez Reyes', 'Femenino', 'Casada', 'Col. Las Minitas, Tegucigalpa', '2022-06-01', 'Activo');

-- USUARIO
INSERT INTO usuario (userid, idempresa, idsuc, idtpusuario, idemp, usuario, clave, tipo, estado) VALUES
(1, 1, 1, 1, 1, 'cmejia', 'admin123', 'Administrador', 'Activo'),
(2, 1, 1, 2, 2, 'mrodriguez', 'vendedor01', 'Vendedor', 'Activo'),
(3, 1, 2, 2, 3, 'jhernandez', 'vendedor02', 'Vendedor', 'Activo'),
(4, 2, 3, 3, 4, 'lgomez', 'admin456', 'Administrador', 'Activo'),
(5, 2, 4, 4, 5, 'rpaz', 'bodega01', 'Bodeguero', 'Activo'),
(6, 3, 5, 5, 6, 'aflores', 'admin789', 'Administrador', 'Activo'),
(7, 3, 6, 6, 7, 'dtorres', 'farma01', 'Farmacéutico', 'Activo');

-- CLIENTES
INSERT INTO clientes (num_clie, idempresa, idsuc, identidad, rtn, fecha_nac, nombre, telefono, direccion, correo, fecha_creacion, estado) VALUES
(1, 1, 1, '0801-1985-04123', '0801-1985-04123', '1985-04-10', 'Pedro Martínez', '9845-6723', 'Col. Florencia, Tegucigalpa', 'pmartinez@gmail.com', '2023-01-20', 'Activo'),
(2, 1, 1, '0801-1990-07089', '0801-1990-07089', '1990-07-15', 'Lucía Andrade', '3312-4556', 'Res. Honduras, Tegucigalpa', 'landrade@hotmail.com', '2023-02-14', 'Activo'),
(3, 1, 2, '0501-1988-11234', '0501-1988-11234', '1988-11-20', 'Fernando Reyes', '9901-3345', 'Col. Las Palmas, San Pedro Sula', 'freyes@yahoo.com', '2023-03-05', 'Activo'),
(4, 2, 3, '0501-1992-01056', '0501-1992-01056', '1992-01-08', 'Carolina Banegas', '9567-1234', 'Bo. Medina, San Pedro Sula', 'cbanegas@gmail.com', '2022-06-10', 'Activo'),
(5, 2, 4, '0101-1995-05078', '0101-1995-05078', '1995-05-22', 'Oscar Portillo', '3189-7788', 'Col. El Centro, La Ceiba', 'oportillo@outlook.com', '2022-08-15', 'Activo'),
(6, 3, 5, '0801-1983-09145', '0801-1983-09145', '1983-09-30', 'Mariana Castellanos', '9723-5566', 'Col. Loma Linda, Tegucigalpa', 'mcastellanos@gmail.com', '2023-04-01', 'Activo'),
(7, 3, 6, '0801-1997-12200', '0801-1997-12200', '1997-12-05', 'Andrés Ochoa', '8834-2211', 'Col. Kennedy, Tegucigalpa', 'aochoa@gmail.com', '2023-05-18', 'Activo'),
(8, 1, 1, '0801-1980-06034', '0801-1980-06034', '1980-06-12', 'Gloria Bustillo', '2235-9900', 'Col. Torocagua, Tegucigalpa', 'gbustillo@empresa.hn', '2024-01-08', 'Activo'),
(9, 2, 3, '0501-1998-03167', '0501-1998-03167', '1998-03-25', 'Kevin Aguilar', '9456-7890', 'Res. Country, San Pedro Sula', 'kaguilar@live.com', '2024-02-20', 'Activo'),
(10, 3, 5, '0801-1991-08090', '0801-1991-08090', '1991-08-14', 'Diana Sorto', '3345-6677', 'Col. Miramontes, Tegucigalpa', 'dsorto@gmail.com', '2024-03-10', 'Activo');

-- PROVEEDOR
INSERT INTO proveedor (idprov, idempresa, proveedor, direccion, telefono, responsable, fecha_creacion, observaciones, estado) VALUES
(1, 1, 'CompuMax Internacional', 'Miami, FL - USA', '001-305-5551234', 'John Smith', '2020-04-01', 'Proveedor principal de hardware y componentes', 'Activo'),
(2, 1, 'SoftLicencias CA', 'San José, Costa Rica', '506-2234-5678', 'Alejandra Mora', '2021-02-15', 'Licencias Microsoft, Adobe y antivirus', 'Activo'),
(3, 2, 'Alimentos del Valle', 'Villanueva, Cortés', '2564-3300', 'Mario Caballero', '2018-09-10', 'Granos básicos, lácteos y embutidos', 'Activo'),
(4, 2, 'Bebidas Tropicales S.A.', 'Choloma, Cortés', '2669-4455', 'Patricia Laínez', '2019-01-20', 'Jugos naturales, aguas y refrescos', 'Activo'),
(5, 3, 'Laboratorios MediFarma', 'Guatemala City, Guatemala', '502-2345-6789', 'Dr. Luis Méndez', '2022-02-01', 'Medicamentos genéricos y de marca', 'Activo'),
(6, 3, 'Distribuidora Salud Total', 'San Salvador, El Salvador', '503-2567-8901', 'Carmen Rivera', '2022-03-15', 'Productos de cuidado personal e higiene', 'Activo');

-- FORMA DE PAGO
INSERT INTO formapago (idfpago, idempresa, formapago, estado) VALUES
(1, 1, 'Efectivo', 'Activo'),
(2, 1, 'Tarjeta de Crédito', 'Activo'),
(3, 1, 'Transferencia Bancaria', 'Activo'),
(4, 2, 'Efectivo', 'Activo'),
(5, 2, 'Tarjeta de Débito', 'Activo'),
(6, 2, 'Crédito a 30 días', 'Activo'),
(7, 3, 'Efectivo', 'Activo'),
(8, 3, 'Tarjeta de Crédito', 'Activo'),
(9, 3, 'Seguro Médico', 'Activo');

-- PRODUCTO
INSERT INTO producto (num_prod, idempresa, idsuc, idtpprod, descripcion, presentacion, marca, valor, precioventa, existencia, fecha_ingreso, fecha_actualiza, estado) VALUES
(1, 1, 1, 1, 'Laptop Empresarial 15.6"', 'Unidad', 'Dell', 18500.00, 22500.00, 15, '2024-01-10', '2024-06-15', 'Activo'),
(2, 1, 1, 1, 'Monitor 27" 4K', 'Unidad', 'LG', 8200.00, 10500.00, 25, '2024-02-05', '2024-06-15', 'Activo'),
(3, 1, 1, 2, 'Microsoft Office 365 Anual', 'Licencia', 'Microsoft', 1800.00, 2500.00, 50, '2024-01-15', '2024-06-01', 'Activo'),
(4, 1, 2, 3, 'Mouse Inalámbrico Ergonómico', 'Unidad', 'Logitech', 450.00, 650.00, 80, '2024-03-01', '2024-06-10', 'Activo'),
(5, 1, 2, 3, 'Teclado Mecánico RGB', 'Unidad', 'HyperX', 1200.00, 1650.00, 40, '2024-03-01', '2024-06-10', 'Activo'),
(6, 2, 3, 4, 'Arroz Grado 1', 'Quintal (100 lb)', 'Del Campo', 850.00, 1050.00, 200, '2024-05-01', '2024-06-20', 'Activo'),
(7, 2, 3, 4, 'Frijoles Rojos de Seda', 'Quintal (100 lb)', 'La Hacienda', 1200.00, 1500.00, 150, '2024-05-01', '2024-06-20', 'Activo'),
(8, 2, 3, 5, 'Jugo de Naranja Natural', 'Caja 12 unidades', 'Sula', 180.00, 250.00, 300, '2024-05-10', '2024-06-18', 'Activo'),
(9, 2, 4, 6, 'Desinfectante Multiusos', 'Galón', 'Olimpo', 95.00, 145.00, 120, '2024-04-15', '2024-06-12', 'Activo'),
(10, 3, 5, 7, 'Acetaminofén 500mg', 'Caja 100 tabletas', 'MK', 85.00, 135.00, 500, '2024-03-20', '2024-06-25', 'Activo'),
(11, 3, 5, 7, 'Amoxicilina 500mg', 'Caja 21 cápsulas', 'Bayer', 120.00, 195.00, 350, '2024-03-20', '2024-06-25', 'Activo'),
(12, 3, 6, 8, 'Shampoo Anticaspa', 'Frasco 400ml', 'Head & Shoulders', 145.00, 210.00, 180, '2024-04-01', '2024-06-20', 'Activo'),
(13, 3, 6, 8, 'Protector Solar SPF 50', 'Tubo 120ml', 'Nivea', 280.00, 395.00, 90, '2024-04-10', '2024-06-22', 'Activo'),
(14, 1, 1, 1, 'Impresora Láser Color', 'Unidad', 'HP', 6500.00, 8200.00, 10, '2024-02-20', '2024-06-15', 'Activo'),
(15, 2, 4, 5, 'Agua Purificada', 'Paquete 24 botellas', 'Aguazul', 120.00, 175.00, 250, '2024-05-15', '2024-06-18', 'Activo');
`;

conn.connect(err => {
  if (err) { console.error('Error de conexión:', err); process.exit(1); }
  console.log('Conectado a MySQL...');

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error ejecutando SQL:', err);
      conn.end();
      process.exit(1);
    }
    console.log('✅ Todas las tablas han sido limpiadas e inyectadas con datos nuevos exitosamente.');
    console.log('');
    console.log('Resumen de datos insertados:');
    console.log('  - 3 empresas');
    console.log('  - 6 sucursales');
    console.log('  - 7 áreas de trabajo');
    console.log('  - 6 tipos de usuario');
    console.log('  - 8 tipos de producto');
    console.log('  - 10 empleados');
    console.log('  - 7 usuarios');
    console.log('  - 10 clientes');
    console.log('  - 6 proveedores');
    console.log('  - 9 formas de pago');
    console.log('  - 15 productos');
    console.log('');
    console.log('Credenciales de acceso:');
    console.log('  Usuario: cmejia  |  Contraseña: admin123');
    console.log('  Usuario: lgomez  |  Contraseña: admin456');
    console.log('  Usuario: aflores |  Contraseña: admin789');
    conn.end();
  });
});
