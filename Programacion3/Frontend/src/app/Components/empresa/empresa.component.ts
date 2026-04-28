import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { empresa } from '../../Intefaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent  implements OnInit {

  TUser: any[] = [];
  editMode = false;
  searchTerm: string = '';
  filteredTUser: any[] = [];
  user: empresa = {
    idempresa:  null ,
    nombre: null,
    direccion: null,
    rtn: null,
    telefono: null,
    correo: null,
    contacto: null,
    fecha_creacion: null,
    estado: 'Activo'
  }

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
    const id = this.route.snapshot.paramMap.get('idempresa');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/empresa').subscribe({
        next: (res: any) => { this.user = res; },
        error: (err) => console.error(err),
      });
    }
  }
  getUser() {
    this.Data.getAll('/empresa')
      .subscribe(res => {
          this.TUser = res;
          this.filteredTUser = this.TUser;
        }, err => console.error(err));
  }

  Guardar(){
    if (this.editMode && this.user.idempresa != null) {
      this.Data.update(this.user.idempresa, this.user, '/empresa').subscribe({
        next: () => this.router.navigate(['/empresa']),
        error: (err) => console.error(err),
      });
      return;
    }

    const body: any = { ...this.user };
    delete body.idempresa;
    this.Data.save(body,'/empresa').subscribe({
      next: () => {
        this.resetForm();
        this.getUser();
      },
      error: (err) => console.error(err),
    });
  }

  EliminarData(idempresa: number){
    this.Data.delete(idempresa, '/empresa')
      .subscribe(
        res => {
          this.getUser();
        },
        err => console.error(err)
      );
  }

  filterData() {
    this.filteredTUser = this.TUser.filter((item: any) =>
      item.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.direccion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.rtn?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.telefono?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.correo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.contacto?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  resetForm() {
    this.user = {
      idempresa: null,
      nombre: null,
      direccion: null,
      rtn: null,
      telefono: null,
      correo: null,
      contacto: null,
      fecha_creacion: null,
      estado: 'Activo'
    };
    this.editMode = false;
  }

}
