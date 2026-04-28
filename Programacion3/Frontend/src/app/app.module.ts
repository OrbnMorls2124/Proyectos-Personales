import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { DataService } from './Services/data.service';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmpresaComponent,
    SucursalesComponent,
    ProveedorComponent,
    AreastrabajoComponent,
    EmpleadosComponent,
    ClientesComponent,
    TipousuarioComponent,
    UsuarioComponent,
    TipoproductoComponent,
    ProductoComponent,
    FormapagoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
