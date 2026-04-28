import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';
import { proveedor } from '../../Intefaces/user';


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent  implements OnInit {

  TUser: any[] = [];
  empresas: any[] = [];
  editMode = false;
  searchTerm: string = '';
  filteredTUser: any[] = [];
  user: proveedor = {
    idprov:  null ,
    idempresa: null,
    proveedor: null,
    direccion: null,
    telefono: null,
    responsable: null,
    fecha_creacion: null,
    observaciones: null,
    estado: 'Activo'
  }

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
    this.getEmpresas();
    const id = this.route.snapshot.paramMap.get('idprov');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/proveedor').subscribe({
        next: (res: any) => { this.user = res; },
        error: (err) => console.error(err),
      });
    }
  }
  getUser() {
    this.Data.getAll('/proveedor')
      .subscribe(res => {
          this.TUser = res;
          this.filteredTUser = this.TUser;
        }, err => console.error(err));
  }

  getEmpresas() {
    this.Data.getAll('/empresa')
      .subscribe(res => {
          this.empresas = res;
        }, err => console.error(err));
  }

  filterData() {
    this.filteredTUser = this.TUser.filter((item: any) =>
      item.proveedor?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.responsable?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  Guardar(){
    if (this.editMode && this.user.idprov != null) {
      this.Data.update(this.user.idprov, this.user, '/proveedor').subscribe({
        next: () => this.router.navigate(['/proveedor']),
        error: (err) => console.error(err),
      });
      return;
    }

    const body: any = { ...this.user };
    delete body.idprov;
    this.Data.save(body,'/proveedor').subscribe({
      next: () => {
        this.resetForm();
        this.getUser();
      },
      error: (err) => console.error(err),
    });
  }
  EliminarData(idprov: number){
    this.Data.delete(idprov, '/proveedor')
      .subscribe(
        res => {
          this.getUser();
        },
        err => console.error(err)
      );
}

  resetForm() {
    this.user = {
      idprov: null,
      idempresa: null,
      proveedor: null,
      direccion: null,
      telefono: null,
      responsable: null,
      fecha_creacion: null,
      observaciones: null,
      estado: 'Activo'
    };
    this.editMode = false;
  }

}
