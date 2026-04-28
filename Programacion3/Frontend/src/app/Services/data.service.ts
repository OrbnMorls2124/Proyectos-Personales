import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'


import { User } from '../Intefaces/user';

import { throwError, Observable, retry, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  getAll<T = any[]>(url: string): Observable<T> {
    return this.http.get<T>(`${this.API_URI}` + url, { withCredentials: true });
  }
  getOne<T = any>(id: string, url: string): Observable<T> {
    return this.http.get<T>(`${this.API_URI}` + url + `/${id}`, { withCredentials: true });
}
delete(id: number, url: string) {
  return this.http.delete(`${this.API_URI}` + url + `/${id}`, { withCredentials: true });
}
update(id: string|number, updated: any, url: string): Observable<any> {
  return this.http.post(`${this.API_URI}` + url + `/${id}`, updated, { withCredentials: true });
}
save(Usuario: any, url: string) {
   let headers = new HttpHeaders();
   headers = new HttpHeaders().set('Content-Type', 'application/json');
   return this.http.post(`${this.API_URI}` + url , JSON.stringify(Usuario), {headers: headers, withCredentials: true})
   .pipe(
    retry(1),
    catchError(this.errorHandl)
  );
  }
  // Métodos para obtener información de tablas de la BD
  getAllTables() {
    return this.http.get(`${this.API_URI}/database/tables`, { withCredentials: true });
  }

  getTableStructure(tableName: string) {
    return this.http.get(`${this.API_URI}/database/tables/${tableName}/structure`, { withCredentials: true });
  }

  getTableData(tableName: string, limit: number = 10, offset: number = 0) {
    return this.http.get(`${this.API_URI}/database/tables/${tableName}/data?limit=${limit}&offset=${offset}`, { withCredentials: true });
  }

  errorHandl(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}
