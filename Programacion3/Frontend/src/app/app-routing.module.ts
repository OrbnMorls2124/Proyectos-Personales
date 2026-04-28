import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaComponent } from './Components/empresa/empresa.component';
import { SucursalesComponent } from './Components/sucursales/sucursales.component';
import { ProveedorComponent } from './Components/proveedor/proveedor.component';
import { AreastrabajoComponent } from './Components/areastrabajo/areastrabajo.component';
import { EmpleadosComponent } from './Components/empleados/empleados.component';
import { ClientesComponent } from './Components/clientes/clientes.component';
import { TipousuarioComponent } from './Components/tipousuario/tipousuario.component';
import { UsuarioComponent } from './Components/usuario/usuario.component';
import { TipoproductoComponent } from './Components/tipoproducto/tipoproducto.component';
import { ProductoComponent } from './Components/producto/producto.component';
import { FormapagoComponent } from './Components/formapago/formapago.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './Services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'empresa', pathMatch: 'full' },

  { path: 'empresa', component: EmpresaComponent, canActivate: [AuthGuard] },
  { path: 'empresa/edit/:idempresa', component: EmpresaComponent, canActivate: [AuthGuard] },

  { path: 'sucursales', component: SucursalesComponent, canActivate: [AuthGuard] },
  { path: 'sucursales/edit/:idsuc', component: SucursalesComponent, canActivate: [AuthGuard] },

  { path: 'proveedor', component: ProveedorComponent, canActivate: [AuthGuard] },
  { path: 'proveedor/edit/:idprov', component: ProveedorComponent, canActivate: [AuthGuard] },

  { path: 'areastrabajo', component: AreastrabajoComponent, canActivate: [AuthGuard] },
  { path: 'areastrabajo/edit/:idarea', component: AreastrabajoComponent, canActivate: [AuthGuard] },

  { path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard] },
  { path: 'empleados/edit/:idemp', component: EmpleadosComponent, canActivate: [AuthGuard] },

  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
  { path: 'clientes/edit/:num_clie', component: ClientesComponent, canActivate: [AuthGuard] },

  { path: 'tipousuario', component: TipousuarioComponent, canActivate: [AuthGuard] },
  { path: 'tipousuario/edit/:idtpusuario', component: TipousuarioComponent, canActivate: [AuthGuard] },

  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'usuario/edit/:userid', component: UsuarioComponent, canActivate: [AuthGuard] },

  { path: 'tipoproducto', component: TipoproductoComponent, canActivate: [AuthGuard] },
  { path: 'tipoproducto/edit/:idtpprod', component: TipoproductoComponent, canActivate: [AuthGuard] },

  { path: 'producto', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: 'producto/edit/:num_prod', component: ProductoComponent, canActivate: [AuthGuard] },

  { path: 'formapago', component: FormapagoComponent, canActivate: [AuthGuard] },
  { path: 'formapago/edit/:idfpago', component: FormapagoComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'empresa' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
