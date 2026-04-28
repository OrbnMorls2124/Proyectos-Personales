import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-tipoproducto',
  templateUrl: './tipoproducto.component.html',
  styleUrl: './tipoproducto.component.css'
})
export class TipoproductoComponent implements OnInit {

  TData: any[] = [];
  item: any = { idtpprod: null, tipo_producto: null, estado: 'Activo' };
  editMode = false;
  searchTerm: string = '';
  filteredTData: any[] = [];

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    const id = this.route.snapshot.paramMap.get('idtpprod');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/tipoproducto').subscribe((res: any) => { this.item = res; });
    }
  }

  getData() {
    this.Data.getAll('/tipoproducto').subscribe((res: any) => { 
      this.TData = res; 
      this.filteredTData = this.TData;
    }, err => console.error(err));
  }

  Guardar() {
    if (this.editMode) {
      this.Data.update(this.item.idtpprod, this.item, '/tipoproducto').subscribe(() => {
        this.router.navigate(['/tipoproducto']);
      });
    } else {
      const body = { ...this.item }; delete body.idtpprod;
      this.Data.save(body, '/tipoproducto').subscribe(() => { this.reset(); }, err => console.error(err));
    }
  }

  Editar(row: any) { this.item = { ...row }; this.editMode = true; }

  Eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.Data.delete(id, '/tipoproducto').subscribe(() => this.getData(), err => console.error(err));
    }
  }

  filterData() {
    this.filteredTData = this.TData.filter(item =>
      item.tipo_producto?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  reset() {
    this.item = { idtpprod: null, tipo_producto: null, estado: 'Activo' };
    this.editMode = false;
    this.getData();
  }
}
