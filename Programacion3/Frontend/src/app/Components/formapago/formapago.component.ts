import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-formapago',
  templateUrl: './formapago.component.html',
  styleUrl: './formapago.component.css'
})
export class FormapagoComponent implements OnInit {

  TData: any[] = [];
  item: any = { idfpago: null, forma_pago: null, estado: 'Activo' };
  editMode = false;
  searchTerm: string = '';
  filteredTData: any[] = [];

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    const id = this.route.snapshot.paramMap.get('idfpago');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/formapago').subscribe((res: any) => { this.item = res; });
    }
  }

  getData() {
    this.Data.getAll('/formapago').subscribe((res: any) => { 
      this.TData = res; 
      this.filteredTData = this.TData;
    }, err => console.error(err));
  }

  Guardar() {
    if (this.editMode) {
      this.Data.update(this.item.idfpago, this.item, '/formapago').subscribe(() => {
        this.router.navigate(['/formapago']);
      });
    } else {
      const body = { ...this.item }; delete body.idfpago;
      this.Data.save(body, '/formapago').subscribe(() => { this.reset(); }, err => console.error(err));
    }
  }

  Editar(row: any) { this.item = { ...row }; this.editMode = true; }

  Eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.Data.delete(id, '/formapago').subscribe(() => this.getData(), err => console.error(err));
    }
  }

  filterData() {
    this.filteredTData = this.TData.filter(item =>
      item.forma_pago?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  reset() {
    this.item = { idfpago: null, forma_pago: null, estado: 'Activo' };
    this.editMode = false;
    this.getData();
  }
}
