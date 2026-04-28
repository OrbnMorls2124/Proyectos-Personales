import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-tipousuario-edit',
  templateUrl: './tipousuario-edit.component.html',
  styleUrls: ['./tipousuario-edit.component.css']
})
export class TipousuarioEditComponent implements OnInit {
  item: any = { idtpusuario: null, descripcion: null, estado: 'Activo' };
  editMode = false;

  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idtpusuario');
    if (id) {
      this.editMode = true;
      this.data.getOne(id, '/tipousuario').subscribe((res: any) => {
        this.item = res;
      });
    }
  }

  Guardar() {
    if (this.editMode) {
      this.data.update(this.item.idtpusuario, this.item, '/tipousuario').subscribe(() => {
        this.router.navigate(['/tipousuario']);
      });
    } else {
      const body = { ...this.item };
      delete body.idtpusuario;
      this.data.save(body, '/tipousuario').subscribe(() => {
        this.router.navigate(['/tipousuario']);
      });
    }
  }
}
