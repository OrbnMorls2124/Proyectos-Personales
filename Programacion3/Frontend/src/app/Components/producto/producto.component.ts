import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {

  TData: any[] = [];
  empresas: any[] = [];
  sucursales: any[] = [];
  tiposProducto: any[] = [];
  searchTerm: string = '';
  filteredTData: any[] = [];
  item: any = { 
    num_prod: null, 
    idempresa: null, 
    idsuc: null, 
    idtpprod: null, 
    descripcion: null, 
    presentacion: null, 
    marca: null, 
    valor: null, 
    precioventa: null, 
    existencia: null, 
    fecha_ingreso: null, 
    fecha_actualiza: null, 
    estado: 'Activo' 
  };
  editMode = false;

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    this.getEmpresas();
    this.getSucursales();
    this.getTiposProducto();
    const id = this.route.snapshot.paramMap.get('num_prod');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/producto').subscribe((res: any) => { this.item = res; });
    }
  }

  getData() {
    this.Data.getAll('/producto').subscribe((res: any) => { 
      this.TData = res; 
      this.filteredTData = this.TData;
    }, err => console.error(err));
  }

  getEmpresas() {
    this.Data.getAll('/empresa').subscribe((res: any) => { this.empresas = res; }, err => console.error(err));
  }

  getSucursales() {
    this.Data.getAll('/sucursales').subscribe((res: any) => { this.sucursales = res; }, err => console.error(err));
  }

  getTiposProducto() {
    this.Data.getAll('/tipoproducto').subscribe((res: any) => { this.tiposProducto = res; }, err => console.error(err));
  }

  filterData() {
    this.filteredTData = this.TData.filter(item =>
      item.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.marca?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.sucursal?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.tipo_producto?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  Guardar() {
    if (this.editMode) {
      this.Data.update(this.item.num_prod, this.item, '/producto').subscribe(() => {
        this.router.navigate(['/producto']);
      });
    } else {
      const body = { ...this.item }; delete body.num_prod;
      this.Data.save(body, '/producto').subscribe(() => { this.reset(); }, err => console.error(err));
    }
  }

  Editar(row: any) { this.item = { ...row }; this.editMode = true; }

  Eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.Data.delete(id, '/producto').subscribe(() => this.getData(), err => console.error(err));
    }
  }

  reset() {
    this.item = { 
      num_prod: null, 
      idempresa: null, 
      idsuc: null, 
      idtpprod: null, 
      descripcion: null, 
      presentacion: null, 
      marca: null, 
      valor: null, 
      precioventa: null, 
      existencia: null, 
      fecha_ingreso: null, 
      fecha_actualiza: null, 
      estado: 'Activo' 
    };
    this.editMode = false;
    this.getData();
  }
}
