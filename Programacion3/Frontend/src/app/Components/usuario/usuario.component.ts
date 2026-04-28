import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  TData: any[] = [];
  tiposUsuario: any[] = [];
  empleados: any[] = [];
  searchTerm: string = '';
  filteredTData: any[] = [];
  item: any = { userid: null, idtpusuario: null, idemp: null, usuario: null, contrasena: null, estado: 'Activo' };
  editMode = false;

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    this.getTiposUsuario();
    this.getEmpleados();
    const id = this.route.snapshot.paramMap.get('userid');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/usuario').subscribe((res: any) => { this.item = res; });
    }
  }

  getData() {
    this.Data.getAll('/usuario').subscribe((res: any) => { 
      this.TData = res; 
      this.filteredTData = this.TData;
    }, err => console.error(err));
  }

  getTiposUsuario() {
    this.Data.getAll('/tipousuario').subscribe((res: any) => { this.tiposUsuario = res; }, err => console.error(err));
  }

  getEmpleados() {
    this.Data.getAll('/empleados').subscribe((res: any) => { this.empleados = res; }, err => console.error(err));
  }

  filterData() {
    this.filteredTData = this.TData.filter(item =>
      item.usuario?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.tipo_usuario?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.nombre_empleado?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.apellido_empleado?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  Guardar() {
    if (this.editMode) {
      this.Data.update(this.item.userid, this.item, '/usuario').subscribe(() => {
        this.router.navigate(['/usuario']);
      });
    } else {
      const body = { ...this.item }; delete body.userid;
      this.Data.save(body, '/usuario').subscribe(() => { this.reset(); }, err => console.error(err));
    }
  }

  Editar(row: any) { this.item = { ...row }; this.editMode = true; }

  Eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.Data.delete(id, '/usuario').subscribe(() => this.getData(), err => console.error(err));
    }
  }

  reset() {
    this.item = { userid: null, idtpusuario: null, idemp: null, usuario: null, contrasena: null, estado: 'Activo' };
    this.editMode = false;
    this.getData();
  }
}
