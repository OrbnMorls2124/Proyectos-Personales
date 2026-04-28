import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  TData: any[] = [];
  item: any = {
    num_clie: null,
    nombre: null,
    direccion: null,
    telefono: null,
    correo: null,
    estado: 'Activo'
  };
  editMode = false;
  searchTerm: string = '';
  filteredTData: any[] = [];

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    const id = this.route.snapshot.paramMap.get('num_clie');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/clientes').subscribe((res: any) => { this.item = res; });
    }
  }

  getData() {
    this.Data.getAll('/clientes').subscribe((res: any) => { 
      this.TData = res; 
      this.filteredTData = this.TData;
    }, err => console.error(err));
  }

  Guardar() {
    if (this.editMode) {
      this.Data.update(this.item.num_clie, this.item, '/clientes').subscribe(() => {
        this.router.navigate(['/clientes']);
      });
    } else {
      const body = { ...this.item }; delete body.num_clie;
      this.Data.save(body, '/clientes').subscribe(() => { this.reset(); }, err => console.error(err));
    }
  }

  Editar(row: any) {
    this.item = { ...row };
    this.editMode = true;
  }

  Eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.Data.delete(id, '/clientes').subscribe(() => this.getData(), err => console.error(err));
    }
  }

  filterData() {
    this.filteredTData = this.TData.filter(item =>
      item.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.direccion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.telefono?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.correo?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  reset() {
    this.item = { num_clie: null, nombre: null, direccion: null, telefono: null, correo: null, estado: 'Activo' };
    this.editMode = false;
    this.getData();
  }
}
