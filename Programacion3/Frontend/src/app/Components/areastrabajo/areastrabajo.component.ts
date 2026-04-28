import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { areastrabajo } from '../../Intefaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-areastrabajo',
  templateUrl: './areastrabajo.component.html',
  styleUrl: './areastrabajo.component.css'
})
export class AreastrabajoComponent  implements OnInit {

  TUser: any[] = [];
  empresas: any[] = [];
  sucursales: any[] = [];
  editMode = false;
  searchTerm: string = '';
  filteredTUser: any[] = [];
  user: areastrabajo = {
    idarea:  null ,
    idempresa: null,
    idsuc: null,
    area: null,
    fecha_creacion: null,
    estado: 'Activo'
  }

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
    this.getEmpresas();
    this.getSucursales();
    const id = this.route.snapshot.paramMap.get('idarea');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/areastrabajo').subscribe({
        next: (res: any) => { this.user = res; },
        error: (err) => console.error(err),
      });
    }
  }
  getUser() {
    this.Data.getAll('/areastrabajo')
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

  getSucursales() {
    this.Data.getAll('/sucursales')
      .subscribe(res => {
          this.sucursales = res;
        }, err => console.error(err));
  }

  filterData() {
    this.filteredTUser = this.TUser.filter((item: any) =>
      item.area?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.sucursal?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  Guardar(){
    if (this.editMode && this.user.idarea != null) {
      this.Data.update(this.user.idarea, this.user, '/areastrabajo').subscribe({
        next: () => this.router.navigate(['/areastrabajo']),
        error: (err) => console.error(err),
      });
      return;
    }

    const body: any = { ...this.user };
    delete body.idarea;
    this.Data.save(body,'/areastrabajo').subscribe({
      next: () => {
        this.resetForm();
        this.getUser();
      },
      error: (err) => console.error(err),
    });
  }
  EliminarData(idarea: number){
    this.Data.delete(idarea,'/areastrabajo')
      .subscribe(
        res => {
          this.getUser();
        },
        err => console.error(err)
      );
  }

  resetForm() {
    this.user = {
      idarea: null,
      idempresa: null,
      idsuc: null,
      area: null,
      fecha_creacion: null,
      estado: 'Activo'
    };
    this.editMode = false;
  }

}
