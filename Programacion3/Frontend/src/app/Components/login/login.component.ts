import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async ingresar() {
    this.error = '';
    this.loading = true;

    this.auth.login(this.usuario, this.contrasena).subscribe((ok) => {
      this.loading = false;
      if (!ok) {
        this.error = 'Usuario o contraseña incorrectos';
        return;
      }
      this.router.navigate(['/empresa']);
    });
  }
}

