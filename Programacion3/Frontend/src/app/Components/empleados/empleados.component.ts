import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';
import { empleados } from '../../Intefaces/user';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent  implements OnInit {

  TUser: any[] = [];
  editMode = false;
  empresas: any[] = [];
  sucursales: any[] = [];
  areas: any[] = [];
  searchTerm: string = '';
  filteredTUser: any[] = [];
  user: empleados = {
    idemp:  null ,
    idempresa: null,
    idsuc: null,
    idarea: null,
    identidad: null,
    fecha_nac: null,
    nombres: null,
    apellidos: null,
    genero: null,
    estado_civil: null,
    direccion: null,
    fecha_creacion: null,
    estado: 'Activo'
  }

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
    this.getEmpresas();
    this.getSucursales();
    this.getAreas();
    const id = this.route.snapshot.paramMap.get('idemp');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/empleados').subscribe({
        next: (res: any) => {
          this.user = res;
        },
        error: (err) => console.error(err),
      });
    }
  }
  getUser() {
    this.Data.getAll('/empleados')
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

  getAreas() {
    this.Data.getAll('/areas_trabajo')
      .subscribe(res => {
          this.areas = res;
        }, err => console.error(err));
  }

  filterData() {
    this.filteredTUser = this.TUser.filter((item: any) =>
      item.nombres?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.apellidos?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.identidad?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.sucursal?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.area?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  Guardar(){
    if (this.editMode && this.user.idemp != null) {
      this.Data.update(this.user.idemp, this.user, '/empleados').subscribe({
        next: () => this.router.navigate(['/empleados']),
        error: (err) => console.error(err),
      });
      return;
    }

    const body: any = { ...this.user };
    delete body.idemp;
    this.Data.save(body, '/empleados').subscribe({
      next: () => {
        this.resetForm();
        this.getUser();
      },
      error: (err) => console.error(err),
    });
  }

  EliminarData(idemp: number){
    this.Data.delete(idemp, '/empleados')
      .subscribe(
        res => {
          this.getUser();
        },
        err => console.error(err)
      );
  }

  resetForm() {
    this.user = {
      idemp: null,
      idempresa: null,
      idsuc: null,
      idarea: null,
      identidad: null,
      fecha_nac: null,
      nombres: null,
      apellidos: null,
      genero: null,
      estado_civil: null,
      direccion: null,
      fecha_creacion: null,
      estado: 'Activo'
    };
    this.editMode = false;
  }

}
