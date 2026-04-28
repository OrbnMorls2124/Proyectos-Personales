export interface empresa{
  idempresa?: number | null;
  pais?: string | null;
  nombre?: string | null;
  direccion?: string | null;
  rtn?: string | null;
  telefono?: string | null;
  correo?: string | null;
  contacto?: string | null;
  fecha_creacion?: Date | null;
  estado?: string;
}

export interface User{
  ctipou?: number;
  descripcion?: string;
  estado?: string;
}

export interface sucursales{
  idsuc?:number | null;
  idempresa?:number | null;
  sucursal?:string| null;
  dirsuc?:string| null;
  telefono?:string| null;
  estado?:string;
}

export interface proveedor{
  idprov?:number | null;
  idempresa?:number | null;
  proveedor?:string| null;
  direccion?:string| null;
  telefono?:string| null;
  responsable?:string| null;
  fecha_creacion?:Date | null;
  observaciones?:string| null;
  estado?:string;
}
export interface areastrabajo{
  idarea?:number | null;
  idempresa?:number | null;
  idsuc?:number| null;
  area?:string| null;
  fecha_creacion?:Date | null;
  estado?:string;
}

export interface empleados{
  idemp?:number | null;
  idempresa?:number | null;
  idsuc?:number| null;
  idarea?:number| null;
  identidad?:string | null;
  fecha_nac?:Date | null;
  nombres?:string | null;
  apellidos?:string | null;
  genero?:string | null;
  estado_civil?:string | null;
  direccion?:string | null;
  fecha_creacion?:Date | null;
  estado?:string;
}

