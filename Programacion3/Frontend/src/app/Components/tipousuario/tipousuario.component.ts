import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-tipousuario',
  templateUrl: './tipousuario.component.html',
  styleUrl: './tipousuario.component.css'
})
export class TipousuarioComponent implements OnInit {

  TData: any[] = [];
  item: any = { idtpusuario: null, descripcion: null, estado: 'Activo' };
  editMode = false;
  searchTerm: string = '';
  filteredTData: any[] = [];

  constructor(private Data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    const id = this.route.snapshot.paramMap.get('idtpusuario');
    if (id) {
      this.editMode = true;
      this.Data.getOne(id, '/tipousuario').subscribe((res: any) => { this.item = res; });
    }
  }

  getData() {
    this.Data.getAll('/tipousuario').subscribe((res: any) => { 
      this.TData = res; 
      this.filteredTData = this.TData;
    }, err => console.error(err));
  }

  Guardar() {
    if (this.editMode) {
      this.Data.update(this.item.idtpusuario, this.item, '/tipousuario').subscribe(() => {
        this.router.navigate(['/tipousuario']);
      });
    } else {
      const body = { ...this.item }; delete body.idtpusuario;
      this.Data.save(body, '/tipousuario').subscribe(() => { this.reset(); }, err => console.error(err));
    }
  }

  Editar(row: any) { this.item = { ...row }; this.editMode = true; }

  Eliminar(id: number) {
    if (confirm('¿Eliminar este registro?')) {
      this.Data.delete(id, '/tipousuario').subscribe(() => this.getData(), err => console.error(err));
    }
  }

  filterData() {
    this.filteredTData = this.TData.filter(item =>
      item.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  reset() {
    this.item = { idtpusuario: null, descripcion: null, estado: 'Activo' };
    this.editMode = false;
    this.getData();
  }
}
