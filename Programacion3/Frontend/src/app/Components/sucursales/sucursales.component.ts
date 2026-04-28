import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';
import { sucursales } from '../../Intefaces/user';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.css'
})
export class SucursalesComponent  implements OnInit {

  TUser: any = [];
  empresas: any[] = [];
  editMode = false;
  searchTerm: string = '';
  filteredTUser: any[] = [];
  user: sucursales = {
    idsuc:  null ,
    idempresa: null,
    sucursal: null,
    dirsuc: null,
    telefono: null,
    estado: 'Activo'
  }

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
    this.getEmpresas();
    const id = this.route.snapshot.paramMap.get('idsuc');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/sucursales').subscribe({
        next: (res: any) => { this.user = res; },
        error: (err) => console.error(err),
      });
    }
  }
  getUser() {
    this.Data.getAll('/sucursales')
      .subscribe(res => {
          this.TUser = res;
          this.filteredTUser = this.TUser;
        }, err => console.error(err));
  }

  getEmpresas() {
    this.Data.getAll('/empresa')
      .subscribe(res => {
          this.empresas = res as any[];
        }, err => console.error(err));
  }

  filterData() {
    this.filteredTUser = this.TUser.filter((item: any) =>
      item.sucursal?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.dirsuc?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  Guardar(){
    if (this.editMode && this.user.idsuc != null) {
      this.Data.update(this.user.idsuc, this.user, '/sucursales').subscribe({
        next: () => this.router.navigate(['/sucursales']),
        error: (err) => console.error(err),
      });
      return;
    }

    const body: any = { ...this.user };
    delete body.idsuc;
    this.Data.save(body,'/sucursales').subscribe({
      next: () => {
        this.resetForm();
        this.getUser();
      },
      error: (err) => console.error(err),
    });
  }
  EliminarData(idsuc: number){
    this.Data.delete(idsuc, '/sucursales')
      .subscribe(
        res => {
          this.getUser();
        },
        err => console.error(err)
      );
}

  resetForm() {
    this.user = {
      idsuc: null,
      idempresa: null,
      sucursal: null,
      dirsuc: null,
      telefono: null,
      estado: 'Activo'
    };
    this.editMode = false;
  }

}
