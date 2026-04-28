import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from './Services/data.service';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  tables: any[] = [];
  loading = true;
  darkMode = false;
  private isBrowser: boolean;

  constructor(public Data: DataService, public Auth: AuthService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.darkMode = this.isBrowser && localStorage.getItem('theme') === 'dark';
    this.applyTheme();
    if (!this.isBrowser) {
      this.loading = false;
      return;
    }
    this.Auth.bootstrap().subscribe(() => {
      this.loadTables();
    });
  }

  loadTables() {
    this.Data.getAllTables().subscribe({
      next: (response: any) => {
        this.tables = response.tables || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tablas:', error);
        this.loading = false;
      }
    });
  }

  formatTableName(tableName: string): string {
    // Convertir nombres de tabla a formato legible para el menú
    const formatted = tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  applyTheme() {
    if (!this.isBrowser) {
      return;
    }
    document.body.classList.toggle('theme-dark', this.darkMode);
  }

  salir() {
    this.Auth.logout().subscribe();
  }
}
